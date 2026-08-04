import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  GraduationCap,
  Heart,
  MapPin,
  MessageCircle,
  Sparkles,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { InterestButton } from "@/components/InterestButton";
import { roommates, formatSom } from "@/lib/mock-data";

export const Route = createFileRoute("/roommate/$id")({
  head: ({ params }) => {
    const r = roommates.find((x) => x.id === params.id);
    return {
      meta: [
        { title: r ? `${r.name} — Xonadosh profili | Roomie` : "Xonadosh — Roomie" },
        {
          name: "description",
          content: r
            ? `${r.name}, ${r.age} yosh, ${r.university}. ${r.match}% moslik — hayot tarzi, odatlar va aloqa.`
            : "Xonadosh profili",
        },
        { property: "og:title", content: r ? `${r.name} — Roomie xonadosh` : "Roomie" },
        {
          property: "og:description",
          content: r ? r.bio : "Talabalar uchun xonadosh topish",
        },
        { property: "og:type", content: "profile" },
      ],
    };
  },
  component: RoommateProfile,
});

function RoommateProfile() {
  const { id } = useParams({ from: "/roommate/$id" });
  const r = roommates.find((x) => x.id === id);
  const [saved, setSaved] = useState(false);

  if (!r) {
    return (
      <MobileShell>
        <div className="p-10 text-center text-sm text-muted-foreground">
          Profil topilmadi.{" "}
          <Link to="/roommates" className="font-semibold text-primary">
            Orqaga
          </Link>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <div className="relative">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
          <img src={r.image} alt={r.name} className="h-full w-full object-cover" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
            <Link
              to="/roommates"
              aria-label="Orqaga"
              className="grid h-10 w-10 place-items-center rounded-2xl bg-card/90 shadow-soft backdrop-blur active:scale-95 transition-transform"
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={2} />
            </Link>
            <button
              aria-label="Saqlash"
              onClick={() => setSaved((s) => !s)}
              className="grid h-10 w-10 place-items-center rounded-2xl bg-card/90 shadow-soft backdrop-blur active:scale-95 transition-transform"
            >
              <Heart
                className={`h-5 w-5 ${saved ? "fill-destructive text-destructive" : ""}`}
                strokeWidth={2}
              />
            </button>
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-5 text-white">
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0">
                <h1 className="flex items-center gap-1.5 text-2xl font-bold">
                  {r.name}, {r.age}
                  {r.verified && <BadgeCheck className="h-5 w-5 text-success" strokeWidth={2.5} />}
                </h1>
                <p className="mt-1 flex items-center gap-1 text-xs text-white/85">
                  <GraduationCap className="h-3.5 w-3.5" />
                  {r.university}
                  {r.course ? ` · ${r.course}` : ""}
                </p>
              </div>
              <div className="shrink-0 rounded-2xl bg-success px-3 py-1.5 text-sm font-bold text-success-foreground shadow-lifted">
                {r.match}% mos
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="px-5 pt-5">
        <div className="grid grid-cols-2 gap-3">
          {r.district && (
            <div className="rounded-2xl bg-card p-4 shadow-soft">
              <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> Hudud
              </p>
              <p className="mt-1 text-sm font-semibold">{r.district}</p>
            </div>
          )}
          {r.budget && (
            <div className="rounded-2xl bg-card p-4 shadow-soft">
              <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Wallet className="h-3.5 w-3.5" /> Byudjet
              </p>
              <p className="mt-1 text-sm font-semibold">{formatSom(r.budget)}</p>
            </div>
          )}
        </div>
      </section>

      <section className="mt-4 px-5">
        <div className="rounded-3xl bg-card p-5 shadow-card">
          <h2 className="text-sm font-bold">Men haqimda</h2>
          <p className="mt-2 text-sm text-foreground/90">{r.bio}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {r.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {r.matchReasons && (
        <section className="mt-4 px-5">
          <div className="rounded-3xl bg-gradient-to-br from-success/15 to-primary/10 p-5 shadow-soft">
            <div className="flex items-center gap-2 text-success">
              <Sparkles className="h-4 w-4" strokeWidth={2.5} />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Nega {r.match}% mos
              </span>
            </div>
            <ul className="mt-3 space-y-2">
              {r.matchReasons.map((m) => (
                <li key={m} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" strokeWidth={2.5} />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {r.lifestyle && (
        <section className="mt-4 px-5">
          <div className="rounded-3xl bg-card p-5 shadow-card">
            <h2 className="text-sm font-bold">Hayot tarzi</h2>
            <dl className="mt-3 divide-y divide-border">
              {r.lifestyle.map((l) => (
                <div key={l.label} className="flex items-center justify-between gap-3 py-2.5">
                  <dt className="text-sm text-muted-foreground">{l.label}</dt>
                  <dd className="text-sm font-semibold">{l.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {r.habits && (
        <section className="mt-4 px-5">
          <div className="rounded-3xl bg-card p-5 shadow-card">
            <h2 className="text-sm font-bold">Odatlar</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {r.habits.map((h) => (
                <div
                  key={h.label}
                  className="flex items-center gap-2 rounded-2xl bg-muted px-3 py-2.5"
                >
                  <span
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                      h.ok ? "bg-success text-success-foreground" : "bg-destructive/15 text-destructive"
                    }`}
                  >
                    {h.ok ? <Check className="h-3 w-3" strokeWidth={3} /> : <X className="h-3 w-3" strokeWidth={3} />}
                  </span>
                  <span className="text-xs font-medium">{h.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {r.languages && (
        <section className="mt-4 px-5">
          <div className="rounded-3xl bg-card p-5 shadow-card">
            <h2 className="text-sm font-bold">Tillar</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {r.languages.map((l) => (
                <span
                  key={l}
                  className="rounded-full border border-border px-3 py-1 text-xs font-medium"
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="h-4" />

      <div className="fixed inset-x-0 bottom-20 z-40 mx-auto max-w-[430px] px-5">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)] gap-2 rounded-3xl bg-card/95 p-2 shadow-lifted backdrop-blur">
          <button
            onClick={() => setSaved((s) => !s)}
            aria-label="Saqlash"
            className="grid h-12 w-12 place-items-center rounded-2xl border border-border active:scale-95 transition-transform"
          >
            <Heart
              className={`h-5 w-5 ${saved ? "fill-destructive text-destructive" : ""}`}
              strokeWidth={2}
            />
          </button>
          <Link
            to="/chat"
            className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-border text-sm font-semibold active:scale-[0.98] transition"
          >
            <MessageCircle className="h-4 w-4" />
            Bog'lanish
          </Link>
          <InterestButton roommateId={r.id} name={r.name} className="h-12 w-full" />
        </div>
      </div>
    </MobileShell>
  );
}
