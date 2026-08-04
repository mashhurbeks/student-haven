const KEY = "roomie_interests";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function hasInterest(id: string) {
  return read().includes(id);
}

export function sendInterest(id: string) {
  if (typeof window === "undefined") return;
  const list = read();
  if (!list.includes(id)) {
    localStorage.setItem(KEY, JSON.stringify([...list, id]));
  }
}

export function removeInterest(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(read().filter((x) => x !== id)));
}
