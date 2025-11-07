export type CurrentWeather = {
    temperature: number;      // °C
    windspeed: number;        // m/s
    winddirection?: number;
    weathercode?: number;
    time: string;
};
export type LatestResponse = {
    latitude: number;
    longitude: number;
    timezone: string;
    current_weather: CurrentWeather;
};
export type HourlyResponse = {
  latitude: number;
  longitude: number;
  timezone: string;
  hourly_units: {
    time: string; // "iso8601"
    temperature_2m: string; // "°C"
    relative_humidity_2m: string; // "%"
    precipitation: string; // "mm"
    wind_speed_10m?: string; // e.g. "m/s" if requested
  };
  hourly: {
    time: string[];                 // ISO array
    temperature_2m: number[];       // °C
    relative_humidity_2m: number[]; // %
    precipitation: number[];        // mm
    wind_speed_10m?: number[];      // (ถ้าเรียก)
    weathercode?: number[];
  };
};
export type DailyAggregate = {
  date: string;           // "YYYY-MM-DD" ใน timezone ของ location
  temp_min: number | null;
  temp_max: number | null;
  rain_total_mm: number;  // sum
  wind_max_ms: number | null;
};