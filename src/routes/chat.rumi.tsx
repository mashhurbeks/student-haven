import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Send, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useAllListings } from "@/hooks/use-all-listings";
import { roommates } from "@/lib/mock-data";
import { getOnboardingData } from "@/lib/onboarding-storage";

export const Route = createFileRoute("/chat/rumi")({
  head: () => ({
    meta: [
      { title: "Rumi AI — Roomie" },
      {
        name: "description",
        content: "Rumi AI bilan suhbat: ehtiyojlaringizga mos kvartiralarni toping.",
      },
      { property: "og:title", content: "Rumi AI — Roomie" },
      {
        property: "og:description",
        content: "Rumi AI bilan suhbat: ehtiyojlaringizga mos kvartiralarni toping.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RumiChatPage,
});

const SUGGESTIONS = [
  "Menga mos kvartiralarni tavsiya qil",
  "r1 (Doniyor) bilan birga yashasak, qaysi kvartira mos?",
  "2 mln so'mgacha, INHA yaqinida nima bor?",
];

function RumiChatPage() {
  const listings = useAllListings();
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const [profile, setProfile] = useState<Record<string, unknown>>({});
  useEffect(() => {
    setProfile(getOnboardingData() as Record<string, unknown>);
  }, []);

  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);

  const { messages, sendMessage, status, error } = useChat({
    id: "rumi",
    transport,
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    if (!isLoading) inputRef.current?.focus();
  }, [isLoading]);

  const send = (value: string) => {
    const v = value.trim();
    if (!v || isLoading) return;
    void sendMessage(
      { text: v },
      { body: { context: { profile, listings, roommates } } },
    );
    setText("");
  };

  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto flex min-h-dvh max-w-[430px] flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-card/90 px-4 py-3 backdrop-blur-md">
          <Link
            to="/chat"
            aria-label="Orqaga"
            className="grid h-10 w-10 place-items-center rounded-2xl bg-muted transition-transform active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">Rumi AI</p>
            <p className="truncate text-[11px] text-muted-foreground">
              {isLoading ? "Yozmoqda..." : "Har doim onlayn · AI yordamchi"}
            </p>
          </div>
        </header>

        <main className="flex-1 space-y-3 px-4 py-4">
          {messages.length === 0 && (
            <div className="space-y-4">
              <div className="rounded-3xl bg-card p-5 shadow-card">
                <p className="text-sm font-semibold">Salom! Men Rumi AI 👋</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ehtiyojlaringizni tahlil qilib, sizga (va bo'lajak xonadoshingizga)
                  mos kvartiralarni tavsiya qilaman. Xonadoshning ID yoki ismini
                  yozing — ikkalangizning talablaringizni birlashtiraman.
                </p>
              </div>
              <div className="space-y-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="w-full rounded-2xl bg-muted px-4 py-3 text-left text-xs font-medium transition-transform active:scale-[0.99]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => {
            const body = m.parts
              .map((p) => (p.type === "text" ? p.text : ""))
              .join("");
            const mine = m.role === "user";
            return (
              <div
                key={m.id}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-3xl px-4 py-2.5 text-sm leading-snug shadow-soft ${
                    mine
                      ? "rounded-br-lg bg-primary text-primary-foreground"
                      : "rounded-bl-lg bg-card text-foreground"
                  }`}
                >
                  {mine ? (
                    <p className="whitespace-pre-wrap">{body}</p>
                  ) : (
                    <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-headings:text-sm">
                      <ReactMarkdown>{body}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {status === "submitted" && (
            <div className="flex justify-start">
              <div className="flex gap-1 rounded-3xl rounded-bl-lg bg-card px-4 py-3 shadow-soft">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
                    style={{ animationDelay: `${i * 120}ms` }}
                  />
                ))}
              </div>
            </div>
          )}

          {error && (
            <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-xs text-destructive">
              Xatolik yuz berdi. Biroz kutib, qayta urinib ko'ring.
            </p>
          )}
          <div ref={endRef} />
        </main>

        <footer className="sticky bottom-0 border-t border-border bg-card/90 px-4 py-3 backdrop-blur-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(text);
            }}
            className="flex items-center gap-2 rounded-3xl bg-muted px-4 py-2"
          >
            <input
              ref={inputRef}
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Rumi AI dan so'rang..."
              className="flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={isLoading || !text.trim()}
              aria-label="Yuborish"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground transition-transform active:scale-95 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
}
