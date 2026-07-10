import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  User,
  GraduationCap,
  MapPin,
  Wallet,
  Home,
  Sparkles,
  Compass,
  Heart,
  Brain,
  PartyPopper,
  Camera,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  getOnboardingData,
  saveOnboardingData,
  type OnboardingData,
} from "@/lib/onboarding-storage";

export const Route = createFileRoute("/onboarding")({
  ssr: false,
  head: () => ({ meta: [{ title: "Sozlash — Roomie" }] }),
  component: Onboarding,
});

/* ---------- shared building blocks ---------- */

function StepHero({
  Icon,
  tint,
  iconBg,
  eyebrow,
  title,
  desc,
}: {
  Icon: React.ElementType;
  tint: string;
  iconBg: string;
  eyebrow: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className={`mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${tint}`}>
        <div className={`grid h-11 w-11 place-items-center rounded-xl ${iconBg}`}>
          <Icon className="h-5 w-5" strokeWidth={2.2} />
        </div>
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
      <h2 className="mt-1 text-[26px] font-bold leading-tight tracking-tight text-foreground">
        {title}
      </h2>
      {desc && (
        <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{desc}</p>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition active:scale-95 ${
        active
          ? "border-primary bg-primary text-primary-foreground shadow-glow"
          : "border-border bg-card text-foreground hover:border-primary/40"
      }`}
    >
      {children}
    </button>
  );
}

function OptionCard({
  active,
  onClick,
  title,
  desc,
  icon,
}: {
  active?: boolean;
  onClick?: () => void;
  title: string;
  desc?: string;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition active:scale-[0.98] ${
        active
          ? "border-primary bg-primary/5 shadow-glow"
          : "border-border bg-card hover:border-primary/40"
      }`}
    >
      {icon && (
        <div
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
            active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
          }`}
        >
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-semibold text-foreground">{title}</div>
        {desc && <div className="mt-0.5 text-xs text-muted-foreground">{desc}</div>}
      </div>
      {active && <Check className="h-5 w-5 text-primary" />}
    </button>
  );
}

function Field({
  label,
  children,
  optional,
}: {
  label: string;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-[13px] font-medium text-foreground">
        {label}
        {optional && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            ixtiyoriy
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

const formatSom = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm";

/* ---------- step catalog ---------- */

const UNIVERSITIES = ["WIUT", "INHA", "TIU", "TSUE", "TATU", "NUUz", "Boshqa"];
const CITIES = ["Toshkent", "Samarqand", "Buxoro", "Namangan", "Farg'ona", "Andijon"];
const DISTRICTS = [
  "Yunusobod",
  "Mirzo Ulug'bek",
  "Chilonzor",
  "Shayxontohur",
  "Yakkasaroy",
  "Olmazor",
  "Yashnobod",
  "Mirobod",
  "Sergeli",
];
const AMENITIES = [
  "Wi-Fi",
  "Kir mashina",
  "Konditsioner",
  "Isitish",
  "Oshxona",
  "Muzlatgich",
  "Parking",
  "Lift",
  "Ish stoli",
  "Balkon",
  "Sport zal",
  "Xavfsizlik",
  "Uy hayvonlari",
];
const TRANSPORT = ["Piyoda", "Metro", "Avtobus", "Avtomobil"];
const LANGS = ["O'zbek", "Rus", "Ingliz", "Koreys", "Turk", "Arab"];
const HOBBIES = ["Sport", "Kitob", "O'yin", "Musiqa", "Film", "Sayohat", "Kod yozish", "San'at"];

const PERSONALITY_Q: { key: string; q: string; a: string[] }[] = [
  { key: "morning", q: "Ertalab qanday odamsiz?", a: ["Erta turaman", "O'rtacha", "Kech turaman"] },
  { key: "weekend", q: "Dam olish kunlari nima qilasiz?", a: ["Uyda", "Tashqarida", "Aralash"] },
  { key: "energy", q: "Kunni qayerdan quvvat olasiz?", a: ["Yolg'iz", "Do'stlar bilan"] },
  { key: "planning", q: "Ish yuritishingiz qanday?", a: ["Rejali", "Erkin"] },
  { key: "cleanliness", q: "Uyda tartib qanchalik muhim?", a: ["Juda muhim", "O'rtacha", "Muhim emas"] },
  { key: "music", q: "Uyda musiqa tinglaysizmi?", a: ["Doim", "Ba'zan", "Kamdan-kam"] },
  { key: "cooking2", q: "Oshxonani ko'p ishlatasizmi?", a: ["Ha", "Ba'zan", "Yo'q"] },
  { key: "guests2", q: "Mehmon kutasizmi?", a: ["Tez-tez", "Ba'zan", "Kamdan-kam"] },
  { key: "conflict", q: "Nizolarni qanday hal qilasiz?", a: ["Ochiq gaplashaman", "Chetlab o'taman"] },
  { key: "share", q: "Narsalarni bo'lishishga tayyorsizmi?", a: ["Ha", "Ba'zilarini", "Yo'q"] },
  { key: "study2", q: "O'qish uchun tinchlik kerakmi?", a: ["Ha, mutlaqo", "Fon shovqin OK"] },
  { key: "night", q: "Kechqurun qanday odamsiz?", a: ["Erta uxlayman", "Yarim tundan keyin"] },
];

const TOTAL_STEPS = 10;

/* ---------- main ---------- */

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(() => getOnboardingData());

  const update = (patch: OnboardingData) => {
    const next = { ...data, ...patch };
    setData(next);
    saveOnboardingData(next);
  };

  const finish = () => {
    localStorage.setItem("roomie_onboarded", "1");
    navigate({ to: "/" });
  };

  const canProceed = useMemo(() => {
    switch (step) {
      case 1:
        return !!data.firstName && !!data.lastName && !!data.age && !!data.gender && !!data.phone;
      case 2:
        return !!data.university && !!data.faculty && !!data.yearOfStudy && !!data.graduationYear;
      case 3:
        return !!data.city && !!data.moveInDate && !!data.stayDuration;
      case 4:
        return !!data.budgetMin && !!data.budgetMax;
      case 5:
        return !!data.aptShareMode && !!data.aptType && !!data.furnished;
      case 6:
        return (data.amenities?.length ?? 0) > 0;
      case 7:
        return !!data.maxDistance && !!data.maxCommute;
      case 8:
        return !!data.sleepSchedule && !!data.cleanliness;
      case 9:
        return true;
      default:
        return true;
    }
  }, [step, data]);

  const back = () => (step > 1 ? setStep(step - 1) : navigate({ to: "/welcome" }));
  const next = () => (step < TOTAL_STEPS ? setStep(step + 1) : finish());
  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto flex min-h-dvh max-w-[430px] flex-col">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-background/90 px-5 pt-4 pb-3 backdrop-blur">
          <div className="flex items-center justify-between">
            <button
              onClick={back}
              className="grid h-9 w-9 place-items-center rounded-full bg-muted text-foreground active:scale-95"
              aria-label="Orqaga"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-medium text-muted-foreground">
              Qadam {step} / {TOTAL_STEPS}
            </span>
            <button
              onClick={finish}
              className="rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground active:scale-95"
            >
              O'tkazish
            </button>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-5 pb-6">
          <div key={step} className="animate-in fade-in slide-in-from-right-4 duration-300">
            {step === 1 && <Step1 data={data} update={update} />}
            {step === 2 && <Step2 data={data} update={update} />}
            {step === 3 && <Step3 data={data} update={update} />}
            {step === 4 && <Step4 data={data} update={update} />}
            {step === 5 && <Step5 data={data} update={update} />}
            {step === 6 && <Step6 data={data} update={update} />}
            {step === 7 && <Step7 data={data} update={update} />}
            {step === 8 && <Step8 data={data} update={update} />}
            {step === 9 && <Step9 data={data} update={update} />}
            {step === 10 && <Step10 data={data} />}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="sticky bottom-0 border-t border-border bg-background/95 px-5 py-4 backdrop-blur">
          <Button
            onClick={next}
            disabled={!canProceed}
            className="h-14 w-full rounded-2xl text-[15px] font-semibold shadow-glow disabled:opacity-50"
          >
            {step === TOTAL_STEPS ? (
              <>
                Mukammal xonadosh & uy topish
                <Sparkles className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Davom etish
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ---------- STEP 1: Basic info ---------- */
function Step1({ data, update }: { data: OnboardingData; update: (p: OnboardingData) => void }) {
  return (
    <>
      <StepHero
        Icon={User}
        tint="from-primary/20 to-primary/5"
        iconBg="bg-primary text-primary-foreground"
        eyebrow="1-qadam · Asosiy"
        title="Keling, tanishaylik"
        desc="Sizga mos xonadosh topish uchun bir necha ma'lumot kerak."
      />
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Ism">
            <Input
              value={data.firstName ?? ""}
              onChange={(e) => update({ firstName: e.target.value })}
              placeholder="Doniyor"
              className="h-12 rounded-xl"
            />
          </Field>
          <Field label="Familiya">
            <Input
              value={data.lastName ?? ""}
              onChange={(e) => update({ lastName: e.target.value })}
              placeholder="Rahimov"
              className="h-12 rounded-xl"
            />
          </Field>
        </div>
        <Field label="Yosh">
          <Input
            type="number"
            inputMode="numeric"
            min={16}
            max={60}
            value={data.age ?? ""}
            onChange={(e) => update({ age: Number(e.target.value) })}
            placeholder="20"
            className="h-12 rounded-xl"
          />
        </Field>
        <Field label="Jins">
          <div className="grid grid-cols-3 gap-2">
            {(["male", "female", "other"] as const).map((g) => (
              <Chip key={g} active={data.gender === g} onClick={() => update({ gender: g })}>
                {g === "male" ? "Erkak" : g === "female" ? "Ayol" : "Boshqa"}
              </Chip>
            ))}
          </div>
        </Field>
        <Field label="Telefon raqam">
          <div className="relative">
            <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="tel"
              inputMode="tel"
              value={data.phone ?? ""}
              onChange={(e) => update({ phone: e.target.value })}
              placeholder="+998 90 123 45 67"
              className="h-12 rounded-xl pl-10"
            />
            {data.phone && !data.phoneVerified && (
              <button
                onClick={() => update({ phoneVerified: true })}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground active:scale-95"
              >
                Tasdiqlash
              </button>
            )}
            {data.phoneVerified && (
              <span className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 text-xs font-medium text-success">
                <ShieldCheck className="h-4 w-4" /> Tasdiqlangan
              </span>
            )}
          </div>
        </Field>
        <Field label="Profil rasmi" optional>
          <label className="flex h-24 cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/40 text-sm text-muted-foreground active:scale-[0.99]">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const r = new FileReader();
                r.onload = () => update({ photo: String(r.result) });
                r.readAsDataURL(f);
              }}
            />
            {data.photo ? (
              <img src={data.photo} alt="Profil" className="h-20 w-20 rounded-xl object-cover" />
            ) : (
              <>
                <Camera className="h-5 w-5" /> Rasm yuklash
              </>
            )}
          </label>
        </Field>
      </div>
    </>
  );
}

/* ---------- STEP 2: Education ---------- */
function Step2({ data, update }: { data: OnboardingData; update: (p: OnboardingData) => void }) {
  const currentYear = new Date().getFullYear();
  return (
    <>
      <StepHero
        Icon={GraduationCap}
        tint="from-[oklch(0.85_0.15_155)]/30 to-[oklch(0.85_0.15_155)]/5"
        iconBg="bg-success text-success-foreground"
        eyebrow="2-qadam · Ta'lim"
        title="O'qishingiz haqida"
      />
      <div className="space-y-4">
        <Field label="Universitet">
          <div className="flex flex-wrap gap-2">
            {UNIVERSITIES.map((u) => (
              <Chip key={u} active={data.university === u} onClick={() => update({ university: u })}>
                {u}
              </Chip>
            ))}
          </div>
        </Field>
        <Field label="Fakultet / Yo'nalish">
          <Input
            value={data.faculty ?? ""}
            onChange={(e) => update({ faculty: e.target.value })}
            placeholder="Kompyuter injiniringi"
            className="h-12 rounded-xl"
          />
        </Field>
        <Field label="O'qish kursi">
          <div className="grid grid-cols-5 gap-2">
            {["1", "2", "3", "4", "Master"].map((y) => (
              <Chip key={y} active={data.yearOfStudy === y} onClick={() => update({ yearOfStudy: y })}>
                {y}
              </Chip>
            ))}
          </div>
        </Field>
        <Field label="Talaba ID" optional>
          <Input
            value={data.studentId ?? ""}
            onChange={(e) => update({ studentId: e.target.value })}
            placeholder="ST-2024-0123"
            className="h-12 rounded-xl"
          />
        </Field>
        <Field label="Bitirish yili">
          <div className="flex flex-wrap gap-2">
            {[0, 1, 2, 3, 4].map((n) => {
              const y = currentYear + n;
              return (
                <Chip
                  key={y}
                  active={data.graduationYear === y}
                  onClick={() => update({ graduationYear: y })}
                >
                  {y}
                </Chip>
              );
            })}
          </div>
        </Field>
      </div>
    </>
  );
}

/* ---------- STEP 3: Move-in ---------- */
function Step3({ data, update }: { data: OnboardingData; update: (p: OnboardingData) => void }) {
  const toggleDistrict = (d: string) => {
    const cur = data.districts ?? [];
    update({
      districts: cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d],
    });
  };
  return (
    <>
      <StepHero
        Icon={MapPin}
        tint="from-[oklch(0.85_0.14_75)]/30 to-[oklch(0.85_0.14_75)]/5"
        iconBg="bg-warning text-warning-foreground"
        eyebrow="3-qadam · Ko'chib o'tish"
        title="Qayerga ko'chmoqchisiz?"
      />
      <div className="space-y-4">
        <Field label="Shahar">
          <div className="flex flex-wrap gap-2">
            {CITIES.map((c) => (
              <Chip key={c} active={data.city === c} onClick={() => update({ city: c })}>
                {c}
              </Chip>
            ))}
          </div>
        </Field>
        <Field label="Afzal tumanlar (bir nechta)">
          <div className="flex flex-wrap gap-2">
            {DISTRICTS.map((d) => (
              <Chip key={d} active={data.districts?.includes(d)} onClick={() => toggleDistrict(d)}>
                {d}
              </Chip>
            ))}
          </div>
        </Field>
        <Field label="Ko'chib o'tish sanasi">
          <Input
            type="date"
            value={data.moveInDate ?? ""}
            onChange={(e) => update({ moveInDate: e.target.value })}
            className="h-12 rounded-xl"
          />
        </Field>
        <Field label="Yashash muddati">
          <div className="space-y-2">
            <OptionCard
              active={data.stayDuration === "semester"}
              onClick={() => update({ stayDuration: "semester" })}
              title="Bir semestr"
              desc="4–5 oy"
            />
            <OptionCard
              active={data.stayDuration === "1year"}
              onClick={() => update({ stayDuration: "1year" })}
              title="1 yil"
              desc="Bir o'quv yili"
            />
            <OptionCard
              active={data.stayDuration === "long"}
              onClick={() => update({ stayDuration: "long" })}
              title="Uzoq muddat"
              desc="1 yildan ko'proq"
            />
          </div>
        </Field>
      </div>
    </>
  );
}

/* ---------- STEP 4: Budget ---------- */
function Step4({ data, update }: { data: OnboardingData; update: (p: OnboardingData) => void }) {
  const min = data.budgetMin ?? 1_500_000;
  const max = data.budgetMax ?? 3_000_000;
  return (
    <>
      <StepHero
        Icon={Wallet}
        tint="from-primary/20 to-primary/5"
        iconBg="bg-primary text-primary-foreground"
        eyebrow="4-qadam · Byudjet"
        title="Oylik byudjetingiz"
      />
      <div className="space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-primary/10 to-primary/0 p-5">
          <div className="text-xs font-medium text-muted-foreground">Oyiga</div>
          <div className="mt-1 text-2xl font-bold text-foreground">
            {formatSom(min)} – {formatSom(max)}
          </div>
          <div className="mt-5">
            <Slider
              value={[min, max]}
              min={500_000}
              max={10_000_000}
              step={100_000}
              onValueChange={(v) => update({ budgetMin: v[0], budgetMax: v[1] })}
            />
            <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
              <span>500K</span>
              <span>10M</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Minimum">
            <Input
              type="number"
              value={min}
              onChange={(e) => update({ budgetMin: Number(e.target.value) })}
              className="h-12 rounded-xl"
            />
          </Field>
          <Field label="Maksimum">
            <Input
              type="number"
              value={max}
              onChange={(e) => update({ budgetMax: Number(e.target.value) })}
              className="h-12 rounded-xl"
            />
          </Field>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
          <div>
            <div className="text-[14px] font-semibold text-foreground">Kommunal to'lovlarni bo'lishasizmi?</div>
            <div className="text-xs text-muted-foreground">Suv, gaz, elektr, internet</div>
          </div>
          <Switch
            checked={!!data.splitUtilities}
            onCheckedChange={(v) => update({ splitUtilities: v })}
          />
        </div>
        <Field label="Umumiy oylik xarajat maksimumi">
          <Input
            type="number"
            value={data.maxTotal ?? ""}
            onChange={(e) => update({ maxTotal: Number(e.target.value) })}
            placeholder="4 000 000"
            className="h-12 rounded-xl"
          />
        </Field>
      </div>
    </>
  );
}

/* ---------- STEP 5: Housing preferences ---------- */
function Step5({ data, update }: { data: OnboardingData; update: (p: OnboardingData) => void }) {
  return (
    <>
      <StepHero
        Icon={Home}
        tint="from-[oklch(0.85_0.15_155)]/30 to-[oklch(0.85_0.15_155)]/5"
        iconBg="bg-success text-success-foreground"
        eyebrow="5-qadam · Uy"
        title="Qanday uy qidiryapsiz?"
      />
      <div className="space-y-4">
        <Field label="Uy turi">
          <div className="grid grid-cols-1 gap-2">
            <OptionCard
              active={data.aptShareMode === "entire"}
              onClick={() => update({ aptShareMode: "entire" })}
              title="Butun kvartira"
              desc="O'zim yoki tanish do'stlar bilan"
              icon={<Home className="h-4 w-4" />}
            />
            <OptionCard
              active={data.aptShareMode === "shared"}
              onClick={() => update({ aptShareMode: "shared" })}
              title="Umumiy kvartira"
              desc="Boshqa xonadoshlar bilan"
              icon={<User className="h-4 w-4" />}
            />
          </div>
        </Field>
        <Field label="Necha xonadosh bilan?">
          <div className="grid grid-cols-5 gap-2">
            {[0, 1, 2, 3, 4].map((n) => (
              <Chip
                key={n}
                active={data.roommatesCount === n}
                onClick={() => update({ roommatesCount: n })}
              >
                {n === 0 ? "Yolg'iz" : n}
              </Chip>
            ))}
          </div>
        </Field>
        <Field label="Xona turi">
          <div className="grid grid-cols-2 gap-2">
            {(["private", "shared"] as const).map((r) => (
              <Chip key={r} active={data.roomType === r} onClick={() => update({ roomType: r })}>
                {r === "private" ? "Alohida xona" : "Umumiy xona"}
              </Chip>
            ))}
          </div>
        </Field>
        <Field label="Kvartira turi">
          <div className="flex flex-wrap gap-2">
            {["Studio", "1 xonali", "2 xonali", "3 xonali", "4+ xonali"].map((t) => (
              <Chip key={t} active={data.aptType === t} onClick={() => update({ aptType: t })}>
                {t}
              </Chip>
            ))}
          </div>
        </Field>
        <Field label="Afzal qavat" optional>
          <div className="flex flex-wrap gap-2">
            {["1–3", "4–7", "8+", "Farqi yo'q"].map((f) => (
              <Chip key={f} active={data.floor === f} onClick={() => update({ floor: f })}>
                {f}
              </Chip>
            ))}
          </div>
        </Field>
        <Field label="Jihozlar">
          <div className="grid grid-cols-3 gap-2">
            {(["furnished", "unfurnished", "any"] as const).map((f) => (
              <Chip key={f} active={data.furnished === f} onClick={() => update({ furnished: f })}>
                {f === "furnished" ? "Jihozlangan" : f === "unfurnished" ? "Bo'sh" : "Farqi yo'q"}
              </Chip>
            ))}
          </div>
        </Field>
      </div>
    </>
  );
}

/* ---------- STEP 6: Amenities ---------- */
function Step6({ data, update }: { data: OnboardingData; update: (p: OnboardingData) => void }) {
  const toggle = (a: string) => {
    const cur = data.amenities ?? [];
    update({ amenities: cur.includes(a) ? cur.filter((x) => x !== a) : [...cur, a] });
  };
  return (
    <>
      <StepHero
        Icon={Sparkles}
        tint="from-primary/20 to-primary/5"
        iconBg="bg-primary text-primary-foreground"
        eyebrow="6-qadam · Qulayliklar"
        title="Nima majburiy?"
        desc="Bir nechtasini tanlashingiz mumkin."
      />
      <div className="flex flex-wrap gap-2">
        {AMENITIES.map((a) => (
          <Chip key={a} active={data.amenities?.includes(a)} onClick={() => toggle(a)}>
            {a}
          </Chip>
        ))}
      </div>
    </>
  );
}

/* ---------- STEP 7: Location ---------- */
function Step7({ data, update }: { data: OnboardingData; update: (p: OnboardingData) => void }) {
  const toggleT = (t: string) => {
    const cur = data.transport ?? [];
    update({ transport: cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t] });
  };
  return (
    <>
      <StepHero
        Icon={Compass}
        tint="from-[oklch(0.85_0.14_75)]/30 to-[oklch(0.85_0.14_75)]/5"
        iconBg="bg-warning text-warning-foreground"
        eyebrow="7-qadam · Joylashuv"
        title="Universitetga qanchalik yaqin?"
      />
      <div className="space-y-5">
        {/* Faux interactive map */}
        <div className="relative h-56 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-primary/5 to-background">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 40%, oklch(0.55 0.22 265 / 0.25) 0%, transparent 40%), radial-gradient(circle at 70% 60%, oklch(0.75 0.18 145 / 0.25) 0%, transparent 40%)",
            }}
          />
          <div className="absolute inset-0 grid place-items-center">
            <div className="rounded-2xl bg-card/90 px-4 py-3 text-center shadow-lifted backdrop-blur">
              <MapPin className="mx-auto h-6 w-6 text-primary" />
              <div className="mt-1 text-xs font-medium text-foreground">
                Xaritada afzal hududlarni belgilang
              </div>
              <div className="text-[11px] text-muted-foreground">Keyingi qadamda ochiladi</div>
            </div>
          </div>
        </div>

        <Field label={`Universitetgacha maksimal masofa: ${data.maxDistance ?? 5} km`}>
          <Slider
            value={[data.maxDistance ?? 5]}
            min={1}
            max={30}
            step={1}
            onValueChange={(v) => update({ maxDistance: v[0] })}
          />
        </Field>

        <Field label="Transport">
          <div className="grid grid-cols-2 gap-2">
            {TRANSPORT.map((t) => (
              <Chip key={t} active={data.transport?.includes(t)} onClick={() => toggleT(t)}>
                {t}
              </Chip>
            ))}
          </div>
        </Field>

        <Field label="Maksimal yo'l vaqti">
          <div className="flex flex-wrap gap-2">
            {[5, 10, 15, 20, 30].map((m) => (
              <Chip key={m} active={data.maxCommute === m} onClick={() => update({ maxCommute: m })}>
                {m} daqiqa
              </Chip>
            ))}
          </div>
        </Field>
      </div>
    </>
  );
}

/* ---------- STEP 8: Lifestyle ---------- */
function Step8({ data, update }: { data: OnboardingData; update: (p: OnboardingData) => void }) {
  const toggleLang = (l: string) => {
    const cur = data.languages ?? [];
    update({ languages: cur.includes(l) ? cur.filter((x) => x !== l) : [...cur, l] });
  };
  const toggleHobby = (h: string) => {
    const cur = data.hobbies ?? [];
    update({ hobbies: cur.includes(h) ? cur.filter((x) => x !== h) : [...cur, h] });
  };
  const row = (
    label: string,
    key: keyof OnboardingData,
    options: string[],
  ) => (
    <Field label={label}>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <Chip
            key={o}
            active={(data as Record<string, unknown>)[key as string] === o}
            onClick={() => update({ [key]: o } as OnboardingData)}
          >
            {o}
          </Chip>
        ))}
      </div>
    </Field>
  );
  return (
    <>
      <StepHero
        Icon={Heart}
        tint="from-[oklch(0.85_0.15_155)]/30 to-[oklch(0.85_0.15_155)]/5"
        iconBg="bg-success text-success-foreground"
        eyebrow="8-qadam · Turmush tarzi"
        title="Sizga mos xonadosh uchun"
      />
      <div className="space-y-5">
        {row("Uyqu vaqti", "sleepSchedule", ["Erta", "O'rtacha", "Kech"])}
        <Field label={`Tozalik darajasi: ${data.cleanliness ?? 5}/10`}>
          <Slider
            value={[data.cleanliness ?? 5]}
            min={1}
            max={10}
            step={1}
            onValueChange={(v) => update({ cleanliness: v[0] })}
          />
        </Field>
        {row("Chekish", "smoking", ["Yo'q", "Ba'zan", "Ha"])}
        {row("Ichkilik", "drinking", ["Yo'q", "Ba'zan", "Ha"])}
        {row("Mehmonlar", "guests", ["Kam", "O'rtacha", "Tez-tez"])}
        {row("Shovqinga toqat", "noise", ["Past", "O'rtacha", "Yuqori"])}
        {row("O'qish odati", "studyHabits", ["Uyda", "Kutubxonada", "Aralash"])}
        {row("Ish jadvali", "workSchedule", ["Yo'q", "Yarim kunlik", "To'liq"])}
        {row("Uy hayvonlari", "pets", ["Yo'q", "Bor", "Farqi yo'q"])}
        {row("Ovqat tayyorlash", "cooking", ["Kamdan-kam", "Ba'zan", "Har kuni"])}
        <Field label={`Introvert ↔ Ekstravert: ${data.personalityAxis ?? 50}`}>
          <Slider
            value={[data.personalityAxis ?? 50]}
            min={0}
            max={100}
            step={1}
            onValueChange={(v) => update({ personalityAxis: v[0] })}
          />
          <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
            <span>Introvert</span>
            <span>Ekstravert</span>
          </div>
        </Field>
        <Field label="Tillar">
          <div className="flex flex-wrap gap-2">
            {LANGS.map((l) => (
              <Chip key={l} active={data.languages?.includes(l)} onClick={() => toggleLang(l)}>
                {l}
              </Chip>
            ))}
          </div>
        </Field>
        <Field label="Qiziqishlar">
          <div className="flex flex-wrap gap-2">
            {HOBBIES.map((h) => (
              <Chip key={h} active={data.hobbies?.includes(h)} onClick={() => toggleHobby(h)}>
                {h}
              </Chip>
            ))}
          </div>
        </Field>
      </div>
    </>
  );
}

/* ---------- STEP 9: Personality ---------- */
function Step9({ data, update }: { data: OnboardingData; update: (p: OnboardingData) => void }) {
  const personality = data.personality ?? {};
  const answered = Object.keys(personality).length;
  return (
    <>
      <StepHero
        Icon={Brain}
        tint="from-primary/20 to-primary/5"
        iconBg="bg-primary text-primary-foreground"
        eyebrow="9-qadam · Shaxsiyat"
        title="Sizni yaxshiroq bilaylik"
        desc={`${answered} / ${PERSONALITY_Q.length} javob berildi`}
      />
      <div className="space-y-4">
        {PERSONALITY_Q.map((p) => (
          <div key={p.key} className="rounded-2xl border border-border bg-card p-4">
            <div className="mb-3 text-[14px] font-semibold text-foreground">{p.q}</div>
            <div className="flex flex-wrap gap-2">
              {p.a.map((opt) => (
                <Chip
                  key={opt}
                  active={personality[p.key] === opt}
                  onClick={() =>
                    update({ personality: { ...personality, [p.key]: opt } })
                  }
                >
                  {opt}
                </Chip>
              ))}
            </div>
          </div>
        ))}
        <Textarea
          placeholder="O'zingiz haqingizda qo'shimcha... (ixtiyoriy)"
          className="min-h-24 rounded-2xl"
          onChange={(e) =>
            update({ personality: { ...personality, note: e.target.value } })
          }
          defaultValue={personality.note ?? ""}
        />
      </div>
    </>
  );
}

/* ---------- STEP 10: AI Summary ---------- */
function Step10({ data }: { data: OnboardingData }) {
  const budget =
    data.budgetMin && data.budgetMax
      ? `${(data.budgetMin / 1_000_000).toFixed(1)}–${(data.budgetMax / 1_000_000).toFixed(1)} mln so'm`
      : "byudjetingiz doirasida";
  const uni = data.university ?? "universitetingiz";
  const commute = data.maxCommute ?? 15;
  const amen =
    data.amenities && data.amenities.length > 0
      ? data.amenities.slice(0, 3).join(", ")
      : "asosiy qulayliklar";
  const rms = data.roommatesCount ?? 1;

  return (
    <>
      <StepHero
        Icon={PartyPopper}
        tint="from-primary/20 to-primary/5"
        iconBg="bg-primary text-primary-foreground"
        eyebrow="10-qadam · Tayyor"
        title="Ajoyib! AI siz uchun izlashni boshlaydi"
      />
      <div className="rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-background p-5 shadow-card">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
          <Sparkles className="h-4 w-4" /> Sizning profilingiz
        </div>
        <ul className="space-y-3 text-[14px] leading-relaxed text-foreground">
          <SummaryRow>
            Oyiga <b>{budget}</b> gacha kvartiralar
          </SummaryRow>
          <SummaryRow>
            <b>{uni}</b> dan <b>{commute} daqiqa</b> ichida
          </SummaryRow>
          <SummaryRow>
            {amen} bilan jihozlangan
          </SummaryRow>
          <SummaryRow>
            {rms === 0 ? "Yolg'iz yashash" : `${rms} xonadosh bilan`}
          </SummaryRow>
          <SummaryRow>
            Sizning turmush tarzingiz va kundalik ritmingizga mos
          </SummaryRow>
        </ul>
      </div>
      <p className="mt-5 text-center text-xs text-muted-foreground">
        Bu ma'lumotlarni profilda istalgan vaqt tahrirlashingiz mumkin.
      </p>
    </>
  );
}

function SummaryRow({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
        <Check className="h-3 w-3" strokeWidth={3} />
      </span>
      <span>{children}</span>
    </li>
  );
}
