import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Home,
  Search,
  Users,
  MessageCircle,
  User,
  Heart,
  Bell,
  BadgeCheck,
  Sparkles,
  Mic,
  Camera,
  MapPin,
  Filter,
  ArrowLeft,
} from "lucide-react";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Yordam — Roomie" },
      { name: "description", content: "Roomie ilovasidagi har bir tugma va bo'lim nima uchun kerakligi." },
    ],
  }),
  component: HelpPage,
});

const sections = [
  {
    title: "Pastki navigatsiya",
    items: [
      { Icon: Home, name: "Bosh sahifa", desc: "Barcha yangi kvartiralar, tavsiyalar va AI xonadosh takliflari — asosiy dashboard shu yerda." },
      { Icon: Search, name: "Qidiruv (lupa)", desc: "Filtrlangan kvartira va xonadoshlarni toping — narx, universitet, tuman, jins bo'yicha." },
      { Icon: Users, name: "Xonadosh", desc: "AI moslik foizi bilan sizga eng mos talabalarni ko'ring va bog'laning." },
      { Icon: MessageCircle, name: "Chat", desc: "Uy egalari, xonadoshlar va AI yordamchi bilan real vaqt yozishmalar." },
      { Icon: User, name: "Profil", desc: "Shaxsiy ma'lumot, saqlanganlar, shartnomalar va sozlamalar." },
    ],
  },
  {
    title: "Bosh sahifa tugmalari",
    items: [
      { Icon: Bell, name: "Bildirishnoma", desc: "Yangi mos kvartiralar, xabarlar va uy egasi javoblari haqida xabar beradi." },
      { Icon: Sparkles, name: "AI Qidiruv", desc: "Tabiiy tilda so'rang: 'WIUT yaqinida 2M gacha' — AI bazadan mos e'lonlarni topadi." },
      { Icon: Mic, name: "Ovozli qidiruv", desc: "Tugmani bosib gapiring — AI ovozingizni matnga o'girib qidiradi." },
      { Icon: Camera, name: "Rasmli qidiruv", desc: "Yoqtirgan kvartira rasmini yuklang — o'xshash uylarni topamiz." },
      { Icon: Filter, name: "Filter chiplari", desc: "Tez tanlash: Tasdiqlangan, Universitet yaqin, Narx chegarasi, Faqat qizlar/yigitlar." },
    ],
  },
  {
    title: "Kvartira kartasi",
    items: [
      { Icon: BadgeCheck, name: "Tasdiqlangan belgi", desc: "Admin va AI tomonidan hujjatlari tekshirilgan e'lonlar — firibgarlikdan himoyalangan." },
      { Icon: Heart, name: "Saqlash", desc: "Kvartirani sevimlilar ro'yxatiga qo'shing, keyinroq profildan ko'ring." },
      { Icon: MapPin, name: "Manzil va masofa", desc: "Tuman va yaqin universitetgacha necha daqiqa piyoda/metroda borishni ko'rsatadi." },
    ],
  },
];

function HelpPage() {
  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto min-h-dvh max-w-[430px] px-5 pt-6 pb-12">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            aria-label="Orqaga"
            className="grid h-11 w-11 place-items-center rounded-2xl bg-card shadow-soft active:scale-95 transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-[22px] font-bold tracking-tight">Yordam</h1>
            <p className="text-xs text-muted-foreground">Har bir tugma nima uchun kerak</p>
          </div>
        </div>

        <div className="mt-8 space-y-8">
          {sections.map((sec) => (
            <section key={sec.title}>
              <h2 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {sec.title}
              </h2>
              <div className="divide-y divide-border rounded-3xl bg-card shadow-card">
                {sec.items.map(({ Icon, name, desc }) => (
                  <div key={name} className="flex gap-3 p-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{name}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
