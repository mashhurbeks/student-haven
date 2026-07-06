import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { BadgeCheck, MapPin, X, ArrowRight } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { listings, formatSom, type Listing } from "@/lib/mock-data";
import "leaflet/dist/leaflet.css";

export const Route = createFileRoute("/map")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Xarita — Roomie" },
      {
        name: "description",
        content: "Kvartiralarni xaritada narxi bilan ko'ring va tanlang.",
      },
    ],
  }),
  component: MapPage,
});

function formatShortSom(n: number) {
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return `${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}M`;
  }
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

function MapPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const [selected, setSelected] = useState<Listing | null>(null);

  const center = useMemo<[number, number]>(() => {
    const lat =
      listings.reduce((s, l) => s + l.lat, 0) / Math.max(listings.length, 1);
    const lng =
      listings.reduce((s, l) => s + l.lng, 0) / Math.max(listings.length, 1);
    return [lat || 41.3111, lng || 69.2797];
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        center,
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
      });
      mapRef.current = map;

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        { maxZoom: 19 },
      ).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      listings.forEach((listing) => {
        const html = `
          <div class="roomie-pin ${listing.verified ? "is-verified" : ""}">
            <span class="roomie-pin__price">${formatShortSom(listing.price)}</span>
            <span class="roomie-pin__tail"></span>
          </div>`;
        const icon = L.divIcon({
          html,
          className: "roomie-pin-wrapper",
          iconSize: [64, 34],
          iconAnchor: [32, 34],
        });
        const marker = L.marker([listing.lat, listing.lng], { icon }).addTo(map);
        marker.on("click", () => setSelected(listing));
      });

      if (listings.length > 1) {
        const bounds = L.latLngBounds(
          listings.map((l) => [l.lat, l.lng] as [number, number]),
        );
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center]);

  return (
    <MobileShell>
      <style>{`
        .roomie-pin-wrapper { background: transparent !important; border: 0 !important; }
        .roomie-pin {
          position: relative; display: inline-flex; align-items: center;
          padding: 6px 10px; border-radius: 999px;
          background: var(--card); color: var(--foreground);
          font-weight: 700; font-size: 12px; line-height: 1;
          box-shadow: 0 4px 12px oklch(0 0 0 / 0.18);
          border: 2px solid var(--primary);
          white-space: nowrap; transform: translateY(-4px);
          transition: transform .15s ease;
        }
        .roomie-pin:hover { transform: translateY(-6px) scale(1.04); }
        .roomie-pin.is-verified { border-color: var(--success); }
        .roomie-pin__tail {
          position: absolute; left: 50%; bottom: -6px; transform: translateX(-50%) rotate(45deg);
          width: 10px; height: 10px; background: var(--card);
          border-right: 2px solid var(--primary); border-bottom: 2px solid var(--primary);
        }
        .roomie-pin.is-verified .roomie-pin__tail {
          border-right-color: var(--success); border-bottom-color: var(--success);
        }
      `}</style>

      <header className="px-5 pt-6 pb-3">
        <h1 className="text-[22px] font-bold tracking-tight">Xarita</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Kvartiralarni narxi bilan xaritada ko'ring
        </p>
      </header>

      <div className="relative mx-5 mb-4 overflow-hidden rounded-3xl shadow-card">
        <div
          ref={containerRef}
          className="h-[calc(100vh-220px)] min-h-[420px] w-full bg-muted"
          aria-label="Kvartiralar xaritasi"
        />

        <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-card/90 px-3 py-1.5 text-[11px] font-semibold shadow-soft backdrop-blur">
          {listings.length} ta e'lon
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 px-3 pb-3"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-[430px] overflow-hidden rounded-3xl bg-card shadow-lifted"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selected.image}
                alt={selected.title}
                className="h-44 w-full object-cover"
              />
              <button
                type="button"
                aria-label="Yopish"
                onClick={() => setSelected(null)}
                className="glass absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
              {selected.verified && (
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-success px-2.5 py-1 text-[11px] font-semibold text-success-foreground shadow-soft">
                  <BadgeCheck className="h-3.5 w-3.5" strokeWidth={2.5} />
                  Tasdiqlangan
                </span>
              )}
            </div>

            <div className="p-5">
              <h2 className="text-base font-bold tracking-tight">
                {selected.title}
              </h2>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {selected.district} · {selected.university}{" "}
                {selected.distanceMin} daq
              </p>

              <div className="mt-3 flex items-end justify-between">
                <div>
                  <p className="text-xl font-bold">{formatSom(selected.price)}</p>
                  <p className="text-[11px] text-muted-foreground">oyiga</p>
                </div>
                <div className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium">
                  {selected.rooms} xona · {selected.area} m²
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {selected.amenities.map((a) => (
                  <span
                    key={a}
                    className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary"
                  >
                    {a}
                  </span>
                ))}
              </div>

              <button
                type="button"
                className="mt-4 flex w-full items-center justify-center gap-1 rounded-2xl bg-foreground py-3 text-sm font-semibold text-background active:scale-[0.98] transition-transform"
              >
                Batafsil ko'rish
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </MobileShell>
  );
}
