import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2, Save } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/roommate-survey")({
  head: () => ({
    meta: [
      { title: "Xonadosh anketasi — Roomie" },
      {
        name: "description",
        content:
          "To'liq anketa: hayot tarzi, byudjet, odatlar va kutilmalar. Kelajakda janjal chiqmasin.",
      },
    ],
  }),
  component: RoommateSurveyPage,
});

type Form = {
  gender: "male" | "female" | "any";
  birth_year: number;
  university: string;
  study_year: number;
  major: string;

  budget_min: number;
  budget_max: number;
  move_in_date: string;
  city: string;
  districts: string[];
  preferred_gender: "male" | "female" | "any";

  sleep_schedule: "early_bird" | "night_owl" | "flexible";
  wake_time: string;
  sleep_time: string;
  cleanliness: "very_clean" | "clean" | "moderate" | "relaxed";
  noise_tolerance: "silent" | "quiet" | "moderate" | "lively";
  smoking: "no" | "outside_only" | "yes";
  alcohol: "no" | "sometimes" | "yes";
  pets_ok: boolean;
  has_pets: boolean;
  guests: "never" | "rarely" | "sometimes" | "often";
  overnight_guests_ok: boolean;

  cooks_often: boolean;
  shares_food: boolean;
  dietary_restrictions: string[];
  halal_only: boolean;

  religion: string;
  prays: boolean;
  fasts_ramadan: boolean;
  religious_practices_at_home: boolean;

  languages: string[];
  personality_type: string;
  hobbies: string[];
  interests: string;

  work_or_study_schedule: string;
  usually_home_days: string[];

  had_roommate_before: boolean;
  previous_experience: string;
  conflict_style: string;

  expected_qualities: string[];
  deal_breakers: string[];
  chores_split: string;
  bills_split: string;

  preferred_contact: string;
  additional_notes: string;
  visibility: "public" | "private";
};

const DEFAULTS: Form = {
  gender: "male",
  birth_year: 2004,
  university: "",
  study_year: 1,
  major: "",
  budget_min: 1500000,
  budget_max: 3000000,
  move_in_date: "",
  city: "Toshkent",
  districts: [],
  preferred_gender: "any",
  sleep_schedule: "flexible",
  wake_time: "07:00",
  sleep_time: "23:00",
  cleanliness: "clean",
  noise_tolerance: "quiet",
  smoking: "no",
  alcohol: "no",
  pets_ok: false,
  has_pets: false,
  guests: "rarely",
  overnight_guests_ok: false,
  cooks_often: true,
  shares_food: false,
  dietary_restrictions: [],
  halal_only: true,
  religion: "",
  prays: false,
  fasts_ramadan: false,
  religious_practices_at_home: false,
  languages: ["O'zbek"],
  personality_type: "ambivert",
  hobbies: [],
  interests: "",
  work_or_study_schedule: "mixed",
  usually_home_days: [],
  had_roommate_before: false,
  previous_experience: "",
  conflict_style: "talk",
  expected_qualities: [],
  deal_breakers: [],
  chores_split: "equal",
  bills_split: "equal",
  preferred_contact: "chat",
  additional_notes: "",
  visibility: "public",
};

const DISTRICTS = [
  "Yunusobod", "Mirzo Ulug'bek", "Chilonzor", "Yakkasaroy", "Shayxontohur",
  "Olmazor", "Sergeli", "Uchtepa", "Yashnobod", "Bektemir", "Mirobod",
];
const UNIS = ["WIUT", "INHA", "TIU", "TATU", "TIIAME", "TDIU", "MDIS", "Boshqa"];
const HOBBIES = ["Sport", "Kitob", "Musiqa", "Kino", "Sayohat", "O'yin", "Kod yozish", "Rasm", "Ovqat pishirish"];
const DIETS = ["Halol", "Vegetarian", "Vegan", "Yong'oq allergiyasi", "Sut allergiyasi", "Gluten yo'q"];
const QUALITIES = ["Halol", "Tinch", "Toza", "Mas'uliyatli", "Ochiq", "Vaqtga aniq", "Diniy", "Sport"];
const REDLINES = ["Chekish", "Alkogol", "Kech shovqin", "Iflos qoldirish", "Ruxsatsiz mehmon", "Qarz olish", "Uy hayvoni"];
const DAYS = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];
const LANGS = ["O'zbek", "Rus", "Ingliz", "Qoraqalpoq", "Tojik", "Turk"];

