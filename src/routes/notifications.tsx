import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Heart, MessageCircle, Home, ShieldCheck } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { notifications, type Notification } from "@/lib/mock-chat";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Bildirishnomalar — Roomie" },
      {
        name: "description",
        content: "Yangi mosliklar, xabarlar va e'lon yangilanishlari haqida bildirishnomalar.",
      },
      { property: "og:title", content: "Bildirishnomalar — Roomie" },
      {
        property: "og:description",
        content: "Yangi mosliklar, xabarlar va e'lon yangilanishlari.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NotificationsPage,
});

const iconFor = (kind: Notification["kind"]) => {
  switch (kind) {
    case "match":
      return { Icon: Heart, cls: "bg-primary/10 text-primary" };
    case "message":
      return { Icon: MessageCircle, cls: "bg-success/15 text-success" };
    case "listing":
      return { Icon: Home, cls: "bg-muted text-foreground" };
    default:
      return { Icon: ShieldCheck, cls: "bg-muted text-foreground" };
  }
};

function NotificationsPage() {
  const unread = notifications.filter((n) => n.unread).length;

  return (
    <MobileShell>
      <header className="flex items-center gap-3 px-5 pt-6 pb-4">
        <Link
          to="/"
          aria-label="Orqaga"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-card shadow-soft active:scale-95 transition-transform"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="min-w-0">
          <h1 className="text-[22px] font-bold tracking-tight">Bildirishnomalar</h1>
          <p className="text-xs text-muted-foreground">
            {unread > 0 ? `${unread} ta yangi` : "Yangi bildirishnoma yo'q"}
          </p>
        </div>
      </header>

      <section className="px-5">
        <div className="divide-y divide-border overflow-hidden rounded-3xl bg-card shadow-card">
          {notifications.map((n) => {
            const { Icon, cls } = iconFor(n.kind);
            return (
              <div key={n.id} className="flex items-start gap-3 p-4">
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${cls}`}>
                  <Icon className="h-4.5 w-4.5" strokeWidth={2.2} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold">{n.title}</p>
                    {n.unread && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground/80">{n.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="h-4" />
    </MobileShell>
  );
}
