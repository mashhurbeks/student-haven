import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Upload, Home as HomeIcon } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { addUserListing } from "@/lib/user-listings";
import { toast } from "sonner";
import apt1 from "@/assets/apt-1.jpg";
import apt2 from "@/assets/apt-2.jpg";
import apt3 from "@/assets/apt-3.jpg";

export const Route = createFileRoute("/add-listing")({
  head: () => ({
    meta: [
      { title: "Kvartira qo'shish — Roomie" },
      { name: "description", content: "O'z kvartirangizni ijaraga qo'ying." },
    ],
  }),
  component: AddListingPage,
});

const fallbackImages = [apt1, apt2, apt3];
const universities = ["WIUT", "INHA", "TIU", "TATU", "UzMU", "Boshqa"];
const districts = ["Yunusobod", "Mirzo Ulug'bek", "Chilonzor", "Yakkasaroy", "Shayxontohur", "Sergeli", "Yashnobod", "Olmazor"];
const amenityOptions = ["WiFi", "Kir mashina", "Konditsioner", "Mebel", "Yangi remont", "Lift", "Parking", "Muzlatgich"];

function AddListingPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [rooms, setRooms] = useState("1");
  const [area, setArea] = useState("");
  const [district, setDistrict] = useState(districts[0]);
  const [university, setUniversity] = useState(universities[0]);
  const [distanceMin, setDistanceMin] = useState("");
  const [gender, setGender] = useState<"any" | "male" | "female">("any");
  const [amenities, setAmenities] = useState<string[]>(["WiFi"]);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const toggleAmenity = (a: string) =>
    setAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  const onFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setImageUrl(String(reader.result));
    reader.readAsDataURL(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price || !area) {
      toast.error("Sarlavha, narx va maydonni to'ldiring");
      return;
    }
    setSubmitting(true);

    // Toshkent center jitter for map placement
    const lat = 41.311 + (Math.random() - 0.5) * 0.08;
    const lng = 69.279 + (Math.random() - 0.5) * 0.08;

    addUserListing({
      id: `u_${Date.now()}`,
      title: title.trim(),
      image: imageUrl || fallbackImages[Math.floor(Math.random() * fallbackImages.length)],
      price: Number(price),
      rooms: Number(rooms),
      area: Number(area),
      district,
      university,
      distanceMin: Number(distanceMin) || 10,
      verified: false,
      gender,
      amenities,
      lat,
      lng,
    });

    toast.success("E'lon qo'shildi!");
    navigate({ to: "/" });
  };

  return (
    <MobileShell>
      <header className="flex items-center gap-3 px-5 pt-6 pb-2">
        <Link
          to="/profile"
          aria-label="Orqaga"
          className="grid h-10 w-10 place-items-center rounded-2xl bg-card shadow-soft active:scale-95 transition-transform"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="min-w-0">
          <h1 className="text-[20px] font-bold tracking-tight">Kvartira qo'shish</h1>
          <p className="text-xs text-muted-foreground">Ijaraga beriladigan xonangizni e'lon qiling</p>
        </div>
      </header>

      <form onSubmit={submit} className="px-5 pt-4 pb-8 space-y-5">
        {/* Image */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Rasm
          </label>
          <label className="relative flex aspect-[4/3] w-full cursor-pointer items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-border bg-card">
            {imageUrl ? (
              <img src={imageUrl} alt="preview" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="h-6 w-6" />
                <span className="text-sm font-medium">Rasm yuklash</span>
                <span className="text-xs">(ixtiyoriy)</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
            />
          </label>
        </div>

        <Field label="Sarlavha">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Yorug' 2 xonali kvartira"
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-soft outline-none focus:ring-2 focus:ring-primary/30"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Narx (so'm/oy)">
            <input
              type="number"
              inputMode="numeric"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="2500000"
              className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-soft outline-none focus:ring-2 focus:ring-primary/30"
            />
          </Field>
          <Field label="Maydon (m²)">
            <input
              type="number"
              inputMode="numeric"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="56"
              className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-soft outline-none focus:ring-2 focus:ring-primary/30"
            />
          </Field>
        </div>

        <Field label="Xonalar soni">
          <div className="flex gap-2">
            {["1", "2", "3", "4+"].map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setRooms(r === "4+" ? "4" : r)}
                className={`flex-1 rounded-2xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
                  (rooms === r || (r === "4+" && Number(rooms) >= 4))
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Tuman">
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-soft outline-none focus:ring-2 focus:ring-primary/30"
            >
              {districts.map((d) => <option key={d}>{d}</option>)}
            </select>
          </Field>
          <Field label="Universitet">
            <select
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-soft outline-none focus:ring-2 focus:ring-primary/30"
            >
              {universities.map((u) => <option key={u}>{u}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Universitetgacha (daqiqa)">
          <input
            type="number"
            inputMode="numeric"
            value={distanceMin}
            onChange={(e) => setDistanceMin(e.target.value)}
            placeholder="10"
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-soft outline-none focus:ring-2 focus:ring-primary/30"
          />
        </Field>

        <Field label="Kimlar uchun">
          <div className="flex gap-2">
            {(["any", "female", "male"] as const).map((g) => (
              <button
                type="button"
                key={g}
                onClick={() => setGender(g)}
                className={`flex-1 rounded-2xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
                  gender === g ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
                }`}
              >
                {g === "any" ? "Hammaga" : g === "female" ? "Qizlar" : "Yigitlar"}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Qulayliklar">
          <div className="flex flex-wrap gap-2">
            {amenityOptions.map((a) => {
              const on = amenities.includes(a);
              return (
                <button
                  type="button"
                  key={a}
                  onClick={() => toggleAmenity(a)}
                  className={`rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${
                    on ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground"
                  }`}
                >
                  {a}
                </button>
              );
            })}
          </div>
        </Field>

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground py-4 text-sm font-semibold text-background active:scale-[0.98] transition-transform disabled:opacity-60"
        >
          <HomeIcon className="h-4 w-4" />
          E'lonni joylashtirish
        </button>
      </form>
    </MobileShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
