import logo from "@/assets/logo.jpeg";
import { cn } from "@/lib/utils";

/**
 * The logo file has a white background, so it sits on a white tile.
 * That keeps it readable in dark mode too.
 */
export default function Logo({ className, size = 40 }) {
  return (
    <div className={cn("shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-black/5", className)} style={{ width: size, height: size }}>
      <img src={logo} alt="Safe Square Property" className="h-full w-full object-contain" />
    </div>
  );
}
