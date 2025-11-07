import { saveWeather, getWeather } from "@/lib/db";
import { fetcher } from "@/lib/fetcher";

export async function getWeatherOfflineFirst(locationId: string) {
  try {
    // ดึงข้อมูลจาก API ก่อน
    const data = await fetcher(`/api/weather/latest?location_id=${locationId}`);
    await saveWeather(locationId, data); // cache
    return data;
  } catch (err) {
    console.warn("⚠️ offline mode, loading from cache");
    // ถ้า offline โหลดจาก cache แทน
    const cached = await getWeather(locationId);
    if (cached) return cached.data;
    throw new Error("No cached data available");
  }
}
