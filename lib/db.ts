import { openDB } from "idb";

export const dbPromise = openDB("weather-db", 1, {
    upgrade(db) {
        db.createObjectStore("weather", { keyPath: "id" });
    },
});

export async function saveWeather(id: string, data: any) {
    const db = await dbPromise;
    await db.put("weather", { id, data, savedAt: Date.now() });
}

export async function getWeather(id: string) {
    const db = await dbPromise;
    return db.get("weather", id);
}

export async function getAllWeather() {
    const db = await dbPromise;
    return db.getAll("weather");
}
