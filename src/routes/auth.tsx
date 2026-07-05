import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, Phone, Send, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({ meta: [{ title: "Kirish — Roomie" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"choose" | "email">("choose");
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  // If already signed in (or session arrives after OAuth), leave the auth page.
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted && data.session) navigate({ to: "/", replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === "SIGNED_IN" || event === "INITIAL_SESSION" || event === "TOKEN_REFRESHED")) {
        navigate({ to: "/", replace: true });
      }
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const r = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (r.error) {
        toast.error("Google: " + (r.error.message ?? "xatolik"));
        setLoading(false);
        return;
      }
      if (r.redirected) return; // browser will navigate
      // popup flow: listener above will navigate on SIGNED_IN
      toast.success("Muvaffaqiyatli kirdingiz");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Google orqali kirishda xatolik";
      toast.error(msg);
      setLoading(false);
    }
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast.success("Ro'yxatdan o'tildi! Email pochtangizni tekshiring.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Xush kelibsiz!");
        navigate({ to: "/" });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Xatolik yuz berdi";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (mode === "email") {
    return (
      <div className="min-h-dvh bg-background">
        <div className="mx-auto min-h-dvh max-w-[430px] px-6 pt-6 pb-8">
          <button
            onClick={() => setMode("choose")}
            aria-label="Orqaga"
            className="grid h-11 w-11 place-items-center rounded-2xl bg-card shadow-soft active:scale-95 transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="mt-8">
            <h1 className="text-[26px] font-bold tracking-tight">
              {isSignup ? "Ro'yxatdan o'tish" : "Xush kelibsiz"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isSignup ? "Email va parol bilan hisob yarating" : "Emailingiz bilan kiring"}
            </p>
          </div>

          <form onSubmit={handleEmail} className="mt-8 space-y-3">
            {isSignup && (
              <input
                type="text"
                required
                placeholder="To'liq ismingiz"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30"
              />
            )}
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30"
            />
            <input
              type="password"
              required
              minLength={6}
              placeholder="Parol"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30"
            />

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-[15px] font-semibold text-primary-foreground shadow-glow active:scale-[0.98] transition disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSignup ? "Ro'yxatdan o'tish" : "Kirish"}
            </button>
          </form>

          <button
            onClick={() => setIsSignup(!isSignup)}
            className="mt-6 w-full text-center text-sm text-muted-foreground"
          >
            {isSignup ? (
              <>Allaqachon hisobingiz bormi? <span className="font-semibold text-primary">Kirish</span></>
            ) : (
              <>Yangi foydalanuvchimisiz? <span className="font-semibold text-primary">Ro'yxatdan o'tish</span></>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto flex min-h-dvh max-w-[430px] flex-col px-6 pt-10 pb-8">
        <div className="flex flex-col items-center">
          <div className="grid h-20 w-20 place-items-center rounded-3xl bg-primary shadow-glow">
            <img src={logo} alt="" width={56} height={56} className="h-12 w-12 brightness-0 invert" />
          </div>
          <h1 className="mt-5 text-[28px] font-bold tracking-tight">Roomie'ga kiring</h1>
          <p className="mt-2 max-w-[300px] text-center text-sm text-muted-foreground">
            Kvartira topish va xonadosh moslashuvi uchun akkaunt yarating
          </p>
        </div>

        <div className="mt-10 flex-1 space-y-3">
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-card py-3.5 text-sm font-semibold shadow-soft active:scale-[0.98] transition disabled:opacity-60"
          >
            <GoogleIcon />
            Google orqali davom etish
          </button>

          <button
            onClick={() => toast.info("Apple sign-in tez orada ulanadi")}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-foreground py-3.5 text-sm font-semibold text-background active:scale-[0.98] transition"
          >
            <AppleIcon />
            Apple orqali davom etish
          </button>

          <button
            onClick={() => setMode("email")}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-card py-3.5 text-sm font-semibold shadow-soft active:scale-[0.98] transition"
          >
            <Mail className="h-4 w-4" />
            Email orqali
          </button>

          <button
            onClick={() => toast.info("Telefon orqali OTP tez orada ulanadi")}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-card py-3.5 text-sm font-semibold shadow-soft active:scale-[0.98] transition"
          >
            <Phone className="h-4 w-4" />
            Telefon raqam
          </button>

          <button
            onClick={() => toast.info("Telegram login tez orada ulanadi")}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-card py-3.5 text-sm font-semibold shadow-soft active:scale-[0.98] transition"
          >
            <Send className="h-4 w-4 text-[oklch(0.68_0.15_240)]" />
            Telegram
          </button>
        </div>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-muted-foreground">
          Davom etib, siz{" "}
          <Link to="/" className="font-medium underline">Foydalanish shartlari</Link>
          {" "}va{" "}
          <Link to="/" className="font-medium underline">Maxfiylik siyosati</Link>
          ga rozilik bildirasiz.
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}
