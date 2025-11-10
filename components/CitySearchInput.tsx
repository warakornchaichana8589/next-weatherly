"use client";
import { useState } from "react";

interface CityData {
  name: string;
  lat: number;
  lon: number;
  timezone: string;
  country?: string;
}

interface Props {
  onSelect: (city: CityData) => void;
}

export default function CitySearchInput({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function searchCities(value: string) {
    setQuery(value);
    setError("");

    if (value.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${value}&limit=10`,
        {
          headers: {
            "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
            "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch cities");

      const json = await res.json();

      const mapped: CityData[] = json.data.map((c: any) => ({
        name: c.city,
        lat: c.latitude,
        lon: c.longitude,
        timezone: c.timezone || "Unknown",
        country: c.country,
      }));

      setResults(mapped);
    } catch (err) {
      console.error(err);
      setError("Failed to load cities");
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(city: CityData) {
    setError("");
    setQuery(city.name);
    setResults([]);
    onSelect(city);
    
  }

  return (
    <div className="relative w-full">
      
      <label className="block text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        Search City
      </label>
      <input
        type="text"
        value={query}
        placeholder="Type city name..."
        onChange={(e) => searchCities(e.target.value)}
        className="w-full border rounded-xl p-2 bg-white dark:bg-gray-400 text-gray-900 dark:text-white  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
      />

      {loading && <p className="text-xs text-gray-400 mt-1">Loading...</p>}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}

      {results.length > 0 && (
        <ul className="absolute mt-1 w-full max-h-56 overflow-y-auto rounded-md border border-gray-700 bg-slate-700 shadow-lg z-900">
          {results.map((city) => (
            <li
              key={city.name + city.lat}
              onClick={() => handleSelect(city)}
              className="cursor-pointer px-3 py-2 hover:bg-slate-700 text-gray-100 text-sm"
            >
              {city.name}
              {city.country && (
                <span className="text-gray-400 text-xs"> ({city.country})</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
