import { useRef, useState } from "react";
import { Film, ImagePlus, Play, X } from "lucide-react";
import { MAX_IMAGE_SIZE_MB, MAX_MEDIA_FILES, MAX_VIDEO_SIZE_MB, MEDIA_ACCEPT_ATTR } from "@/lib/constants";
import { formatFileSize } from "@/lib/media";
import { cn } from "@/lib/utils";

function Thumb({ src, type, label, cover, isNew, sizeLabel, progress, onRemove, disabled }) {
  const uploading = typeof progress === "number";
  return (
    <li className="group relative aspect-[4/3] overflow-hidden rounded-md border bg-muted">
      {type === "video" ? (
        <>
          <video src={`${src}#t=0.1`} muted playsInline preload="metadata" className="h-full w-full object-cover" aria-label={label} />
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white"><Play className="h-4 w-4 fill-current" /></span>
          </span>
        </>
      ) : (
        <img src={src} alt={label} className="h-full w-full object-cover" />
      )}

      {cover && <span className="absolute left-1.5 top-1.5 rounded bg-primary px-1.5 py-0.5 text-[11px] font-semibold text-primary-foreground">Cover</span>}
      {(isNew || type === "video") && !uploading && (
        <span className="absolute bottom-1.5 left-1.5 rounded bg-black/65 px-1.5 py-0.5 text-[11px] font-medium text-white">
          {isNew ? "New" : "Video"}{sizeLabel ? ` · ${sizeLabel}` : ""}
        </span>
      )}

      {uploading && (
        <div className="absolute inset-x-0 bottom-0 bg-black/70 px-2 py-1.5">
          <div className="h-1.5 overflow-hidden rounded-full bg-white/25">
            <div className="h-full rounded-full bg-white transition-[width]" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-1 text-center text-[11px] font-semibold text-white">{progress}%</p>
        </div>
      )}

      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        aria-label={`Remove ${label}`}
        className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition-opacity hover:bg-destructive focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:hidden sm:opacity-0 sm:group-hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </li>
  );
}

/**
 * existing: [{ url, type }] saved media       newItems: [{ id, file, preview, kind }] not uploaded yet
 * progress: { [itemId]: 0-100 } while saving   Nothing uploads here; the form uploads on save.
 */
export default function MediaUploader({ existing, newItems, onAddFiles, onRemoveExisting, onRemoveNew, error, disabled, progress = {}, uploading }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const total = existing.length + newItems.length;
  const full = total >= MAX_MEDIA_FILES;

  const overall = newItems.length
    ? Math.round(newItems.reduce((sum, i) => sum + (progress[i.id] ?? 0), 0) / newItems.length)
    : 0;

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    if (!disabled && e.dataTransfer.files?.length) onAddFiles(e.dataTransfer.files);
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors",
          dragging ? "border-primary bg-accent" : "border-input",
          (full || disabled) && "opacity-60"
        )}
      >
        <div className="flex items-center gap-2 text-muted-foreground"><ImagePlus className="h-7 w-7" /><Film className="h-7 w-7" /></div>
        <p className="text-sm">
          Drag photos and videos here or{" "}
          <button
            type="button"
            className="font-semibold text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => inputRef.current?.click()}
            disabled={full || disabled}
          >
            browse
          </button>
        </p>
        <p className="text-xs text-muted-foreground">
          Photos: JPG, PNG, WebP up to {MAX_IMAGE_SIZE_MB} MB · Videos: MP4, MOV, WEBM up to {MAX_VIDEO_SIZE_MB} MB · {total}/{MAX_MEDIA_FILES} files
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={MEDIA_ACCEPT_ATTR}
          className="sr-only"
          aria-label="Upload property photos and videos"
          onChange={(e) => {
            if (e.target.files?.length) onAddFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

      {uploading && newItems.length > 0 && (
        <div role="status" aria-live="polite" className="rounded-md border bg-card p-3">
          <div className="mb-1.5 flex justify-between text-sm font-semibold">
            <span>Uploading {newItems.length} {newItems.length === 1 ? "file" : "files"}</span>
            <span className="tabular-nums">{overall}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${overall}%` }} />
          </div>
        </div>
      )}

      {total > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {existing.map((m, i) => (
            <Thumb key={m.url} src={m.url} type={m.type} label={`${m.type} ${i + 1}`} cover={i === 0 && m.type === "image"} disabled={disabled} onRemove={() => onRemoveExisting(m.url)} />
          ))}
          {newItems.map((item, i) => (
            <Thumb
              key={item.id}
              isNew
              src={item.preview}
              type={item.kind}
              label={item.file.name}
              sizeLabel={formatFileSize(item.file.size)}
              cover={existing.length === 0 && i === 0 && item.kind === "image"}
              progress={uploading ? progress[item.id] ?? 0 : undefined}
              disabled={disabled}
              onRemove={() => onRemoveNew(item.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
