import { createFileRoute } from "@tanstack/react-router";
import {
  BadgeCheck,
  Heart,
  FileText,
  Settings,
  Shield,
  Bell,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import rm1 from "@/assets/roommate-1.jpg";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profil — Roomie" },
      { name: "description", content: "Profilingiz, saqlangan kvartiralar va sozlamalar." },
    ],
  }),
  component: ProfilePage,
});

const items = [
  { icon: Heart, label: "Saqlangan", meta: "12 ta" },
  { icon: FileText, label: "Shartnomalar", meta: "1 ta faol" },
  { icon: Shield, label: "Tekshiruv", meta: "Tasdiqlangan", ok: true },
  { icon: Bell, label: "Bildirishnomalar" },
  { icon: Settings, label: "Sozlamalar" },
];

function ProfilePage() {
  return (
    <MobileShell>
      <header className="px-5 pt-6 pb-4">
        <h1 className="text-[22px] font-bold tracking-tight">Profil</h1>
      </header>

      <section className="px-5">
        <div className="rounded-3xl bg-card p-5 shadow-card">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <img
                src={rm1}
                alt=""
                className="h-16 w-16 shrink-0 rounded-2xl object-cover"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-lg font-bold">Doniyor Karimov</p>
                  <BadgeCheck className="h-4 w-4 shrink-0 text-success" strokeWidth={2.5} />
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  INHA universiteti · 2-kurs
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { k: "12", v: "Saqlangan" },
              { k: "4.9", v: "Reyting" },
              { k: "8", v: "Sharhlar" },
            ].map((s) => (
              <div key={s.v} className="rounded-2xl bg-muted p-3 text-center">
                <p className="text-lg font-bold">{s.k}</p>
                <p className="text-[11px] text-muted-foreground">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-5 px-5">
        <div className="rounded-3xl bg-card shadow-card divide-y divide-border">
          {items.map(({ icon: Icon, label, meta, ok }) => (
            <button
              key={label}
              className="flex w-full items-center gap-3 p-4 text-left active:bg-muted transition-colors first:rounded-t-3xl last:rounded-b-3xl"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-4.5 w-4.5" strokeWidth={2} />
              </span>
              <span className="flex-1 text-sm font-medium">{label}</span>
              {meta && (
                <span className={`text-xs ${ok ? "font-semibold text-success" : "text-muted-foreground"}`}>
                  {meta}
                </span>
              )}
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/5 py-3.5 text-sm font-semibold text-destructive active:scale-[0.98] transition-transform">
          <LogOut className="h-4 w-4" />
          Chiqish
        </button>
      </section>
    </MobileShell>
  );
}
