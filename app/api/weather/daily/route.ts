import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat") || "13.75";
  const lon = searchParams.get("lon") || "100.5";
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const timezone = searchParams.get("timezone") || "Asia/Bangkok";

  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", lat);
  url.searchParams.set("longitude", lon);
  url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min,precipitation_sum");
  url.searchParams.set("timezone", timezone);
  if (from) url.searchParams.set("start_date", from);
  if (to) url.searchParams.set("end_date", to);

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } }); // ✅ cache 1 ชั่วโมง
    if (!res.ok) {
      return NextResponse.json(
        { error: `Open-Meteo error: ${res.statusText}`, status: res.status },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Daily Weather API failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily weather data", details: (error as Error).message },
      { status: 500 }
    );
  }
}
