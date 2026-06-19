import { NextResponse } from "next/server";

function escapeMarkdown(text: string): string {
  return text.replace(/[_*`[\]]/g, "\\$&");
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error";
}

export async function POST(request: Request) {
  try {
    const country = request.headers.get("x-vercel-ip-country") ?? "Неизвестно";
    const rawCity = request.headers.get("x-vercel-ip-city") ?? "Неизвестно";
    const userAgent = request.headers.get("user-agent") ?? "Неизвестно";

    const decodedCity = decodeURIComponent(rawCity);
    const cleanUserAgent = escapeMarkdown(userAgent);

    const telegramToken = process.env.TELEGRAM_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (!telegramToken || !telegramChatId) {
      console.error(
        "Ошибка: На Vercel не настроены TELEGRAM_TOKEN или TELEGRAM_CHAT_ID",
      );
      return NextResponse.json(
        { success: false, error: "Конфигурация отсутствует" },
        { status: 500 },
      );
    }

    const message = `🔔 *Новый посетитель на сайте!*

📍 *Локация:* ${decodedCity}, ${country}
📱 *Устройство:* ${cleanUserAgent}`;

    const telegramUrl = `https://api.telegram.org/bot${telegramToken}/sendMessage`;

    const telegramResponse = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    if (!telegramResponse.ok) {
      const body = await telegramResponse.text();
      console.error("Telegram API error:", telegramResponse.status, body);
      return NextResponse.json(
        { success: false, error: "Telegram API request failed" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Ошибка в API визитов:", error);
    return NextResponse.json(
      { success: false, error: errorMessage(error) },
      { status: 500 },
    );
  }
}
