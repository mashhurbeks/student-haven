import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, BadgeCheck, Heart, MapPin, Share2, Wifi, Home as HomeIcon, Users } from "lucide-react";
import { useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { listings, formatSom } from "@/lib/mock-data";

export const Route = createFileRoute("/listing/$id")({
  head: ({ params }) => {
    const l = listings.find((x) => x.id === params.id);
    return {
      meta: [
        { title: l ? `${l.title} — Roomie` : "E'lon — Roomie" },
        {
          name: "description",
          content: l
            ? `${l.district}, ${l.rooms} xona, ${formatSom(l.price)} oyiga.`
            : "Kvartira tavsifi",
        },
      ],
    };
  },
  component: ListingDetail,
  notFoundComponent: () => (
    <MobileShell>
      <div className="p-10 text-center text-sm text-muted-foreground">
        E'lon topilmadi.
      </div>
    </MobileShell>
  ),
});

function ListingDetail() {
  const { id } = useParams({ from: "/listing/$id" });
  const listing = listings.find((l) => l.id === id);
  const [saved, setSaved] = useState(false);

  if (!listing) {
    return (
      <MobileShell>
        <div className="p-10 text-center">
          <p className="text-sm text-muted-foreground">E'lon topilmadi.</p>
          <Link to="/" className="mt-4 inline-block text-sm font-semibold text-primary">
            Bosh sahifaga qaytish
          </Link>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <div className="relative">
        <img
          src={listing.image}
          alt={listing.title}
          className="h-72 w-full object-cover"
        />
        <Link
          to="/"
          aria-label="Orqaga"
          className="glass absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </Link>
        <div className="absolute right-4 top-4 flex gap-2">
          <button
            type="button"
            aria-label="Ulashish"
            className="glass grid h-10 w-10 place-items-center rounded-full"
          >
            <Share2 className="h-4.5 w-4.5" />
          </button>
          <button
            type="button"
            aria-label="Saqlash"
            onClick={() => setSaved((v) => !v)}
            className="glass grid h-10 w-10 place-items-center rounded-full"
          >
            <Heart
              className={`h-4.5 w-4.5 ${saved ? "fill-destructive text-destructive" : ""}`}
            />
          </button>
        </div>
        {listing.verified && (
          <span className="absolute bottom-4 left-4 inline-flex items-center gap-1 rounded-full bg-success px-2.5 py-1 text-[11px] font-semibold text-success-foreground shadow-soft">
            <BadgeCheck className="h-3.5 w-3.5" strokeWidth={2.5} />
            Tasdiqlangan
          </span>
        )}
      </div>

      <div className="px-5 pt-5">
        <h1 className="text-xl font-bold tracking-tight">{listing.title}</h1>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {listing.district} · {listing.university} {listing.distanceMin} daq
        </p>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold">{formatSom(listing.price)}</p>
            <p className="text-[11px] text-muted-foreground">oyiga</p>
          </div>
          <div className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium">
            {listing.rooms} xona · {listing.area} m²
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-card p-3 text-center shadow-soft">
            <HomeIcon className="mx-auto h-4 w-4 text-primary" />
            <p className="mt-1 text-[11px] text-muted-foreground">Xonalar</p>
            <p className="text-sm font-semibold">{listing.rooms}</p>
          </div>
          <div className="rounded-2xl bg-card p-3 text-center shadow-soft">
            <Wifi className="mx-auto h-4 w-4 text-primary" />
            <p className="mt-1 text-[11px] text-muted-foreground">Maydon</p>
            <p className="text-sm font-semibold">{listing.area} m²</p>
          </div>
          <div className="rounded-2xl bg-card p-3 text-center shadow-soft">
            <Users className="mx-auto h-4 w-4 text-primary" />
            <p className="mt-1 text-[11px] text-muted-foreground">Kim uchun</p>
            <p className="text-sm font-semibold capitalize">
              {listing.gender === "female"
                ? "Qizlar"
                : listing.gender === "male"
                  ? "Yigitlar"
                  : "Hamma"}
            </p>
          </div>
        </div>

        <section className="mt-6">
          <h2 className="text-sm font-bold">Qulayliklar</h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {listing.amenities.map((a) => (
              <span
                key={a}
                className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary"
              >
                {a}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-sm font-bold">Tavsif</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {listing.title} — {listing.district} tumanida joylashgan qulay uy.
            {listing.university} universitetiga atigi {listing.distanceMin}{" "}
            daqiqada yetib borish mumkin. Uy toza, yorug' va zamonaviy jihozlar
            bilan ta'minlangan.
          </p>
        </section>

        <div className="sticky bottom-20 mt-6 flex gap-2 pb-4">
          <Link
            to="/chat"
            className="flex-1 rounded-2xl border border-border bg-card py-3 text-center text-sm font-semibold active:scale-[0.98] transition-transform"
          >
            Yozish
          </Link>
          <button
            type="button"
            className="flex-[1.5] rounded-2xl bg-foreground py-3 text-sm font-semibold text-background active:scale-[0.98] transition-transform"
          >
            Bron qilish
          </button>
        </div>
      </div>
    </MobileShell>
  );
}
