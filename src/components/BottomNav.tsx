import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, Users, MessageCircle, User } from "lucide-react";

const items = [
  { to: "/", label: "Bosh", Icon: Home },
  { to: "/search", label: "Qidiruv", Icon: Search },
  { to: "/roommates", label: "Xonadosh", Icon: Users },
  { to: "/chat", label: "Chat", Icon: MessageCircle },
  { to: "/profile", label: "Profil", Icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      aria-label="Asosiy navigatsiya"
      className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[430px] px-3 pb-3"
    >
      <div className="glass flex items-center justify-around rounded-3xl px-2 py-2 shadow-lifted">
        {items.map(({ to, label, Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              aria-label={label}
              className="group relative flex min-h-11 min-w-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl px-2 py-1.5 transition-colors"
            >
              <Icon
                className={`h-5 w-5 transition-all ${
                  active ? "text-primary scale-110" : "text-muted-foreground"
                }`}
                strokeWidth={active ? 2.5 : 2}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
              {active && (
                <span className="absolute -top-1 h-1 w-6 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
