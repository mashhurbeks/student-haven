import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, Sparkles } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { roommates } from "@/lib/mock-data";

export const Route = createFileRoute("/roommates")({
  head: () => ({
    meta: [
      { title: "Xonadosh — Roomie" },
      { name: "description", content: "AI moslashuv orqali o'zingizga mos xonadosh toping." },
    ],
  }),
  component: RoommatesPage,
});

function RoommatesPage() {
  return (
    <MobileShell>
      <header className="px-5 pt-6 pb-4">
        <h1 className="text-[22px] font-bold tracking-tight">Xonadosh topish</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          AI sizga eng mos talabalarni tanladi
        </p>
      </header>

      <section className="px-5">
        <div className="rounded-3xl bg-gradient-to-br from-success/15 to-primary/10 p-5 shadow-soft">
          <div className="flex items-center gap-2 text-success">
            <Sparkles className="h-4 w-4" strokeWidth={2.5} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Anketangizga asoslangan
            </span>
          </div>
          <p className="mt-2 text-sm text-foreground">
            94% moslik: siz ham u ham erta uxlaysiz va tozalikni yoqtirasiz.
          </p>
        </div>
      </section>

      <section className="mt-6 px-5">
        <div className="space-y-4">
          {roommates.map((r) => (
            <Link
              key={r.id}
              to="/roommate/$id"
              params={{ id: r.id }}
              className="block overflow-hidden rounded-3xl bg-card shadow-card active:scale-[0.99] transition-transform"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
                <img
                  src={r.image}
                  alt={r.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-5 text-white">
                  <div className="flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-xl font-bold">
                        {r.name}, {r.age}
                      </h3>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-white/85">
                        <GraduationCap className="h-3.5 w-3.5" />
                        {r.university}
                      </p>
                    </div>
                    <div className="shrink-0 rounded-2xl bg-success px-3 py-1.5 text-sm font-bold text-success-foreground shadow-lifted">
                      {r.match}% mos
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-foreground/90">{r.bio}</p>
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
                <div className="mt-4">
                  <InterestButton roommateId={r.id} name={r.name} className="w-full" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </MobileShell>
  );
}
