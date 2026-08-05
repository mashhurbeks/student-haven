import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { threads } from "@/lib/mock-chat";

export const Route = createFileRoute("/chat/")({
  head: () => ({
    meta: [
      { title: "Xabarlar — Roomie" },
      { name: "description", content: "Uy egalari va xonadoshlar bilan yozishmalar." },
      { property: "og:title", content: "Xabarlar — Roomie" },
      { property: "og:description", content: "Uy egalari va xonadoshlar bilan yozishmalar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ChatListPage,
});

function ChatListPage() {
  const totalUnread = threads.reduce((s, t) => s + t.unread, 0);

  return (
    <MobileShell>
      <header className="px-5 pt-6 pb-4">
        <h1 className="text-[22px] font-bold tracking-tight">Xabarlar</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {totalUnread > 0
            ? `${totalUnread} ta o'qilmagan xabar`
            : "Barcha xabarlar o'qilgan"}
        </p>
      </header>

      <section className="px-5">
        <div className="flex items-center gap-2 rounded-2xl bg-card px-4 py-3 shadow-soft">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Suhbatlarni qidirish"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </section>

      <section className="mt-4 px-5">
        <Link
          to="/chat/rumi"
          className="flex items-center gap-3 rounded-3xl bg-card p-4 shadow-card transition-transform active:scale-[0.99]"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Sparkles className="h-6 w-6" strokeWidth={2.5} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold">Rumi AI</p>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                AI
              </span>
            </div>
            <p className="truncate text-xs text-muted-foreground">
              Ehtiyojlaringizga mos kvartiralarni tavsiya qilaman
            </p>
          </div>
        </Link>
      </section>

      <section className="mt-4 px-5">
        <div className="divide-y divide-border overflow-hidden rounded-3xl bg-card shadow-card">
          {threads.map((t) => (
            <Link
              key={t.id}
              to="/chat/$id"
              params={{ id: t.id }}
              className="flex items-center gap-3 p-4 text-left transition-colors active:bg-muted"
            >
              <span className="relative shrink-0">
                <img
                  src={t.image}
                  alt=""
                  loading="lazy"
                  className="h-12 w-12 rounded-2xl object-cover"
                />
                {t.online && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-success ring-2 ring-card" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{t.name}</p>
                  <span className="shrink-0 text-[11px] text-muted-foreground">
                    {t.time}
                  </span>
                </div>
                <p className="truncate text-[11px] text-muted-foreground">
                  {t.subtitle}
                </p>
                <div className="mt-0.5 flex items-center justify-between gap-2">
                  <p
                    className={`truncate text-xs ${
                      t.unread > 0
                        ? "font-medium text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {t.last}
                  </p>
                  {t.unread > 0 && (
                    <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                      {t.unread}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="h-4" />
    </MobileShell>
  );
}