const STEPS = [
  "Asosiy",
  "Uy-joy",
  "Uxlash & tozalik",
  "Odatlar",
  "Oshxona",
  "Din & madaniyat",
  "Xarakter",
  "Jadval",
  "Tajriba",
  "Kutilmalar",
  "Ko'rinish",
] as const;

function RoommateSurveyPage() {
  const { session, loading: authLoading } = useSession();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>(DEFAULTS);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!session) {
      navigate({ to: "/auth" });
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("roommate_profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();
      if (data) {
        setForm({ ...DEFAULTS, ...(data as Partial<Form>) });
      }
      setLoading(false);
    })();
  }, [session, authLoading, navigate]);

  const completion = useMemo(() => {
    const keys = Object.keys(DEFAULTS) as (keyof Form)[];
    let filled = 0;
    for (const k of keys) {
      const v = form[k];
      if (Array.isArray(v)) { if (v.length) filled++; }
      else if (typeof v === "boolean") { filled++; }
      else if (v !== "" && v !== null && v !== undefined) { filled++; }
    }
    return Math.round((filled / keys.length) * 100);
  }, [form]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));
  const toggleIn = (k: keyof Form, v: string) => {
    const arr = form[k] as string[];
    set(k, (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]) as never);
  };

  const save = async () => {
    if (!session) return;
    setSaving(true);
    const payload = { ...form, user_id: session.user.id, completion_percent: completion };
    const { error } = await supabase
      .from("roommate_profiles")
      .upsert(payload, { onConflict: "user_id" });
    setSaving(false);
    if (error) {
      toast.error("Saqlashda xato: " + error.message);
      return;
    }
    toast.success("Anketa saqlandi 🎉");
    navigate({ to: "/profile" });
  };

  if (authLoading || loading) {
    return (
      <MobileShell>
        <div className="grid place-items-center py-32">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </MobileShell>
    );
  }

  const isLast = step === STEPS.length - 1;

  return (
    <MobileShell>
      <header className="sticky top-0 z-10 bg-background/85 backdrop-blur-xl border-b border-border">
        <div className="flex items-center gap-2 px-5 pt-5 pb-3">
          <Link to="/profile" className="grid h-9 w-9 place-items-center rounded-xl bg-muted">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold tracking-tight truncate">Xonadosh anketasi</h1>
            <p className="text-[11px] text-muted-foreground truncate">
              {step + 1}/{STEPS.length} · {STEPS[step]} · to'ldirilgan {completion}%
            </p>
          </div>
          <button
            onClick={save}
            disabled={saving}
            className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary disabled:opacity-50"
            aria-label="Saqlash"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          </button>
        </div>
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </header>

      <section className="px-5 py-5 pb-40 space-y-5">
        {step === 0 && (
          <Group title="Siz haqingizda">
            <Field label="Jinsingiz">
              <Chips
                options={[["male","Erkak"],["female","Ayol"],["any","Aytmayman"]]}
                value={form.gender}
                onChange={(v) => set("gender", v as Form["gender"])}
              />
            </Field>
            <Field label="Tug'ilgan yilingiz">
              <input type="number" min={1950} max={2015} value={form.birth_year}
                onChange={(e) => set("birth_year", Number(e.target.value))}
                className={inputCls} />
            </Field>
            <Field label="Universitet">
              <Chips options={UNIS.map((u) => [u, u])} value={form.university}
                onChange={(v) => set("university", v)} />
              <input placeholder="Yoki qo'lda kiriting" value={form.university}
                onChange={(e) => set("university", e.target.value)} className={cn(inputCls, "mt-2")} />
            </Field>
            <Field label="Kurs">
              <input type="number" min={1} max={8} value={form.study_year}
                onChange={(e) => set("study_year", Number(e.target.value))} className={inputCls} />
            </Field>
            <Field label="Mutaxassislik">
              <input value={form.major} placeholder="Masalan: Kompyuter injiniringi"
                onChange={(e) => set("major", e.target.value)} className={inputCls} />
            </Field>
          </Group>
        )}

        {step === 1 && (
          <Group title="Uy-joy afzalliklari">
            <Field label={`Byudjet (so'm/oy): ${form.budget_min.toLocaleString()} — ${form.budget_max.toLocaleString()}`}>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" step={100000} value={form.budget_min}
                  onChange={(e) => set("budget_min", Number(e.target.value))} className={inputCls} />
                <input type="number" step={100000} value={form.budget_max}
                  onChange={(e) => set("budget_max", Number(e.target.value))} className={inputCls} />
              </div>
            </Field>
            <Field label="Ko'chib o'tish sanasi">
              <input type="date" value={form.move_in_date}
                onChange={(e) => set("move_in_date", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Shahar">
              <input value={form.city} onChange={(e) => set("city", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Tuman(lar)">
              <MultiChips options={DISTRICTS} values={form.districts}
                onToggle={(v) => toggleIn("districts", v)} />
            </Field>
            <Field label="Xonadosh jinsi">
              <Chips options={[["any","Farqi yo'q"],["male","Erkak"],["female","Ayol"]]}
                value={form.preferred_gender}
                onChange={(v) => set("preferred_gender", v as Form["preferred_gender"])} />
            </Field>
          </Group>
        )}

        {step === 2 && (
          <Group title="Uxlash rejimi & tozalik">
            <Field label="Uxlash rejimi">
              <Chips options={[["early_bird","Erta turaman"],["night_owl","Kechqurun faolman"],["flexible","Moslashuvchan"]]}
                value={form.sleep_schedule}
                onChange={(v) => set("sleep_schedule", v as Form["sleep_schedule"])} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Uyg'onaman">
                <input type="time" value={form.wake_time}
                  onChange={(e) => set("wake_time", e.target.value)} className={inputCls} />
              </Field>
              <Field label="Uxlayman">
                <input type="time" value={form.sleep_time}
                  onChange={(e) => set("sleep_time", e.target.value)} className={inputCls} />
              </Field>
            </div>
            <Field label="Tozalik darajasi">
              <Chips options={[["very_clean","Juda toza"],["clean","Toza"],["moderate","O'rtacha"],["relaxed","Bemalol"]]}
                value={form.cleanliness}
                onChange={(v) => set("cleanliness", v as Form["cleanliness"])} />
            </Field>
            <Field label="Shovqinga munosabat">
              <Chips options={[["silent","Sukut"],["quiet","Tinch"],["moderate","O'rtacha"],["lively","Jonli"]]}
                value={form.noise_tolerance}
                onChange={(v) => set("noise_tolerance", v as Form["noise_tolerance"])} />
            </Field>
          </Group>
        )}

        {step === 3 && (
          <Group title="Odatlar">
            <Field label="Chekish">
              <Chips options={[["no","Yo'q"],["outside_only","Faqat tashqarida"],["yes","Ha"]]}
                value={form.smoking}
                onChange={(v) => set("smoking", v as Form["smoking"])} />
            </Field>
            <Field label="Alkogol">
              <Chips options={[["no","Yo'q"],["sometimes","Ba'zan"],["yes","Ha"]]}
                value={form.alcohol}
                onChange={(v) => set("alcohol", v as Form["alcohol"])} />
            </Field>
            <Toggle label="Uy hayvonlariga roziman" value={form.pets_ok} onChange={(v) => set("pets_ok", v)} />
            <Toggle label="Menda uy hayvoni bor" value={form.has_pets} onChange={(v) => set("has_pets", v)} />
            <Field label="Mehmonlar">
              <Chips options={[["never","Hech qachon"],["rarely","Kamdan-kam"],["sometimes","Ba'zan"],["often","Tez-tez"]]}
                value={form.guests}
                onChange={(v) => set("guests", v as Form["guests"])} />
            </Field>
            <Toggle label="Tunash uchun mehmonlarga roziman"
              value={form.overnight_guests_ok} onChange={(v) => set("overnight_guests_ok", v)} />
          </Group>
        )}

        {step === 4 && (
          <Group title="Oshxona va ovqat">
            <Toggle label="Tez-tez ovqat tayyorlayman" value={form.cooks_often} onChange={(v) => set("cooks_often", v)} />
            <Toggle label="Ovqat bilan bo'lishaman" value={form.shares_food} onChange={(v) => set("shares_food", v)} />
            <Toggle label="Uyda faqat halol" value={form.halal_only} onChange={(v) => set("halal_only", v)} />
            <Field label="Ovqat cheklovlari / allergiya">
              <MultiChips options={DIETS} values={form.dietary_restrictions}
                onToggle={(v) => toggleIn("dietary_restrictions", v)} />
            </Field>
          </Group>
        )}

        {step === 5 && (
          <Group title="Din va madaniyat">
            <Field label="Din">
              <input value={form.religion} placeholder="Ixtiyoriy"
                onChange={(e) => set("religion", e.target.value)} className={inputCls} />
            </Field>
            <Toggle label="Namoz o'qiyman" value={form.prays} onChange={(v) => set("prays", v)} />
            <Toggle label="Ramazon ro'zasini tutaman" value={form.fasts_ramadan} onChange={(v) => set("fasts_ramadan", v)} />
            <Toggle label="Uyda diniy amallar bajarilishiga qarshi emasman"
              value={form.religious_practices_at_home} onChange={(v) => set("religious_practices_at_home", v)} />
          </Group>
        )}

        {step === 6 && (
          <Group title="Xarakter va qiziqishlar">
            <Field label="Tillar">
              <MultiChips options={LANGS} values={form.languages}
                onToggle={(v) => toggleIn("languages", v)} />
            </Field>
            <Field label="Xarakter turi">
              <Chips options={[["introvert","Introvert"],["ambivert","Ambivert"],["extrovert","Ekstrovert"]]}
                value={form.personality_type}
                onChange={(v) => set("personality_type", v)} />
            </Field>
            <Field label="Hobbylar">
              <MultiChips options={HOBBIES} values={form.hobbies}
                onToggle={(v) => toggleIn("hobbies", v)} />
            </Field>
            <Field label="Qiziqishlar (ixtiyoriy)">
              <textarea value={form.interests} rows={3}
                onChange={(e) => set("interests", e.target.value)} className={inputCls} />
            </Field>
          </Group>
        )}

        {step === 7 && (
          <Group title="Kundalik jadval">
            <Field label="O'qish / ish jadvali">
              <Chips options={[["morning","Ertalab"],["evening","Kechqurun"],["mixed","Aralash"],["remote","Uydan"]]}
                value={form.work_or_study_schedule}
                onChange={(v) => set("work_or_study_schedule", v)} />
            </Field>
            <Field label="Uyda ko'p bo'ladigan kunlar">
              <MultiChips options={DAYS} values={form.usually_home_days}
                onToggle={(v) => toggleIn("usually_home_days", v)} />
            </Field>
          </Group>
        )}

        {step === 8 && (
          <Group title="Avvalgi tajriba">
            <Toggle label="Avval xonadoshim bo'lgan"
              value={form.had_roommate_before} onChange={(v) => set("had_roommate_before", v)} />
            {form.had_roommate_before && (
              <Field label="Tajriba: nima yaxshi, nima yomon bo'lgan">
                <textarea rows={3} value={form.previous_experience}
                  onChange={(e) => set("previous_experience", e.target.value)} className={inputCls} />
              </Field>
            )}
            <Field label="Nizoli vaziyatda">
              <Chips options={[["talk","To'g'ridan gaplashaman"],["mediator","Vositachi orqali"],["avoid","Chetlashaman"]]}
                value={form.conflict_style}
                onChange={(v) => set("conflict_style", v)} />
            </Field>
          </Group>
        )}

        {step === 9 && (
          <Group title="Xonadoshdan kutilma">
            <Field label="Muhim xususiyatlar">
              <MultiChips options={QUALITIES} values={form.expected_qualities}
                onToggle={(v) => toggleIn("expected_qualities", v)} />
            </Field>
            <Field label="Qizil chiziqlar (mutlaqo yo'l qo'yilmaydigan)">
              <MultiChips options={REDLINES} values={form.deal_breakers}
                onToggle={(v) => toggleIn("deal_breakers", v)} />
            </Field>
            <Field label="Uy yumushlari bo'linishi">
              <Chips options={[["equal","Teng"],["rotation","Navbat bilan"],["whoever_dirtier","Kim ifloslasa"]]}
                value={form.chores_split}
                onChange={(v) => set("chores_split", v)} />
            </Field>
            <Field label="Kommunal to'lovlar">
              <Chips options={[["equal","Teng"],["by_usage","Sarfga qarab"],["negotiable","Kelishuv"]]}
                value={form.bills_split}
                onChange={(v) => set("bills_split", v)} />
            </Field>
          </Group>
        )}

        {step === 10 && (
          <Group title="Aloqa va ko'rinish">
            <Field label="Aloqa afzalligi">
              <Chips options={[["chat","Ilova ichida chat"],["phone","Telefon"],["telegram","Telegram"]]}
                value={form.preferred_contact}
                onChange={(v) => set("preferred_contact", v)} />
            </Field>
            <Field label="Qo'shimcha izoh (ixtiyoriy)">
              <textarea rows={4} value={form.additional_notes}
                placeholder="Boshqalar bilishi kerak bo'lgan boshqa narsalar"
                onChange={(e) => set("additional_notes", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Anketa ko'rinishi">
              <Chips options={[["public","Ochiq — hamma ko'radi"],["private","Yopiq — faqat men"]]}
                value={form.visibility}
                onChange={(v) => set("visibility", v as Form["visibility"])} />
            </Field>
            <div className="rounded-2xl bg-primary/5 p-4 text-xs text-foreground/80">
              To'ldirildi: <b>{completion}%</b>. Qanchalik to'liq bo'lsa, moslik shunchalik aniq bo'ladi.
            </div>
          </Group>
        )}
      </section>

      <nav className="fixed bottom-0 inset-x-0 mx-auto max-w-[430px] px-5 pb-6 pt-3 bg-gradient-to-t from-background via-background to-background/80">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center justify-center gap-1 rounded-2xl border border-border py-3.5 text-sm font-semibold disabled:opacity-40 active:scale-[0.98] transition"
          >
            <ArrowLeft className="h-4 w-4" /> Orqaga
          </button>
          {isLast ? (
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center justify-center gap-1 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-60 active:scale-[0.98] transition"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Saqlash
            </button>
          ) : (
            <button
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              className="flex items-center justify-center gap-1 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground active:scale-[0.98] transition"
            >
              Keyingi <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </nav>
    </MobileShell>
  );
}

const inputCls =
  "w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary transition";

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold tracking-tight">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

function Chips({
  options, value, onChange,
}: {
  options: [string, string][];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(([val, label]) => {
        const active = value === val;
        return (
          <button
            key={val}
            type="button"
            onClick={() => onChange(val)}
            className={cn(
              "rounded-full px-3.5 py-2 text-xs font-medium transition active:scale-95 border",
              active
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function MultiChips({
  options, values, onToggle,
}: {
  options: string[];
  values: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = values.includes(o);
        return (
          <button
            key={o}
            type="button"
            onClick={() => onToggle(o)}
            className={cn(
              "rounded-full px-3.5 py-2 text-xs font-medium transition active:scale-95 border",
              active
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border",
            )}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

function Toggle({
  label, value, onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex w-full items-center justify-between rounded-2xl border border-border bg-card px-4 py-3.5 text-sm active:scale-[0.99] transition"
    >
      <span className="font-medium text-left">{label}</span>
      <span
        className={cn(
          "relative h-6 w-11 rounded-full transition",
          value ? "bg-primary" : "bg-muted",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
            value ? "left-[22px]" : "left-0.5",
          )}
        />
      </span>
    </button>
  );
}
