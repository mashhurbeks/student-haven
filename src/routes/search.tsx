import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Search as SearchIcon, Mic, Camera, SlidersHorizontal } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { ListingCard } from "@/components/ListingCard";
import { listings } from "@/lib/mock-data";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Qidiruv — Roomie" },
      { name: "description", content: "AI, ovoz va rasm orqali kvartira qidirish." },
    ],
  }),
  component: SearchPage,
});

const suggestions = [
  "WIUT yaqinida 2 milliongacha",
  "Faqat qizlar, metro yaqin",
  "INHA universitetdan 5 daqiqada",
  "1 xonali, mebel bilan",
];

function SearchPage() {
  return (
    <MobileShell>
      <header className="px-5 pt-6 pb-4">
        <h1 className="text-[22px] font-bold tracking-tight">Qidiruv</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Tabiiy tilda so'rang — AI tushunadi
        </p>

        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-soft focus-within:ring-2 focus-within:ring-primary/30">
          <SearchIcon className="h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Masalan: metrodan 5 minut, 1 xonali"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button aria-label="Ovozli qidiruv" className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary active:scale-95 transition">
            <Mic className="h-4 w-4" />
          </button>
          <button aria-label="Rasmli qidiruv" className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary active:scale-95 transition">
            <Camera className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          <button className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground">
            <Sparkles className="h-3.5 w-3.5" /> AI Search
          </button>
          <button className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-card border border-border px-3.5 py-2 text-xs font-medium">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filterlar
          </button>
        </div>
      </header>

      <section className="px-5">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Tavsiya etilgan so'rovlar
        </h2>
        <div className="flex flex-col gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              className="flex items-center gap-3 rounded-2xl bg-card p-3.5 text-left shadow-soft active:scale-[0.98] transition-transform"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{s}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-7 px-5">
        <h2 className="mb-3 text-lg font-bold tracking-tight">Natijalar</h2>
        <div className="space-y-4">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      </section>
    </MobileShell>
  );
}
