import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Building2, LayoutDashboard, Loader2, LogOut, PlusSquare, Settings, X } from "lucide-react";
import Logo from "@/components/common/Logo";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, match: (p) => p === "/" },
  { to: "/properties", label: "Properties", icon: Building2, match: (p) => p.startsWith("/properties") && p !== "/properties/new" },
  { to: "/properties/new", label: "Add Property", icon: PlusSquare, match: (p) => p === "/properties/new" },
  { to: "/settings", label: "Settings", icon: Settings, match: (p) => p.startsWith("/settings") },
];

function SidebarContent({ onNavigate, onClose }) {
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await signOut();
      navigate("/login", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className="flex h-full flex-col bg-[hsl(217_68%_17%)] text-white dark:bg-[hsl(222_40%_9%)] dark:border-r dark:border-border">
      <div className="flex items-center gap-3 px-5 py-5">
        <Logo size={44} className="rounded-lg" />
        <div className="min-w-0 leading-tight">
          <p className="font-display text-base font-bold">Safe Square</p>
          <p className="text-xs text-white/60">Property Management</p>
        </div>
        {onClose && (
          <button onClick={onClose} aria-label="Close menu" className="ml-auto rounded-md p-1.5 text-white/70 hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2" aria-label="Main">
        {NAV.map(({ to, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <Link
              key={to}
              to={to}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                active ? "bg-white/14 text-white" : "text-white/70 hover:bg-white/8 hover:text-white"
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <p className="truncate px-3 pb-2 text-xs text-white/55">{user?.email}</p>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-white/75 transition-colors hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 disabled:opacity-60"
        >
          {loggingOut ? <Loader2 className="h-[18px] w-[18px] animate-spin" /> : <LogOut className="h-[18px] w-[18px]" />}
          Logout
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({ open, onClose }) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <SidebarContent />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85%] shadow-xl">
            <SidebarContent onNavigate={onClose} onClose={onClose} />
          </aside>
        </div>
      )}
    </>
  );
}
