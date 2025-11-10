"use client";
import WeatherIcon from "@/components/WeatherIcon";
import { LocationType, LatestResponse } from "@/type/weather";
import { WEATHER_GROUPS } from "@/lib/weather"

export default function WeatherCard({ latest, loc }: { latest: LatestResponse; loc: LocationType }) {
  function formatWeatherTime(isoString: string, timezone: string) {
    const safeZone = timezone && timezone !== "Unknown" ? timezone : "Asia/Bangkok";
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",  // Monday
      month: "short",   // Nov
      day: "numeric",   // 10
      hour: "2-digit",  // 05 PM
      minute: "2-digit",
      timeZone: safeZone, // ใช้ timezone จาก API
    }).format(date);
  }

  const { temperature, weathercode, windspeed, humidity, rain } = latest.current_weather;


  if (!latest?.current_weather?.time) return null;
  const displayTime = formatWeatherTime(
    latest.current_weather.time,
    latest.timezone
  );
  console.log(latest)
  return (
    <div className="rounded-3xl border border-white/50 bg-gradient-to-br from-sky-100/90 via-white/80 to-emerald-100/80 p-6 shadow-2xl">
      <div className="flex items-center gap-4">
        <div className="rounded-2xl bg-white/80 p-4 text-sky-600 shadow-inner">
          <WeatherIcon weatherCode={weathercode ?? 0} />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-2xl uppercase tracking-wide text-gray-900 font-medium">{loc.name}</p>
          <p className="-mt-3 text-slate-600">{displayTime}</p>
          <p className="text-4xl font-semibold">{temperature.toFixed(1)}°C</p>
          <div className="flex gap-4 gap-y-0 flex-wrap">
            <p className="text-sm text-gray-500">Wind: <span className="font-medium text-2xl">{windspeed.toFixed(1)}</span> m/s</p>
            <p className="text-sm text-gray-500">Rain: <span className="font-medium text-2xl">{rain}</span> %</p>
             <p className="text-sm text-gray-500">Humidity: <span className="font-medium text-2xl">{humidity}</span> mm</p>
          </div>

          <p className="ext-2xl uppercase tracking-wide text-gray-900 font-medium">{WEATHER_GROUPS[weathercode as number]}</p>
        </div>
      </div>
    </div>
  );
}
