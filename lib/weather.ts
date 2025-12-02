import { saveWeather, getWeather } from "@/lib/db";
import { fetcher } from "@/lib/fetcher";
import { LatestResponse } from "@/type/weather"
const MAX_CACHE_AGE = 30 * 60 * 1000; // 30 minutes

export async function getWeatherOfflineFirst(locationId: string) {
  const cached = await getWeather(locationId);
  if (cached) {
    const isStale = Date.now() - cached.updatedAt > MAX_CACHE_AGE;
    if (!isStale) return cached.data;
    void fetchAndUpdate(locationId);
    return cached.data;
  }
  return fetchAndUpdate(locationId);
}

async function fetchAndUpdate(locationId: string) {
  try {
    const getDataLocation = await getWeather<LatestResponse>(locationId);
    if (getDataLocation) {
      const { latitude, longitude } = getDataLocation.data;
      const data = await fetcher(`/api/weather/latest?lat=${latitude}&lon=${longitude}`);
      await saveWeather(locationId, data);
      return data;
    }

  } catch (error) {
    console.warn("Offline mode, cannot fetch new data", error);
    const cached = await getWeather(locationId);
    if (cached) return cached.data;
    throw new Error("No cached data available");
  }
}

export const WEATHER_GROUPS: Record<number, string> = {
  0: "clear",
  1: "clear",
  2: "partly-cloudy",
  3: "cloudy",
  45: "fog",
  48: "fog",
  51: "drizzle",
  53: "drizzle",
  55: "drizzle",
  61: "rain",
  63: "rain",
  65: "rain",
  80: "rain-showers",
  81: "rain-showers",
  82: "rain-showers",
  95: "thunderstorm",
  96: "thunderstorm",
  99: "thunderstorm",
};