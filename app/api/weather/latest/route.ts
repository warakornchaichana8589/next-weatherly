import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat") || "13.75";
  const lon = searchParams.get("lon") || "100.5";
  const timezone = searchParams.get("timezone") || "Asia/Bangkok";

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=${timezone}`;

  try {
    const res = await fetch(url, { next: { revalidate: 300 } }); // ✅ cache 5 นาที

    if (!res.ok) {
      // กรณี rate limit หรือ error จาก upstream
      return NextResponse.json(
        { error: `Open-Meteo error: ${res.statusText}`, status: res.status },
        { status: res.status }
      );
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Weather API failed:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch weather data. Please try again later.",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
