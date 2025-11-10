import type { DailyPoint, HourlyPoint, LocationWeather } from "@/type/weather";

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function generateHourlyData(baseTemp: number): HourlyPoint[] {
  const points: HourlyPoint[] = [];
  const hours = 7 * 24;
  const now = Date.now();

  for (let i = hours - 1; i >= 0; i -= 1) {
    const time = new Date(now - i * 60 * 60 * 1000).toISOString();
    const temperature =
      baseTemp + Math.sin((i / 24) * Math.PI) * randomBetween(2, 6) + randomBetween(-1, 1);
    const precipitation = Math.max(0, randomBetween(-1, 5));
    const humidity = randomBetween(45, 95);

    points.push({
      time,
      temperature: Number(temperature.toFixed(1)),
      precipitation: Number(precipitation.toFixed(2)),
      humidity: Number(humidity.toFixed(0)),
    });
  }

  return points;
}

export function generateDailyData(baseTemp: number): DailyPoint[] {
  const points: DailyPoint[] = [];
  const days = 7;
  const today = new Date();

  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const tempMax = baseTemp + randomBetween(3, 7);
    const tempMin = baseTemp - randomBetween(2, 5);
    const rain = Math.max(0, randomBetween(-2, 15));

    points.push({
      date: date.toISOString().split("T")[0],
      tempMax: Number(tempMax.toFixed(1)),
      tempMin: Number(tempMin.toFixed(1)),
      rain: Number(rain.toFixed(1)),
    });
  }

  return points;
}

type MockLocationSeed = {
  id: number;
  name: string;
  lat: number;
  lon: number;
  timezone: string;
  isFollowed?: boolean;
};

export function createMockLocationWeather(seed: MockLocationSeed): LocationWeather {
  const baseTemp = 20 + seed.lat / 15;
  return {
    id: seed.id,
    name: seed.name,
    lat: seed.lat,
    lon: seed.lon,
    timezone: seed.timezone,
    isFollowed: seed.isFollowed ?? true,
    hourly: generateHourlyData(baseTemp),
    daily: generateDailyData(baseTemp),
    lastUpdated: new Date().toISOString(),
  };
}
