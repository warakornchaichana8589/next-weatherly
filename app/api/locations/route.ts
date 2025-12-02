import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { LocationWeather, LocationType } from "@/type/weather";
import { createMockLocationWeather } from "@/lib/mockWeather";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "mysecret";

type CityTemplate = Omit<LocationType, "id" | "isFollowed"> & {
  timezone: string;
  name: string;
  lat: number;
  lon: number;
};

const CITY_TEMPLATES: CityTemplate[] = [
  { name: "Bangkok", lat: 13.7563, lon: 100.5018, timezone: "Asia/Bangkok" },
  { name: "Chiang Mai", lat: 18.7883, lon: 98.9853, timezone: "Asia/Bangkok" },
  { name: "Tokyo", lat: 35.6895, lon: 139.6917, timezone: "Asia/Tokyo" },
  { name: "Seoul", lat: 37.5665, lon: 126.978, timezone: "Asia/Seoul" },
  { name: "Sydney", lat: -33.8688, lon: 151.2093, timezone: "Australia/Sydney" },
  { name: "London", lat: 51.5072, lon: -0.1276, timezone: "Europe/London" },
  { name: "Paris", lat: 48.8566, lon: 2.3522, timezone: "Europe/Paris" },
  { name: "New York", lat: 40.7128, lon: -74.006, timezone: "America/New_York" },
  { name: "Los Angeles", lat: 34.0522, lon: -118.2437, timezone: "America/Los_Angeles" },
  { name: "Vancouver", lat: 49.2827, lon: -123.1207, timezone: "America/Vancouver" },
];

type UserStore = {
  locations: LocationWeather[];
  nextId: number;
};

const userStores: Record<string, UserStore> = {};

function ensureUserStore(userId: string): UserStore {
  if (!userStores[userId]) {
    const locations = CITY_TEMPLATES.map((template, index) =>
      createMockLocationWeather({
        id: index + 1,
        name: template.name,
        lat: template.lat,
        lon: template.lon,
        timezone: template.timezone,
        isFollowed: true,
      }),
    );
    userStores[userId] = {
      locations,
      nextId: locations.length + 1,
    };
  }
  return userStores[userId];
}

async function requireUserId(req: NextRequest) {
  const token = await getToken({ req, secret: NEXTAUTH_SECRET });

  if (!token) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (!token.id) {
    return { error: NextResponse.json({ error: "Invalid token" }, { status: 403 }) };
  }
  return { userId: String(token.id) };
}

function logLocations(action: string, userId: string, locations: LocationWeather[]) {
  const summary = locations.map((loc) => ({ id: loc.id, name: loc.name, followed: loc.isFollowed }));
}

export async function GET(req: NextRequest) {
  const result = await requireUserId(req);
  if ("error" in result) return result.error;

  const store = ensureUserStore(result.userId);
  logLocations("GET", result.userId, store.locations);
  return NextResponse.json({ locations: store.locations });
}

export async function POST(req: NextRequest) {
  const result = await requireUserId(req);
  if ("error" in result) return result.error;

  try {
    const body = await req.json();
    const { name, lat, lon, timezone, isFollowed = true } = body;

    if (
      !name ||
      typeof lat !== "number" ||
      typeof lon !== "number" ||
      typeof timezone !== "string"
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const store = ensureUserStore(result.userId);
    const id = store.nextId++;
    const newLocation = createMockLocationWeather({
      id,
      name,
      lat,
      lon,
      timezone,
      isFollowed: Boolean(isFollowed),
    });
    store.locations.push(newLocation);

    logLocations("POST", result.userId, store.locations);
    return NextResponse.json(
      { message: "Location added successfully", location: newLocation },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  const result = await requireUserId(req);
  if ("error" in result) return result.error;

  try {
    const body = await req.json();
    const { id, isFollowed } = body;

    if (typeof id !== "number" || typeof isFollowed !== "boolean") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const store = ensureUserStore(result.userId);
    const location = store.locations.find((loc) => loc.id === id);
    if (!location) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }

    location.isFollowed = isFollowed;
    location.lastUpdated = new Date().toISOString();

    logLocations("PATCH", result.userId, store.locations);
    return NextResponse.json({ message: "Follow state updated", location });
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const result = await requireUserId(req);
  if ("error" in result) return result.error;

  const { searchParams } = new URL(req.url);
  const idParam = searchParams.get("id");

  try {
    let id: number | null = null;
    if (idParam) {
      id = Number(idParam);
    } else {
      const body = await req.json().catch(() => null);
      if (body && typeof body.id === "number") {
        id = body.id;
      }
    }

    if (typeof id !== "number" || Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const store = ensureUserStore(result.userId);
    const index = store.locations.findIndex((loc) => loc.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }

    const [removed] = store.locations.splice(index, 1);
    logLocations("DELETE", result.userId, store.locations);

    return NextResponse.json({ message: "Location removed", location: removed });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
