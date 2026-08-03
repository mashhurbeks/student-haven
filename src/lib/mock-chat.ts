import { roommates } from "./mock-data";

export type ChatMessage = {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
};

export type Thread = {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  last: string;
  time: string;
  unread: number;
  online?: boolean;
  messages: ChatMessage[];
};

export const threads: Thread[] = [
  {
    id: "t1",
    name: "Aziz aka",
    subtitle: "Uy egasi · Yunusobod",
    image: roommates[1]?.image ?? roommates[0].image,
    last: "Ertaga soat 15:00 da uchrasholmizmi?",
    time: "12:04",
    unread: 2,
    online: true,
    messages: [
      { id: "m1", from: "them", text: "Assalomu alaykum! E'lonim bo'yicha yozdingizmi?", time: "11:52" },
      { id: "m2", from: "me", text: "Va alaykum assalom. Ha, 2 xonali kvartira hali bo'shmi?", time: "11:55" },
      { id: "m3", from: "them", text: "Ha, bo'sh. Oyiga 2 500 000 so'm, kommunal alohida.", time: "11:58" },
      { id: "m4", from: "me", text: "Yaxshi. Ko'rgani borsam bo'ladimi?", time: "12:02" },
      { id: "m5", from: "them", text: "Ertaga soat 15:00 da uchrasholmizmi?", time: "12:04" },
    ],
  },
  {
    id: "t2",
    name: "Doniyor",
    subtitle: "Xonadosh · 94% mos",
    image: roommates[0].image,
    last: "Salom! Xonadosh haqida gaplasha olamizmi?",
    time: "Kecha",
    unread: 0,
    messages: [
      { id: "m1", from: "them", text: "Salom! Xonadosh haqida gaplasha olamizmi?", time: "21:14" },
      { id: "m2", from: "me", text: "Salom! Albatta. Qaysi tumanni qidiryapsan?", time: "21:20" },
      { id: "m3", from: "them", text: "INHA yaqinida, 2 mln atrofida bo'lsa yaxshi bo'lardi.", time: "21:22" },
    ],
  },
  {
    id: "t3",
    name: "Malika",
    subtitle: "Xonadosh · 88% mos",
    image: roommates[1]?.image ?? roommates[0].image,
    last: "Kvartirani ko'rdim, juda yoqdi 😊",
    time: "Dush",
    unread: 0,
    messages: [
      { id: "m1", from: "me", text: "Salom! WIUT yaqinidagi kvartirani ko'rdingmi?", time: "18:02" },
      { id: "m2", from: "them", text: "Kvartirani ko'rdim, juda yoqdi 😊", time: "18:40" },
    ],
  },
];

export type Notification = {
  id: string;
  kind: "match" | "message" | "listing" | "system";
  title: string;
  body: string;
  time: string;
  unread: boolean;
};

export const notifications: Notification[] = [
  {
    id: "n1",
    kind: "match",
    title: "Yangi moslik: Doniyor",
    body: "Sizga 94% mos keladigan xonadosh topildi.",
    time: "5 daqiqa oldin",
    unread: true,
  },
  {
    id: "n2",
    kind: "message",
    title: "Aziz aka yozdi",
    body: "Ertaga soat 15:00 da uchrasholmizmi?",
    time: "12:04",
    unread: true,
  },
  {
    id: "n3",
    kind: "listing",
    title: "Saqlangan kvartira arzonlashdi",
    body: "Yunusobod, 2 xonali — 2 700 000 → 2 500 000 so'm.",
    time: "Kecha",
    unread: false,
  },
  {
    id: "n4",
    kind: "system",
    title: "Profilingiz tasdiqlandi",
    body: "Talaba guvohnomangiz muvaffaqiyatli tekshirildi.",
    time: "2 kun oldin",
    unread: false,
  },
];
