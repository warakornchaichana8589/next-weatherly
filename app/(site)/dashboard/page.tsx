"use client";

import { useEffect, useMemo } from "react";
import { useLocationStore } from "@/store/locationStore";
import WeatherCard from "@/components/WeatherCard";
import type { LatestResponse, LocationWeather } from "@/type/weather";
import { toast } from "react-toastify";
import AOS from "aos";
import "aos/dist/aos.css";
import CitySearchInput from "@/components/CitySearchInput"
import Link from 'next/link'
import { createMockLocationWeather } from "@/lib/mockWeather";

function buildMockLatest(loc: LocationWeather): LatestResponse {
  const temperature = 24 + (loc.lat % 6) + (loc.lon % 4);
  const windspeed = 2 + (Math.abs(loc.lon) % 5);
  const weathercode = Math.abs(Math.round(loc.lat + loc.lon + loc.id)) % 4;
  const humidity = 50 + Math.round((loc.lat + loc.lon) % 50); 
  const rain = Math.max(0, Math.round((loc.lat + loc.lon) % 10 - 2));
  return {
    latitude: loc.lat,
    longitude: loc.lon,
    timezone: loc.timezone,
    current_weather: {
      temperature: Number(temperature.toFixed(1)),
      windspeed: Number(windspeed.toFixed(1)),
      weathercode,
      humidity,
      rain,
      time: new Date().toISOString(),
    },
  };
}

export default function Dashboard() {
  const selected = useLocationStore((state) => state.selected);
  const locations = useLocationStore((state) => state.locations);
  const fetchLocations = useLocationStore((state) => state.fetchLocations);
  const toggleFollow = useLocationStore((state) => state.toggleFollow);
  const setSelected = useLocationStore((state) => state.setSelected);
  const upsert = useLocationStore((state) => state.upsert);
  const loading = useLocationStore((state) => state.loading);

  useEffect(() => {
    if (loading || locations.length) return;
    fetchLocations();
  }, [fetchLocations, loading, locations.length]);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const latestMock = useMemo(() => (selected ? buildMockLatest(selected) : null), [selected]);
  const followedLocations = useMemo(
    () => locations.filter((loc) => loc.isFollowed),
    [locations],
  );

  if (!selected || !latestMock) {
    return <p className="p-8 text-sm text-slate-500 text-center">Loading locations...</p>;
  }

  return (
    <section className="min-h-screen space-y-8 bg-gray-50 p-8 pt-20 dark:bg-slate-900" data-aos="fade-up">
      <div className="mx-auto container">

        <div className="flex flex-col w-full gap-6">
          <div className="w-full max-w-4xl mx-auto">
            <CitySearchInput
              onSelect={(city) => {
                                const newLoc = createMockLocationWeather({
                  id: Date.now(),
                  name: city.name,
                  lat: city.lat,
                  lon: city.lon,
                  timezone: city.timezone || "Asia/Bangkok",
                  isFollowed: true,
                });
                // ✅ เพิ่มเข้า store และเลือกเป็นเมืองปัจจุบัน
                upsert(newLoc);
                setSelected(newLoc);

                toast.success(`Switched to ${city.name}`);
              }}
            />
          </div>
          <h1 className="text-xl font-semibold dark:text-white">Overview • {selected.name}</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <WeatherCard latest={latestMock} loc={selected} />
            <div className=""></div>
          </div>
        </div>

        {followedLocations.length > 0 && (
          <section className="space-y-3 w-full pt-5 sm:pt-10">
            <div className="flex flex-col sm:flex-row items-center justify-between w-full">
              <div className="flex items-center justify-start gap-4 w-full">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Followed cities</h2>
                <p className="text-xs uppercase tracking-wide text-slate-400">{followedLocations.length} total</p>
              </div>
              <div className="flex w-full items-center justify-between sm:justify-end gap-2">
                <Link
                  href="/locations"
                  className="rounded-md bg-slate-700 px-3 py-1 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white"
                >
                  Add city
                </Link>
                <Link
                  href="/compare"
                  className="rounded-md bg-slate-700 px-3 py-1 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white"
                >
                  Compare mode
                </Link>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 text-gray-700">
              {followedLocations.map((loc) => (
                <div
                  key={loc.id}
                  className="rounded-3xl border border-white/50 bg-gradient-to-br from-sky-100/80 to-emerald-100/80 p-6 shadow-2xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-semibold ">{loc.name}</p>
                      <p className="text-xs ">
                        {loc.lat.toFixed(2)}, {loc.lon.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href="/locations#compare"
                        className="rounded-full border px-3 py-1 text-xs font-semibold hover:border-slate-500 border-slate-600 "
                      >
                        View
                      </Link>
                      <button
                        onClick={() => {
                          toggleFollow(loc.id, !loc.isFollowed);
                          toast.info(`${loc.isFollowed ? "Unfollowed" : "Followed"} ${loc.name}`);
                        }}
                        className="rounded-full border border-slate-600  hover:border-white/5 px-3 py-1 text-xs hover:bg-red-400"
                      >
                        {loc.isFollowed ? "Unfollower" : "Follow"}
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                    <span>{loc.timezone}</span>
                    <span>{buildMockLatest(loc).current_weather.temperature.toFixed(1)}°C</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Updated {new Date(loc.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

    </section>
  );
}

