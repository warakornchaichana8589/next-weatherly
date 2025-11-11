"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import WeatherHourlyChart from "@/components/WeatherHourlyChart";
import WeatherDailyChart from "@/components/WeatherDailyChart";
import { useLocationStore } from "@/store/locationStore";
import type { LocationWeather } from "@/type/weather";
import Link from "next/link";

const DEFAULT_FORM = {
  name: "Chiang Mai",
  lat: 18.7883,
  lon: 98.9853,
  timezone: "Asia/Bangkok",
};

export default function ComparePage() {
  const {
    locations,
    selected,
    loading,
    error,
    compareMode,
    compareSelection,
    fetchLocations,
    addLocation,
    setSelectedById,
    toggleFollow,
    removeLocation,
    setCompareMode,
    setCompareSelection,
  } = useLocationStore();
  const router = useRouter();

  const [formState, setFormState] = useState(DEFAULT_FORM);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (loading || locations.length) return;
    fetchLocations();
  }, [fetchLocations, loading, locations.length]);

  const activeLocation = selected ?? locations[0];

  const compareTargets = useMemo(
    () =>
      compareSelection
        .map((id) => locations.find((loc) => loc?.id === id))
        .filter(Boolean) as LocationWeather[],
    [compareSelection, locations],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      name: formState.name.trim(),
      lat: Number(formState.lat),
      lon: Number(formState.lon),
      timezone: formState.timezone.trim(),
    };
    if (!payload.name || Number.isNaN(payload.lat) || Number.isNaN(payload.lon)) {
      return;
    }
    await addLocation(payload);
    setSuccessMessage(`Added ${payload.name}`);
    setFormState(DEFAULT_FORM);
    setTimeout(() => setSuccessMessage(null), 2500);
  };



  return (
    <section className=" bg-white dark:bg-gray-900 min-h-screen">
      <div className="w-full container mx-auto pt-20 flex flex-col gap-8 px-4 py-8">
        <div className="w-full flex flex-wrap gap-4 justify-end mt-2">
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
                <Link
                  href="/dashboard"
                  className="rounded-md bg-slate-700 px-3 py-1 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white"
                >
                  DashBoard
                </Link>
        </div>
        <div
          id="compare"
          className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-lg dark:border-slate-700 dark:bg-slate-900/60"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Compare mode</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Toggle compare mode to inspect two cities side-by-side.
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              <input
                type="checkbox"
                className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 dark:border-slate-600"
                checked={compareMode}
                onChange={(event) => setCompareMode(event.target.checked)}
              />
              Compare two cities
            </label>
          </div>

          {compareMode ? (
            <div className="mt-4 space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                {[0, 1].map((slot) => (
                  <div key={slot}>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      City {slot + 1}
                    </label>
                    <select
                      value={compareSelection[slot] ?? ""}
                      onChange={(event) =>
                        setCompareSelection(slot as 0 | 1, event.target.value ? Number(event.target.value) : null)
                      }
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="">Select a city</option>
                      {locations
                        .filter((loc) => loc.isFollowed)
                        .map((loc) => (
                          <option key={loc.id} value={loc.id ?? undefined}>
                            {loc.name}
                          </option>
                        ))}
                    </select>
                  </div>
                ))}
              </div>
              {compareTargets.length >= 2 ? (
                <div className="space-y-5">
                  <WeatherHourlyChart
                    series={compareTargets.map((loc, index) => ({
                      label: loc.name,
                      data: loc.hourly,
                      color: index === 0 ? "#0ea5e9" : "#f97316",
                    }))}
                  />
                  <WeatherDailyChart
                    series={compareTargets.map((loc, index) => ({
                      label: loc.name,
                      data: loc.daily,
                      color: index === 0 ? "#0ea5e9" : "#f97316",
                    }))}
                  />
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Select two cities to unlock comparison charts.
                </p>
              )}
            </div>
          ) : activeLocation ? (
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Choose city to preview
                </label>
                <select
                  value={activeLocation.id ?? ""}
                  onChange={(event) => {
                    const nextId = Number(event.target.value);
                    if (!Number.isNaN(nextId)) {
                      setSelectedById(nextId);
                    }
                  }}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id ?? undefined}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/50">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <div>
                    <p className="text-base font-semibold text-slate-900 dark:text-white">
                      {activeLocation.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {activeLocation.lat.toFixed(2)}, {activeLocation.lon.toFixed(2)} •{" "}
                      {activeLocation.timezone}
                    </p>
                  </div>
                  <button
                    className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
                    onClick={() => toggleFollow(activeLocation.id, !activeLocation.isFollowed)}
                  >
                    {activeLocation.isFollowed ? "Unfollow" : "Follow"}
                  </button>
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Last updated {new Date(activeLocation.lastUpdated).toLocaleString()}
                </p>
              </div>
              <WeatherHourlyChart series={[{ label: activeLocation.name, data: activeLocation.hourly }]} />
              <WeatherDailyChart series={[{ label: activeLocation.name, data: activeLocation.daily }]} />
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">No data available.</p>
          )}
        </div>
      </div>

    </section>
  );
}
