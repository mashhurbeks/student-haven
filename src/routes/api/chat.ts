import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

type ChatRequestBody = {
  messages?: unknown;
  context?: unknown;
};

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages, context } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        const gateway = createLovableAiGatewayProvider(key);

        const system = [
          "Sen — Rumi AI, Roomie ilovasining yordamchisisan. O'zbek tilida, qisqa va do'stona javob ber.",
          "Vazifang: talabalarning ehtiyoj va xohishlarini (byudjet, universitet, tuman, turmush tarzi, odatlar) tahlil qilib, ularga mos kvartiralarni tavsiya qilish.",
          "Foydalanuvchi xonadosh ismini yoki ID/username (masalan r1, @doniyor) yozsa, o'sha xonadosh profilini kontekstdan topib, ikkalasining ehtiyojlarini birlashtir (umumiy byudjet, universitetlarga masofa, tozalik, uyqu rejimi) va eng mos kvartiralarni tartib bilan tavsiya et.",
          "Har bir tavsifda: kvartira nomi, narxi, tumani, universitetgacha masofasi va NEGA mosligini 1-2 gapda tushuntir.",
          "Ma'lumot yetmasa, aniqlovchi savol ber. Kontekstda bo'lmagan kvartira yoki odamni o'ylab topma.",
          "Javoblarni markdown ro'yxatlar bilan bez.",
          "",
          "KONTEKST (JSON):",
          JSON.stringify(context ?? {}),
        ].join("\n");

        const result = streamText({
          model: gateway("google/gemini-3.6-flash"),
          system,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
