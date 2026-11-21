import { IMAGE_MIME_TYPES, MAX_IMAGE_SIZE_MB, MAX_VIDEO_SIZE_MB, VIDEO_MIME_TYPES } from "@/lib/constants";

const EXT_TO_MIME = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  mp4: "video/mp4",
  mov: "video/quicktime",
  webm: "video/webm",
};
export const MIME_TO_EXT = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "video/mp4": "mp4",
  "video/quicktime": "mov",
  "video/webm": "webm",
};

/** Some browsers leave file.type empty for .mov, so fall back to the extension. */
export function resolveMime(file) {
  if (file.type && MIME_TO_EXT[file.type]) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase();
  return EXT_TO_MIME[ext] || null;
}

export function mediaKind(mime) {
  if (IMAGE_MIME_TYPES.includes(mime)) return "image";
  if (VIDEO_MIME_TYPES.includes(mime)) return "video";
  return null;
}

/** Returns { mime, kind } or { error } */
export function validateMediaFile(file) {
  const mime = resolveMime(file);
  if (!mime) return { error: `${file.name}: unsupported type. Use JPG, PNG, WebP, MP4, MOV or WEBM.` };
  const kind = mediaKind(mime);
  const limit = kind === "image" ? MAX_IMAGE_SIZE_MB : MAX_VIDEO_SIZE_MB;
  if (file.size > limit * 1024 * 1024) {
    return { error: `${file.name}: ${kind}s can be up to ${limit} MB.` };
  }
  return { mime, kind };
}

/** Property row -> [{ url, type: "image" | "video" }] (images first, then videos) */
export function getMediaList(property) {
  return [
    ...(property?.images ?? []).map((url) => ({ url, type: "image" })),
    ...(property?.videos ?? []).map((url) => ({ url, type: "video" })),
  ];
}

export function splitMedia(list) {
  return {
    images: list.filter((m) => m.type === "image").map((m) => m.url),
    videos: list.filter((m) => m.type === "video").map((m) => m.url),
  };
}

export function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
