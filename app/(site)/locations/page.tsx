"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import WeatherHourlyChart from "@/components/WeatherHourlyChart";
import WeatherDailyChart from "@/components/WeatherDailyChart";
import MapPicker from "@/components/MapPicker";
import { useLocationStore } from "@/store/locationStore";
import type { LocationWeather } from "@/type/weather";
import CitySearchInput from "@/components/CitySearchInput"
import { LocationType } from "@/type/weather"
import { toast } from "react-toastify";
import { createMockLocationWeather } from "@/lib/mockWeather";

const DEFAULT_FORM = {
  name: "Chiang Mai",
  lat: 18.7883,
  lon: 98.9853,
  timezone: "Asia/Bangkok",
};

export default function LocationsPage() {
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
  const setSelected = useLocationStore((state) => state.setSelected);
  const upsert = useLocationStore((state) => state.upsert);
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

  const locationsList = (
    <div className="space-y-3">
      {locations.map((loc) => (
        <div
          key={loc.id}
          className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/70 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/70"
        >
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">{loc.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {loc.lat.toFixed(2)}, {loc.lon.toFixed(2)} • {loc.timezone}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedById(loc.id);
                router.push("/dashboard");
              }}
              className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-slate-500 dark:border-slate-600 dark:text-slate-200"
            >
              View
            </button>
            <button
              onClick={() => toggleFollow(loc.id, !loc.isFollowed)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${loc.isFollowed
                ? "bg-emerald-500/90 text-white"
                : "border border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-200"
                }`}
            >
              {loc.isFollowed ? "Following" : "Follow"}
            </button>
            <button
              onClick={() => removeLocation(loc.id)}
              className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/60 dark:text-red-200 dark:hover:bg-red-500/10"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className=" bg-white dark:bg-gray-900">
      <div className="w-full container mx-auto pt-20 flex max-w-6xl flex-col gap-8 px-4 py-8">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Weatherly
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Locations</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage followed cities, explore mock weather data, and compare conditions across the
            globe.
          </p>
        </header>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/60 dark:text-red-200">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200">
            {successMessage}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-lg dark:border-slate-700 dark:bg-slate-900/60">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Followed cities
                </h2>
                {loading && (
                  <span className="text-xs uppercase tracking-wide text-slate-400">Loading…</span>
                )}
              </div>
              {locations.length ? (
                locationsList
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No cities yet. Use the form to add your first location.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-lg dark:border-slate-700 dark:bg-slate-900/60">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Add a city</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click on the map or fill the form to generate mock data.
            </p>
            <div className="my-2">
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

                  upsert(newLoc);
                  setSelected(newLoc);

                  toast.success(`Switched to ${city.name}`);
                }}
              />
            </div>

            <MapPicker
              className="mt-4"
              value={{ lat: formState.lat, lon: formState.lon }}
              onChange={(coords) => setFormState((prev) => ({ ...prev, ...coords }))}
            />
            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Name
                </label>
                <input
                  required
                  value={formState.name}
                  onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Latitude
                  </label>
                  <input
                    required
                    type="number"
                    step="0.0001"
                    value={formState.lat}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, lat: Number(event.target.value) }))
                    }
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Longitude
                  </label>
                  <input
                    required
                    type="number"
                    step="0.0001"
                    value={formState.lon}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, lon: Number(event.target.value) }))
                    }
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Timezone (IANA)
                </label>
                <input
                  required
                  value={formState.timezone}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, timezone: event.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                disabled={loading}
              >
                {loading ? "Saving..." : "Add city"}
              </button>
            </form>
          </div>
        </div>

        <section
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
                      {locations.map((loc) => (
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
        </section>
      </div>

    </section>
  );
}

