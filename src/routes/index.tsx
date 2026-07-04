import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  Sparkles,
  Search as SearchIcon,
  Mic,
  MapPin,
  Bell,
  ShieldCheck,
  TrendingUp,
  GraduationCap,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { ListingCard } from "@/components/ListingCard";
import { listings, roommates } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Roomie — Talabalar uchun ishonchli uy topish platformasi" },
      {
        name: "description",
        content:
          "O'zbekistondagi talabalar uchun tasdiqlangan kvartiralar, AI xonadosh moslashuvi va xavfsiz ijara — hammasi bitta ilovada.",
      },
      { property: "og:title", content: "Roomie — Talabalar uchun uy topish" },
      {
        property: "og:description",
        content:
          "5 daqiqada ishonchli kvartira toping. AI qidiruv, xonadosh moslashuvi va tasdiqlangan e'lonlar.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Home,
});

const chips = [
  { label: "Tasdiqlangan", icon: ShieldCheck },
  { label: "Universitet yaqin", icon: GraduationCap },
  { label: "2M gacha", icon: TrendingUp },
  { label: "Qizlar uchun" },
  { label: "Yigitlar uchun" },
  { label: "Metro yaqin" },
];

function Home() {
  return (
    <MobileShell>
      {/* Header */}
      <header className="px-5 pt-6 pb-2">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
              Toshkent
            </p>
            <h1 className="mt-0.5 truncate text-[22px] font-bold tracking-tight">
              Salom, Doniyor 👋
            </h1>
          </div>
          <button
            aria-label="Bildirishnomalar"
            className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-card shadow-soft active:scale-95 transition-transform"
          >
            <Bell className="h-5 w-5" strokeWidth={2} />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
          </button>
        </div>
      </header>

      {/* AI Search */}
      <section className="px-5 pt-4">
        <Link
          to="/search"
          className="group block rounded-3xl bg-gradient-to-br from-primary to-[oklch(0.48_0.24_270)] p-5 shadow-glow transition-transform active:scale-[0.99]"
        >
          <div className="flex items-center gap-2 text-primary-foreground/90">
            <Sparkles className="h-4 w-4" strokeWidth={2.5} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              AI Qidiruv
            </span>
          </div>
          <p className="mt-2 text-[17px] font-semibold text-primary-foreground leading-snug">
            "WIUT yaqinida 2 milliongacha, faqat qizlar uchun"
          </p>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-2xl bg-white/15 px-4 py-2.5 backdrop-blur-sm">
              <SearchIcon className="h-4 w-4 text-primary-foreground/80" />
              <span className="flex-1 truncate text-sm text-primary-foreground/80">
                Nima izlayapsiz?
              </span>
              <Mic className="h-4 w-4 text-primary-foreground/80" />
            </div>
          </div>
        </Link>
      </section>

      {/* Filter chips */}
      <section className="mt-5">
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-5">
          {chips.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-medium text-foreground shadow-soft active:scale-95 transition-transform"
            >
              {Icon && <Icon className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />}
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Recommended */}
      <section className="mt-7 px-5">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight">Siz uchun tavsiya</h2>
            <p className="text-xs text-muted-foreground">
              AI sizga mos kvartiralarni tanladi
            </p>
          </div>
          <Link
            to="/search"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
          >
            Barchasi <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="space-y-4">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      </section>

      {/* Roommate teaser */}
      <section className="mt-8 px-5">
        <div className="overflow-hidden rounded-3xl bg-card shadow-card">
          <div className="bg-gradient-to-br from-[oklch(0.95_0.05_155)] to-[oklch(0.92_0.04_265)] p-5">
            <div className="flex items-center gap-2 text-success">
              <Sparkles className="h-4 w-4" strokeWidth={2.5} />
              <span className="text-xs font-semibold uppercase tracking-wider">
                AI Xonadosh moslashuvi
              </span>
            </div>
            <h3 className="mt-2 text-[17px] font-bold text-foreground leading-snug">
              Sizga 94% mos keladigan xonadosh topildi
            </h3>
          </div>
          <div className="p-5">
            {roommates.map((r) => (
              <Link
                key={r.id}
                to="/roommates"
                className="flex items-center gap-3 rounded-2xl py-2 -mx-2 px-2 active:bg-muted transition-colors"
              >
                <img
                  src={r.image}
                  alt={r.name}
                  loading="lazy"
                  className="h-12 w-12 shrink-0 rounded-2xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {r.name}, {r.age}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {r.university} · {r.tags.slice(0, 2).join(" · ")}
                  </p>
                </div>
                <div className="shrink-0 rounded-full bg-success/10 px-2.5 py-1 text-xs font-bold text-success">
                  {r.match}%
                </div>
              </Link>
            ))}
            <Link
              to="/roommates"
              className="mt-3 flex w-full items-center justify-center gap-1 rounded-2xl bg-foreground py-3 text-sm font-semibold text-background active:scale-[0.98] transition-transform"
            >
              Xonadosh topish
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <div className="h-4" />
    </MobileShell>
  );
}
