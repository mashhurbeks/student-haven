import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Send } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { roommates } from "@/lib/mock-data";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Chat — Roomie" },
      { name: "description", content: "Uy egalari va xonadoshlar bilan chat." },
    ],
  }),
  component: ChatPage,
});

const threads = [
  { id: "t1", name: "AI Yordamchi", last: "Sizga metro yaqinida uy topaman", time: "hozir", ai: true, unread: 1 },
  { id: "t2", name: "Aziz aka (uy egasi)", last: "Ertaga soat 15:00 da uchrasholmizmi?", time: "12:04", unread: 2 },
  { id: "t3", name: "Doniyor", last: "Salom! Xonadosh haqida gaplasha olamizmi?", time: "Kecha", unread: 0 },
];

function ChatPage() {
  return (
    <MobileShell>
      <header className="px-5 pt-6 pb-4">
        <h1 className="text-[22px] font-bold tracking-tight">Xabarlar</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Uy egalari, xonadoshlar va AI yordamchi bilan
        </p>
      </header>

      <section className="px-5">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-[oklch(0.48_0.24_270)] p-5 shadow-glow">
          <div className="flex items-center gap-2 text-primary-foreground/90">
            <Sparkles className="h-4 w-4" strokeWidth={2.5} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              AI Yordamchi
            </span>
          </div>
          <p className="mt-2 text-[15px] font-semibold text-primary-foreground leading-snug">
            "Menga 2 mln ichida INHA yaqinidan eng yaxshi kvartira top."
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white/15 p-2 backdrop-blur-sm">
            <input
              placeholder="AI yordamchidan so'rang..."
              className="flex-1 bg-transparent px-2 text-sm text-primary-foreground placeholder:text-primary-foreground/70 outline-none"
            />
            <button aria-label="Yuborish" className="grid h-9 w-9 place-items-center rounded-xl bg-white text-primary active:scale-95 transition">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="mt-6 px-5">
        <div className="rounded-3xl bg-card shadow-card divide-y divide-border">
          {threads.map((t, i) => {
            const rm = roommates[i % roommates.length];
            return (
              <button
                key={t.id}
                className="flex w-full items-center gap-3 p-4 text-left active:bg-muted transition-colors first:rounded-t-3xl last:rounded-b-3xl"
              >
                {t.ai ? (
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.48_0.24_270)] text-primary-foreground">
                    <Sparkles className="h-5 w-5" />
                  </span>
                ) : (
                  <img
                    src={rm.image}
                    alt=""
                    loading="lazy"
                    className="h-12 w-12 shrink-0 rounded-2xl object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold">{t.name}</p>
                    <span className="shrink-0 text-[11px] text-muted-foreground">{t.time}</span>
                  </div>
                  <div className="mt-0.5 flex items-center justify-between gap-2">
                    <p className="truncate text-xs text-muted-foreground">{t.last}</p>
                    {t.unread > 0 && (
                      <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                        {t.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </MobileShell>
  );
}
