// import { useRef, useState } from "react";
// import { ImagePlus, X } from "lucide-react";
// import { ACCEPTED_IMAGE_TYPES, MAX_IMAGES, MAX_IMAGE_SIZE_MB } from "@/lib/constants";
// import { cn } from "@/lib/utils";

// /**
//  * existing: saved image URLs      newItems: [{ id, file, preview }] (not uploaded yet)
//  * Nothing is uploaded here; the form uploads everything on save.
//  */
// export default function ImageUploader({ existing, newItems, onAddFiles, onRemoveExisting, onRemoveNew, error, disabled }) {
//   const inputRef = useRef(null);
//   const [dragging, setDragging] = useState(false);
//   const total = existing.length + newItems.length;
//   const full = total >= MAX_IMAGES;

//   function handleDrop(e) {
//     e.preventDefault();
//     setDragging(false);
//     if (!disabled && e.dataTransfer.files?.length) onAddFiles(e.dataTransfer.files);
//   }

//   const Thumb = ({ src, label, onRemove, cover, isNew }) => (
//     <li className="group relative aspect-[4/3] overflow-hidden rounded-md border bg-muted">
//       <img src={src} alt={label} className="h-full w-full object-cover" />
//       {cover && <span className="absolute left-1.5 top-1.5 rounded bg-primary px-1.5 py-0.5 text-[11px] font-semibold text-primary-foreground">Cover</span>}
//       {isNew && <span className="absolute bottom-1.5 left-1.5 rounded bg-black/65 px-1.5 py-0.5 text-[11px] font-medium text-white">New</span>}
//       <button
//         type="button"
//         onClick={onRemove}
//         disabled={disabled}
//         aria-label={`Remove ${label}`}
//         className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition-opacity hover:bg-destructive focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:opacity-0 sm:group-hover:opacity-100"
//       >
//         <X className="h-4 w-4" />
//       </button>
//     </li>
//   );

//   return (
//     <div className="space-y-3">
//       <div
//         onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
//         onDragLeave={() => setDragging(false)}
//         onDrop={handleDrop}
//         className={cn(
//           "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors",
//           dragging ? "border-primary bg-accent" : "border-input",
//           (full || disabled) && "opacity-60"
//         )}
//       >
//         <ImagePlus className="h-8 w-8 text-muted-foreground" />
//         <p className="text-sm">
//           Drag images here or{" "}
//           <button
//             type="button"
//             className="font-semibold text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
//             onClick={() => inputRef.current?.click()}
//             disabled={full || disabled}
//           >
//             browse
//           </button>
//         </p>
//         <p className="text-xs text-muted-foreground">
//           JPG, PNG or WebP · up to {MAX_IMAGE_SIZE_MB} MB each · {total}/{MAX_IMAGES} added
//         </p>
//         <input
//           ref={inputRef}
//           type="file"
//           multiple
//           accept={ACCEPTED_IMAGE_TYPES.join(",")}
//           className="sr-only"
//           aria-label="Upload property images"
//           onChange={(e) => {
//             if (e.target.files?.length) onAddFiles(e.target.files);
//             e.target.value = "";
//           }}
//         />
//       </div>

//       {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

//       {total > 0 && (
//         <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
//           {existing.map((url, i) => (
//             <Thumb key={url} src={url} label={`image ${i + 1}`} cover={i === 0} onRemove={() => onRemoveExisting(url)} />
//           ))}
//           {newItems.map((item, i) => (
//             <Thumb key={item.id} isNew src={item.preview} label={item.file.name} cover={existing.length === 0 && i === 0} onRemove={() => onRemoveNew(item.id)} />
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
