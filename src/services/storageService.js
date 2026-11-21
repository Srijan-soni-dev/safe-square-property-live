import { supabase } from "@/lib/supabaseClient";
import { IMAGE_BUCKET } from "@/lib/constants";
import { MIME_TO_EXT } from "@/lib/media";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const CONCURRENCY = 3; // upload a few files at a time so big videos don't choke the connection

/**
 * supabase-js has no upload-progress callback, so we call the Storage REST endpoint
 * with XMLHttpRequest (same request supabase-js makes) and read xhr.upload progress.
 */
function putFile({ path, file, mime, token, onProgress }) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const encodedPath = path.split("/").map(encodeURIComponent).join("/");
    xhr.open("POST", `${SUPABASE_URL}/storage/v1/object/${IMAGE_BUCKET}/${encodedPath}`);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("apikey", ANON_KEY);
    xhr.setRequestHeader("x-upsert", "false");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.min(99, Math.round((e.loaded / e.total) * 100)));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(100);
        resolve();
        return;
      }
      let message = `Upload failed (${xhr.status})`;
      try {
        message = JSON.parse(xhr.responseText).message || message;
      } catch {}
      reject(new Error(xhr.status === 413 ? "Payload too large (413)" : message));
    };
    xhr.onerror = () => reject(new Error("Network error while uploading"));
    xhr.onabort = () => reject(new Error("Upload cancelled"));

    const body = new FormData();
    body.append("cacheControl", "31536000");
    body.append("", file.type === mime ? file : new File([file], file.name, { type: mime }));
    xhr.send(body);
  });
}

/**
 * items: [{ id, file, mime, kind }]  ->  [{ type: "image" | "video", url }]  (same order)
 * onProgress(itemId, percent)
 */
export async function uploadMedia({ userId, propertyId, items, onProgress }) {
  if (!items?.length) return [];

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) throw new Error("Your session expired. Please sign in again.");

  const uploadedPaths = [];
  const results = new Array(items.length);
  let cursor = 0;
  let failure = null;

  async function worker() {
    while (cursor < items.length && !failure) {
      const index = cursor++;
      const item = items[index];
      const path = `${userId}/${propertyId}/${crypto.randomUUID()}.${MIME_TO_EXT[item.mime]}`;
      try {
        await putFile({ path, file: item.file, mime: item.mime, token, onProgress: (pct) => onProgress?.(item.id, pct) });
        uploadedPaths.push(path);
        results[index] = { type: item.kind, url: supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl };
      } catch (e) {
        failure = e;
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, worker));

  if (failure) {
    // Roll back files that did upload so no orphans are left behind
    if (uploadedPaths.length) await supabase.storage.from(IMAGE_BUCKET).remove(uploadedPaths);
    throw failure;
  }
  return results;
}

export function pathFromUrl(url) {
  const marker = `/${IMAGE_BUCKET}/`;
  const i = url.indexOf(marker);
  if (i === -1) return null;
  return decodeURIComponent(url.slice(i + marker.length).split("?")[0]);
}

export async function deleteMediaByUrls(urls) {
  const paths = (urls || []).map(pathFromUrl).filter(Boolean);
  if (!paths.length) return;
  const { error } = await supabase.storage.from(IMAGE_BUCKET).remove(paths);
  if (error) console.error("Could not delete some media files:", error.message);
}
