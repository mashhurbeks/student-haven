import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/welcome")({
  ssr: false,
  head: () => ({ meta: [{ title: "Roomie" }] }),
  component: Welcome,
});

function Welcome() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => {
      const done = typeof window !== "undefined" && localStorage.getItem("roomie_onboarded");
      navigate({ to: done ? "/auth" : "/onboarding", replace: true });
    }, 1800);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="min-h-dvh bg-gradient-to-br from-primary via-[oklch(0.52_0.23_268)] to-[oklch(0.42_0.24_275)] text-primary-foreground">
      <div className="mx-auto flex min-h-dvh max-w-[430px] flex-col items-center justify-center px-8">
        <div className="animate-in fade-in zoom-in-95 duration-700 flex flex-col items-center">
          <div className="grid h-28 w-28 place-items-center rounded-[32px] bg-white/15 backdrop-blur-xl shadow-2xl ring-1 ring-white/20">
            <img src={logo} alt="Roomie" width={72} height={72} className="h-16 w-16" />
          </div>
          <h1 className="mt-6 text-4xl font-black tracking-tight">Roomie</h1>
        </div>
        <p className="absolute bottom-14 max-w-[280px] px-6 text-center text-sm leading-relaxed text-white/85">
          O'zbekistondagi talabalar uchun eng ishonchli uy topish platformasi
        </p>
        <div className="absolute bottom-6 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
