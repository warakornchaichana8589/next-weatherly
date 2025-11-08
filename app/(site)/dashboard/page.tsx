"use client"
import { useEffect, useState, useMemo } from "react";
import { fetcher } from "@/lib/fetcher";

import { LatestResponse, HourlyResponse } from "@/type/weather";
import { lastNDaysRangeInTZ } from "@/lib/time";

import { toast } from "react-toastify";
import AOS from "aos";
import "aos/dist/aos.css";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend } from "chart.js";
import "chart.js/auto";
import WeatherIcon from "@/components/WeatherIcon";
import WeatherCardSkeleton from "@/components/Card/WeatherCardSkeleton";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);
type Location = {
    name: string;
    lat: number;
    lon: number;
    timezone: string;
};
// ตัวอย่างค่าเริ่มต้น /locations
const DEFAULT_LOCATION: Location = {
    name: "Bangkok",
    lat: 13.75,
    lon: 100.5,
    timezone: "Asia/Bangkok",
};
const WEATHER_DESCRIPTIONS: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Fog",
    51: "Light drizzle",
    53: "Drizzle",
    55: "Heavy drizzle",
    61: "Light rain",
    63: "Rain",
    65: "Heavy rain",
    80: "Rain showers",
    81: "Rain showers",
    82: "Heavy showers",
    95: "Thunderstorm",
    96: "Thunderstorm",
    99: "Thunderstorm",
};
type StatChipProps = {
    label: string;
    value: string;
    helper?: string;
};
function StatChip({ label, value, helper }: StatChipProps) {
    return (
        <div className="rounded-2xl border border-white/40 bg-white/70 p-4 text-gray-800 shadow-md shadow-gray-200 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60 dark:text-gray-100">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-xl font-semibold">{value}</p>
            {helper ? <p className="text-[11px] text-gray-500 dark:text-gray-400">{helper}</p> : null}
        </div>
    );
}
export default function Dashboard() {
    //location
    const [loc, setLoc] = useState<Location>(DEFAULT_LOCATION);
    const [latest, setLatest] = useState<LatestResponse | null>(null);
    const [hourly, setHourly] = useState<HourlyResponse | null>(null);

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    useEffect(() => {
        AOS.init({
            duration: 1200,
        });

    }, []);
    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                setLoading(true);
                setErr(null);
                const { start, end } = lastNDaysRangeInTZ(7, loc.timezone);
                const [latestRes, hourlyRes] = await Promise.all([
                    fetcher<LatestResponse>(`/api/weather/latest?lat=${loc.lat}&lon=${loc.lon}&timezone=${loc.timezone}`),
                    fetcher<HourlyResponse>(`/api/weather/hourly?lat=${loc.lat}&lon=${loc.lon}&from=${start}&to=${end}&timezone=${loc.timezone}&includeWind=1`),
                ]);
                // console.log(latestRes)
                if (!mounted) return;
                setLatest(latestRes);
                setHourly(hourlyRes);
            } catch (e: any) {
                if (!mounted) return;
                setErr(e?.message ?? "Failed to load dashboard");
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => {
            mounted = false;
        };
    }, [loc]);

    const latestCard = useMemo(() => {
        if (!latest || !hourly) return null;

        const { temperature, windspeed, weathercode, time } = latest.current_weather;
        const latestIdx = time ? hourly.hourly.time.findIndex((t) => t === time) : -1;
        const fallbackIdx = hourly.hourly.time.length - 1;
        const idx = latestIdx >= 0 ? latestIdx : fallbackIdx;
        const humidity = idx >= 0 ? hourly.hourly.relative_humidity_2m[idx] : null;
        const rain = idx >= 0 ? hourly.hourly.precipitation[idx] : null;

        const conditionLabel = typeof weathercode === "number"
            ? WEATHER_DESCRIPTIONS[weathercode] ?? `Code ${weathercode}`
            : "Unknown condition";

        const formattedTemp = typeof temperature === "number" ? `${temperature.toFixed(1)}°C` : "-";
        const formattedWind = typeof windspeed === "number" ? `${windspeed.toFixed(1)} m/s` : "-";
        const formattedHumidity = typeof humidity === "number" ? `${Math.round(humidity)}%` : "-";
        const formattedRain = typeof rain === "number" ? `${rain.toFixed(1)} mm` : "-";

        const displayTime = time
            ? new Intl.DateTimeFormat(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
                timeZone: loc.timezone,
            }).format(new Date(time))
            : "-";
        const isDay = (() => {
            if (!time) return true;
            const hours = new Date(time).getUTCHours();
            return hours >= 6 && hours < 18;
        })();

        const statItems = [
            { label: "Humidity", value: formattedHumidity },
            { label: "Wind", value: formattedWind, helper: "10 m reference" },
            { label: "Rain (last hr)", value: formattedRain },
            { label: "Condition", value: conditionLabel },
        ];
        if (loading) return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <WeatherCardSkeleton />;
            </div>

        )
        return (
            <div className="w-full" data-aos="fade-up">
                <div className="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            lg:grid-cols-3
                            2xl:grid-cols-4
                            gap-6
                            ">

                    <div className="flex flex-col gap-6 md:items-center aspect-square rounded-3xl border border-white/50 bg-linear-to-br  from-sky-100/90 via-white/80 to-emerald-100/80 p-6 shadow-2xl shadow-sky-100/60 backdrop-blur-md dark:border-slate-800 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-800">
                        <div className="flex flex-1 items-center gap-4">
                            <div className="rounded-2xl bg-white/80 p-4 text-sky-600 shadow-inner dark:bg-slate-800/70 dark:text-sky-300">
                                <WeatherIcon weatherCode={weathercode ?? 0} isDay={isDay} />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Latest in {loc.name}</p>
                                <p className="text-4xl font-semibold text-gray-900 dark:text-white">{formattedTemp}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{conditionLabel} - {displayTime}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {statItems.map((stat) => (
                                <StatChip key={stat.label} label={stat.label} value={stat.value} helper={stat.helper} />
                            ))}
                        </div>

                    </div>
                    <div className="flex flex-col gap-6 md:items-center aspect-square rounded-3xl border border-white/50 bg-linear-to-br  from-sky-100/90 via-white/80 to-emerald-100/80 p-6 shadow-2xl shadow-sky-100/60 backdrop-blur-md dark:border-slate-800 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-800">
                        <div className="flex flex-1 items-center gap-4">
                            <div className="rounded-2xl bg-white/80 p-4 text-sky-600 shadow-inner dark:bg-slate-800/70 dark:text-sky-300">
                                <WeatherIcon weatherCode={weathercode ?? 0} isDay={isDay} />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Latest in {loc.name}</p>
                                <p className="text-4xl font-semibold text-gray-900 dark:text-white">{formattedTemp}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{conditionLabel} - {displayTime}</p>
                            </div>
                        </div>
                        <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-4">
                            {statItems.map((stat) => (
                                <StatChip key={stat.label} label={stat.label} value={stat.value} helper={stat.helper} />
                            ))}
                        </div>

                    </div>
                    <div className="flex flex-col gap-6 md:items-center aspect-square rounded-3xl border border-white/50 bg-linear-to-br  from-sky-100/90 via-white/80 to-emerald-100/80 p-6 shadow-2xl shadow-sky-100/60 backdrop-blur-md dark:border-slate-800 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-800">
                        <div className="flex flex-1 items-center gap-4">
                            <div className="rounded-2xl bg-white/80 p-4 text-sky-600 shadow-inner dark:bg-slate-800/70 dark:text-sky-300">
                                <WeatherIcon weatherCode={weathercode ?? 0} isDay={isDay} />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Latest in {loc.name}</p>
                                <p className="text-4xl font-semibold text-gray-900 dark:text-white">{formattedTemp}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{conditionLabel} - {displayTime}</p>
                            </div>
                        </div>
                        <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-4">
                            {statItems.map((stat) => (
                                <StatChip key={stat.label} label={stat.label} value={stat.value} helper={stat.helper} />
                            ))}
                        </div>

                    </div>
                    <div className="flex flex-col gap-6 md:items-center aspect-square rounded-3xl border border-white/50 bg-linear-to-br  from-sky-100/90 via-white/80 to-emerald-100/80 p-6 shadow-2xl shadow-sky-100/60 backdrop-blur-md dark:border-slate-800 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-800">
                        <div className="flex flex-1 items-center gap-4">
                            <div className="rounded-2xl bg-white/80 p-4 text-sky-600 shadow-inner dark:bg-slate-800/70 dark:text-sky-300">
                                <WeatherIcon weatherCode={weathercode ?? 0} isDay={isDay} />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Latest in {loc.name}</p>
                                <p className="text-4xl font-semibold text-gray-900 dark:text-white">{formattedTemp}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{conditionLabel} - {displayTime}</p>
                            </div>
                        </div>
                        <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-4">
                            {statItems.map((stat) => (
                                <StatChip key={stat.label} label={stat.label} value={stat.value} helper={stat.helper} />
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        );
    }, [hourly, latest, loc]);

    return (
        <section className="min-h-screen bg-dark-white-text pt-20" data-aos="fade-up">
            <div className="container p-5 mx-auto w-full space-y-6">
                {loading && <div className="text-sm opacity-70">Loading weather…</div>}
                {err && <div className="text-sm text-red-600">Error: {err}</div>}
                {latestCard}
            </div>
        </section>
    )

};
