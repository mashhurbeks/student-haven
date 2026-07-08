import { useEffect, useState } from "react";
import { listings as mockListings, type Listing } from "@/lib/mock-data";
import { getUserListings } from "@/lib/user-listings";

export function useAllListings(): Listing[] {
  const [userListings, setUserListings] = useState<Listing[]>([]);

  useEffect(() => {
    const sync = () => setUserListings(getUserListings());
    sync();
    window.addEventListener("roomie_listings_changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("roomie_listings_changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return [...userListings, ...mockListings];
}
