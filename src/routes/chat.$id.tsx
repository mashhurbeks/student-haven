import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Send, Phone } from "lucide-react";
import { threads, type ChatMessage } from "@/lib/mock-chat";

export const Route = createFileRoute("/chat/$id")({
  head: () => ({
    meta: [
      { title: "Suhbat — Roomie" },
      { name: "description", content: "Uy egasi yoki xonadosh bilan yozishma." },
      { property: "og:title", content: "Suhbat — Roomie" },
      { property: "og:description", content: "Uy egasi yoki xonadosh bilan yozishma." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ChatThreadPage,
});

function ChatThreadPage() {
  const { id } = useParams({ from: "/chat/$id" });
  const thread = threads.find((t) => t.id === id) ?? threads[0];
  const [messages, setMessages] = useState<ChatMessage[]>(thread.messages);
  const [text, setText] = useState("");

  const send = () => {
    const value = text.trim();
    if (!value) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `local-${prev.length}`,
        from: "me",
        text: value,
        time: new Date().toLocaleTimeString("uz-UZ", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setText("");
  };

  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto flex min-h-dvh max-w-[430px] flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-card/90 px-4 py-3 backdrop-blur-md">
          <Link
            to="/chat"
            aria-label="Orqaga"
            className="grid h-10 w-10 place-items-center rounded-2xl bg-muted active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <img
            src={thread.image}
            alt=""
            className="h-10 w-10 rounded-2xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{thread.name}</p>
            <p className="truncate text-[11px] text-muted-foreground">
              {thread.online ? "Onlayn" : thread.subtitle}
            </p>
          </div>
          <button
            aria-label="Qo'ng'iroq"
            className="grid h-10 w-10 place-items-center rounded-2xl bg-muted active:scale-95 transition-transform"
          >
            <Phone className="h-4.5 w-4.5" />
          </button>
        </header>

        <main className="flex-1 space-y-2 px-4 py-4">
          <p className="pb-2 text-center text-[11px] text-muted-foreground">
            Bugun
          </p>
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[78%] rounded-3xl px-4 py-2.5 text-sm leading-snug shadow-soft ${
                  m.from === "me"
                    ? "rounded-br-lg bg-primary text-primary-foreground"
                    : "rounded-bl-lg bg-card text-foreground"
                }`}
              >
                <p>{m.text}</p>
                <p
                  className={`mt-1 text-[10px] ${
                    m.from === "me"
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {m.time}
                </p>
              </div>
            </div>
          ))}
        </main>

        <footer className="sticky bottom-0 border-t border-border bg-card/90 px-4 py-3 backdrop-blur-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-2 rounded-3xl bg-muted px-4 py-2"
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Xabar yozing..."
              className="flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              aria-label="Yuborish"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground active:scale-95 transition-transform"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
}
