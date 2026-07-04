import { BadgeCheck, Heart, MapPin } from "lucide-react";
import { useState } from "react";
import { formatSom, type Listing } from "@/lib/mock-data";

export function ListingCard({ listing }: { listing: Listing }) {
  const [saved, setSaved] = useState(false);

  return (
    <article className="group overflow-hidden rounded-3xl bg-card shadow-card transition-all active:scale-[0.98]">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <img
          src={listing.image}
          alt={listing.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {listing.verified && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-success px-2.5 py-1 text-[11px] font-semibold text-success-foreground shadow-soft">
            <BadgeCheck className="h-3.5 w-3.5" strokeWidth={2.5} />
            Tasdiqlangan
          </span>
        )}
        <button
          type="button"
          aria-label={saved ? "Saqlanganlardan olib tashlash" : "Saqlash"}
          onClick={() => setSaved((v) => !v)}
          className="glass absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full transition-transform active:scale-90"
        >
          <Heart
            className={`h-4.5 w-4.5 transition-colors ${
              saved ? "fill-destructive text-destructive" : "text-foreground"
            }`}
            strokeWidth={2}
          />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 flex-1 truncate text-[15px] font-semibold text-foreground">
            {listing.title}
          </h3>
        </div>

        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
          {listing.district} · {listing.university} {listing.distanceMin} daq
        </p>

        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-lg font-bold tracking-tight text-foreground">
              {formatSom(listing.price)}
            </p>
            <p className="text-[11px] text-muted-foreground">oyiga</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground">
            {listing.rooms} xona · {listing.area} m²
          </div>
        </div>
      </div>
    </article>
  );
}
