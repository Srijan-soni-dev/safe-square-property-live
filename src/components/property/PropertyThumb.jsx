import { Film, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PropertyThumb({ property, className }) {
  const src = property.images?.[0];
  if (src) return <img src={src} alt="" loading="lazy" className={cn("object-cover", className)} />;

  const hasVideo = property.videos?.length > 0;
  return (
    <div className={cn("flex items-center justify-center bg-muted text-muted-foreground", className)} aria-hidden>
      {hasVideo ? <Film className="h-5 w-5" /> : <ImageOff className="h-5 w-5" />}
    </div>
  );
}
