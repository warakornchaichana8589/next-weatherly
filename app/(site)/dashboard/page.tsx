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

        // current basics
        const temp = latest.current_weather.temperature;
        const wind = latest.current_weather.windspeed;
        const condCode = latest.current_weather.weathercode;

        // humidity & rain ดึงค่าชั่วโมงล่าสุด
        const idx = hourly.hourly.time.length - 1;
        const humidity = idx >= 0 ? hourly.hourly.relative_humidity_2m[idx] : null;
        const rain = idx >= 0 ? hourly.hourly.precipitation[idx] : null;

        return (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <CardStat label="Temp (°C)" value={temp?.toFixed?.(1) ?? "-"} />
                <CardStat label="Humidity (%)" value={humidity ?? "-"} />
                <CardStat label="Wind" value={wind ?? "-"} />
                <CardStat label="Rain (mm)" value={rain ?? "-"} />
                <CardStat label="Condition" value={condCode ?? "-"} />
            </div>
        );
    }, [latest]);
    return (
        <section className="min-h-screen bg-dark-white-text pt-20" data-aos="fade-up">
            <div className="container p-5 mx-auto">

                <h1 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">Dashboard — {loc.name}</h1>

                {loading && <div className="text-sm opacity-70">Loading weather…</div>}
                {err && <div className="text-sm text-red-600">Error: {err}</div>}

                {latestCard}
            </div>
        </section>
    )
    function CardStat({ label, value }: { label: string; value: string | number | null }) {
        return (
            <div className="rounded-2xl border p-4 shadow-sm">
                <div className="text-xs opacity-70">{label}</div>
                <div className="text-xl font-semibold">{value ?? "-"}</div>
            </div>
        );
    }
};
