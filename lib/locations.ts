import { fetcher } from "./fetcher";
import { LocationWeather } from "@/type/weather";

export type LocationsResponse = {
  locations: LocationWeather[];
};

export default async function getLocations(): Promise<LocationsResponse> {
  try {
    const data = await fetcher<LocationsResponse>(`/api/locations`, {
      useAuth: true,
    });
    return data;
  } catch (error) {
    console.error("Failed to fetch locations:", error);
    return { locations: [] };
  }
}
