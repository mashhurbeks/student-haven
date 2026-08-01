import apt1 from "@/assets/apt-1.jpg";
import apt2 from "@/assets/apt-2.jpg";
import apt3 from "@/assets/apt-3.jpg";
import rm1 from "@/assets/roommate-1.jpg";
import rm2 from "@/assets/roommate-2.jpg";

export type Listing = {
  id: string;
  title: string;
  image: string;
  price: number;
  rooms: number;
  area: number;
  district: string;
  university: string;
  distanceMin: number;
  verified: boolean;
  gender?: "male" | "female" | "any";
  amenities: string[];
  lat: number;
  lng: number;
};

export type Roommate = {
  id: string;
  name: string;
  age: number;
  university: string;
  image: string;
  match: number;
  bio: string;
  tags: string[];
  course?: string;
  district?: string;
  budget?: number;
  verified?: boolean;
  gender?: "male" | "female";
  languages?: string[];
  lifestyle?: { label: string; value: string }[];
  habits?: { label: string; ok: boolean }[];
  matchReasons?: string[];
};

export const listings: Listing[] = [
  {
    id: "1",
    title: "Yorug' 2 xonali kvartira",
    image: apt1,
    price: 2500000,
    rooms: 2,
    area: 56,
    district: "Yunusobod",
    university: "WIUT",
    distanceMin: 8,
    verified: true,
    gender: "any",
    amenities: ["WiFi", "Kir mashina", "Konditsioner", "Mebel"],
    lat: 41.3626,
    lng: 69.2891,
  },
  {
    id: "2",
    title: "Qulay studio, faqat qizlar uchun",
    image: apt2,
    price: 1800000,
    rooms: 1,
    area: 32,
    district: "Mirzo Ulug'bek",
    university: "INHA",
    distanceMin: 5,
    verified: true,
    gender: "female",
    amenities: ["WiFi", "Konditsioner", "Yangi remont"],
    lat: 41.3378,
    lng: 69.2854,
  },
  {
    id: "3",
    title: "Zamonaviy 3 xonali, metro yaqinida",
    image: apt3,
    price: 3200000,
    rooms: 3,
    area: 78,
    district: "Chilonzor",
    university: "TIU",
    distanceMin: 12,
    verified: false,
    gender: "male",
    amenities: ["WiFi", "Parking", "Lift", "Kir mashina"],
    lat: 41.2856,
    lng: 69.2034,
  },
];

export const roommates: Roommate[] = [
  {
    id: "r1",
    name: "Doniyor",
    age: 20,
    university: "INHA",
    image: rm1,
    match: 94,
    bio: "Erta uxlab, erta turaman. Tinch va toza yashashni yoqtiraman. IT yo'nalishida o'qiyman, kunning ko'p qismi darsda va loyihalar ustida o'tadi.",
    tags: ["Chekmaydi", "Tinch", "Toza"],
    course: "2-kurs",
    district: "Mirzo Ulug'bek",
    budget: 2000000,
    verified: true,
    gender: "male",
    languages: ["O'zbek", "Ingliz", "Rus"],
    lifestyle: [
      { label: "Uyqu rejimi", value: "23:00 — 07:00" },
      { label: "Tozalik", value: "Juda tartibli" },
      { label: "Mehmonlar", value: "Kamdan-kam" },
      { label: "Ovqat", value: "O'zim pishiraman" },
    ],
    habits: [
      { label: "Chekmaydi", ok: true },
      { label: "Ichmaydi", ok: true },
      { label: "Uy hayvoni yo'q", ok: true },
      { label: "Kech uyg'oq qolmaydi", ok: true },
    ],
    matchReasons: [
      "Ikkalangiz ham erta uxlaysiz",
      "Tozalik darajangiz bir xil",
      "Byudjetlaringiz mos keladi",
    ],
  },
  {
    id: "r2",
    name: "Nozima",
    age: 19,
    university: "WIUT",
    image: rm2,
    match: 87,
    bio: "Kutubxonada ko'p vaqt o'tkazaman. Kechqurun kitob o'qishni yaxshi ko'raman. Tinch, hurmatli xonadosh qidiryapman.",
    tags: ["Kitobxon", "Vegetarian", "Sport"],
    course: "1-kurs",
    district: "Yunusobod",
    budget: 1700000,
    verified: true,
    gender: "female",
    languages: ["O'zbek", "Ingliz"],
    lifestyle: [
      { label: "Uyqu rejimi", value: "00:00 — 08:00" },
      { label: "Tozalik", value: "Tartibli" },
      { label: "Mehmonlar", value: "Ba'zan" },
      { label: "Ovqat", value: "Vegetarian" },
    ],
    habits: [
      { label: "Chekmaydi", ok: true },
      { label: "Ichmaydi", ok: true },
      { label: "Uy hayvoni bor", ok: false },
      { label: "Sport bilan shug'ullanadi", ok: true },
    ],
    matchReasons: [
      "Ikkalangiz ham tinchlikni qadrlaysiz",
      "Universitetlaringiz yaqin",
      "O'xshash kunlik tartib",
    ],
  },
];

export const formatSom = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm";
