import { useState } from "react";
import { Film, ImageOff, Play } from "lucide-react";
import { cn } from "@/lib/utils";

/** media: [{ url, type: "image" | "video" }] */
export default function MediaGallery({ media, title }) {
  const [index, setIndex] = useState(0);

  if (!media.length) {
    return (
      <div className="flex aspect-[16/10] flex-col items-center justify-center gap-2 rounded-lg border bg-muted text-muted-foreground">
        <ImageOff className="h-8 w-8" />
        <p className="text-sm">No photos or videos added yet</p>
      </div>
    );
  }

  const current = Math.min(index, media.length - 1);
  const item = media[current];
  const photos = media.filter((m) => m.type === "image").length;
  const videos = media.length - photos;

  return (
    <div className="space-y-3">
      <div className="aspect-[16/10] overflow-hidden rounded-lg border bg-muted">
        {item.type === "video" ? (
          <video key={item.url} src={item.url} controls playsInline preload="metadata" className="h-full w-full bg-black object-contain">
            Your browser can't play this video.
          </video>
        ) : (
          <img src={item.url} alt={`${title}, photo ${current + 1} of ${media.length}`} className="h-full w-full object-cover" />
        )}
      </div>

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>{photos} {photos === 1 ? "photo" : "photos"}</span>
        {videos > 0 && <span className="flex items-center gap-1">· <Film className="h-3 w-3" /> {videos} {videos === 1 ? "video" : "videos"}</span>}
      </p>

      {media.length > 1 && (
        <ul className="flex gap-2 overflow-x-auto pb-1">
          {media.map((m, i) => (
            <li key={m.url} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show ${m.type} ${i + 1}`}
                aria-current={i === current}
                className={cn(
                  "relative h-16 w-24 overflow-hidden rounded-md border-2 bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  i === current ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                )}
              >
                {m.type === "video" ? (
                  <>
                    <video src={`${m.url}#t=0.1`} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-white"><Play className="h-4 w-4 fill-current" /></span>
                  </>
                ) : (
                  <img src={m.url} alt="" className="h-full w-full object-cover" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
