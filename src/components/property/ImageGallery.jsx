// import { useState } from "react";
// import { ImageOff } from "lucide-react";
// import { cn } from "@/lib/utils";

// export default function ImageGallery({ images, title }) {
//   const [index, setIndex] = useState(0);
//   const list = images ?? [];

//   if (!list.length) {
//     return (
//       <div className="flex aspect-[16/10] flex-col items-center justify-center gap-2 rounded-lg border bg-muted text-muted-foreground">
//         <ImageOff className="h-8 w-8" />
//         <p className="text-sm">No images added yet</p>
//       </div>
//     );
//   }

//   const current = Math.min(index, list.length - 1);

//   return (
//     <div className="space-y-3">
//       <div className="aspect-[16/10] overflow-hidden rounded-lg border bg-muted">
//         <img src={list[current]} alt={`${title}, image ${current + 1} of ${list.length}`} className="h-full w-full object-cover" />
//       </div>
//       {list.length > 1 && (
//         <ul className="flex gap-2 overflow-x-auto pb-1">
//           {list.map((url, i) => (
//             <li key={url} className="shrink-0">
//               <button
//                 type="button"
//                 onClick={() => setIndex(i)}
//                 aria-label={`Show image ${i + 1}`}
//                 aria-current={i === current}
//                 className={cn(
//                   "h-16 w-24 overflow-hidden rounded-md border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
//                   i === current ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
//                 )}
//               >
//                 <img src={url} alt="" className="h-full w-full object-cover" />
//               </button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
