import { openDB } from "idb";
import type { IDBPDatabase } from "idb";

export type WeatherRecord<T = unknown> = {
  id: string;
  data: T;
  updatedAt: number;
};

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb() {
  if (typeof window === "undefined" || !window.indexedDB) {
    return null;
  }
  if (!dbPromise) {
    dbPromise = openDB("weather-db", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("weather")) {
          db.createObjectStore("weather", { keyPath: "id" });
        }
      },
    });
  }
  return dbPromise;
}

export async function saveWeather<T>(id: string, data: T): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.put("weather", { id, data, updatedAt: Date.now() });
}

export async function getWeather<T = unknown>(
  id: string,
): Promise<WeatherRecord<T> | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  return (await db.get("weather", id)) as WeatherRecord<T> | undefined;
}

export async function getAllWeather<T = unknown>(): Promise<WeatherRecord<T>[]> {
  const db = await getDb();
  if (!db) return [];
  return (await db.getAll("weather")) as WeatherRecord<T>[];
}
