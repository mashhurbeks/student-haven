import type { Listing } from "@/lib/mock-data";

const KEY = "roomie_user_listings";

export function getUserListings(): Listing[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addUserListing(listing: Listing) {
  const current = getUserListings();
  const next = [listing, ...current];
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("roomie_listings_changed"));
}

export function removeUserListing(id: string) {
  const next = getUserListings().filter((l) => l.id !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("roomie_listings_changed"));
}
