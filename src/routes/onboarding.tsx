import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Home, Users, ShieldCheck, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  ssr: false,
  head: () => ({ meta: [{ title: "Tanishuv — Roomie" }] }),
  component: Onboarding,
});

const slides = [
  {
    Icon: Home,
    tint: "from-primary/20 to-primary/5",
    iconBg: "bg-primary text-primary-foreground",
    title: "Kvartira toping",
    desc: "AI qidiruv orqali WIUT, INHA, TIU yaqinidagi tasdiqlangan kvartiralarni bir zumda toping. Xarita, narx va masofa — hammasi qo'l ostida.",
  },
  {
    Icon: Users,
    tint: "from-[oklch(0.85_0.15_155)]/30 to-[oklch(0.85_0.15_155)]/5",
    iconBg: "bg-success text-success-foreground",
    title: "Mos xonadosh toping",
    desc: "Anketa to'ldiring — AI sizga uyqu vaqti, tozalik va odatlar bo'yicha eng mos xonadoshni foiz bilan taklif qiladi.",
  },
  {
    Icon: ShieldCheck,
    tint: "from-[oklch(0.85_0.14_75)]/30 to-[oklch(0.85_0.14_75)]/5",
    iconBg: "bg-warning text-warning-foreground",
    title: "Xavfsiz ijara qiling",
    desc: "ID va video tekshiruv, AI firibgarlik aniqlash va elektron shartnoma — barcha kelishuv ilova ichida bajariladi.",
  },
];

function Onboarding() {
  const [i, setI] = useState(0);
  const navigate = useNavigate();
  const s = slides[i];
  const last = i === slides.length - 1;

  const finish = () => {
    localStorage.setItem("roomie_onboarded", "1");
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto flex min-h-dvh max-w-[430px] flex-col px-6 pt-6 pb-8">
        {/* Skip */}
        <div className="flex justify-end">
          <button
            onClick={finish}
            className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground active:scale-95 transition"
          >
            O'tkazish
          </button>
        </div>

        {/* Illustration */}
        <div className="flex flex-1 flex-col items-center justify-center">
          <div
            key={i}
            className={`relative grid h-64 w-64 place-items-center rounded-[48px] bg-gradient-to-br ${s.tint} animate-in fade-in zoom-in-95 duration-500`}
          >
            <div className={`grid h-24 w-24 place-items-center rounded-3xl ${s.iconBg} shadow-lifted`}>
              <s.Icon className="h-11 w-11" strokeWidth={2} />
            </div>
          </div>

          <div key={`t-${i}`} className="mt-10 text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-[26px] font-bold tracking-tight text-foreground">
              {s.title}
            </h2>
            <p className="mx-auto mt-3 max-w-[320px] text-[15px] leading-relaxed text-muted-foreground">
              {s.desc}
            </p>
          </div>
        </div>

        {/* Dots */}
        <div className="mb-8 flex justify-center gap-2">
          {slides.map((_, idx) => (
            <span
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === i ? "w-8 bg-primary" : "w-2 bg-border"
              }`}
            />
          ))}
        </div>

        {/* Action */}
        <button
          onClick={() => (last ? finish() : setI(i + 1))}
          className="flex items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-[15px] font-semibold text-primary-foreground shadow-glow active:scale-[0.98] transition-transform"
        >
          {last ? "Boshlash" : "Keyingisi"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
