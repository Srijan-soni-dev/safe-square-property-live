import { Menu } from "lucide-react";
import Logo from "@/components/common/Logo";
import ThemeToggle from "@/components/common/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function Topbar({ onMenu }) {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-card/90 px-4 backdrop-blur sm:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenu} aria-label="Open menu">
        <Menu />
      </Button>
      <Logo size={34} className="lg:hidden" />
      <div className="ml-auto flex items-center gap-2">
        <span className="hidden max-w-[240px] truncate text-sm text-muted-foreground sm:block">{user?.email}</span>
        <ThemeToggle />
      </div>
    </header>
  );
}
