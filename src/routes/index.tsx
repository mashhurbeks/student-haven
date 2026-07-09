import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Sparkles,
  MapPin,
  Bell,
  ArrowRight,
  HelpCircle,
  GraduationCap,
  Map as MapIcon,
} from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { ListingCard } from "@/components/ListingCard";
import { roommates } from "@/lib/mock-data";
import { useAllListings } from "@/hooks/use-all-listings";

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

type Tab = "rooms" | "roommates";

function Home() {
  const navigate = useNavigate();
  const listings = useAllListings();
  const [tab, setTab] = useState<Tab>("rooms");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem("roomie_onboarded")) {
      navigate({ to: "/welcome", replace: true });
    }
  }, [navigate]);

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
          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/help"
              aria-label="Yordam"
              className="grid h-11 w-11 place-items-center rounded-2xl bg-card shadow-soft active:scale-95 transition-transform"
            >
              <HelpCircle className="h-5 w-5" strokeWidth={2} />
            </Link>
            <button
              aria-label="Bildirishnomalar"
              className="relative grid h-11 w-11 place-items-center rounded-2xl bg-card shadow-soft active:scale-95 transition-transform"
            >
              <Bell className="h-5 w-5" strokeWidth={2} />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard tabs */}
      <section className="px-5 pt-5">
        <div
          role="tablist"
          aria-label="Dashboard"
          className="grid grid-cols-2 gap-1 rounded-2xl bg-muted p-1"
        >
          <button
            role="tab"
            aria-selected={tab === "rooms"}
            onClick={() => setTab("rooms")}
            className={`rounded-xl py-2.5 text-sm font-semibold transition-colors ${
              tab === "rooms"
                ? "bg-card text-foreground shadow-soft"
                : "text-muted-foreground"
            }`}
          >
            Kvartiralar
          </button>
          <button
            role="tab"
            aria-selected={tab === "roommates"}
            onClick={() => setTab("roommates")}
            className={`rounded-xl py-2.5 text-sm font-semibold transition-colors ${
              tab === "roommates"
                ? "bg-card text-foreground shadow-soft"
                : "text-muted-foreground"
            }`}
          >
            Xonadoshlar
          </button>
        </div>
      </section>

      {tab === "rooms" ? (
        <section className="mt-6 px-5">
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
      ) : (
        <section className="mt-6 px-5">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight">Xonadoshlar</h2>
              <p className="text-xs text-muted-foreground">
                Sizga mos keladigan talabalar
              </p>
            </div>
            <Link
              to="/roommates"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
            >
              Barchasi <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {roommates.map((r) => (
              <Link
                key={r.id}
                to="/roommates"
                className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-soft active:scale-[0.99] transition-transform"
              >
                <img
                  src={r.image}
                  alt={r.name}
                  loading="lazy"
                  className="h-14 w-14 shrink-0 rounded-2xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {r.name}, {r.age}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                    <GraduationCap className="h-3.5 w-3.5" />
                    {r.university}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1 text-[11px] text-success">
                    <Sparkles className="h-3 w-3" strokeWidth={2.5} />
                    <span className="font-semibold">{r.match}% mos</span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="h-4" />
    </MobileShell>
  );
}
