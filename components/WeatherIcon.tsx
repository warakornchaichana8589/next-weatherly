import {
    Sun,
    Cloud,
    CloudRain,
    CloudLightning,
    CloudFog,
    CloudSun,
    CloudMoon,
    Moon,
} from "lucide-react";

import { WEATHER_GROUPS } from "@/lib/weather"

type Props = {
    weatherCode: number,
    isDay?: boolean,
}

function WeatherIcon({ weatherCode, isDay }: Props) {
    const type = WEATHER_GROUPS[weatherCode] || "unknown";
    switch (type) {
        case "clear":
            return isDay ? <Sun /> : <Moon />;
        case "partly-cloudy":
            return isDay ? <CloudSun /> : <CloudMoon />;
        case "cloudy":
            return <Cloud />;
        case "fog":
            return <CloudFog />;
        case "drizzle":
        case "rain":
        case "rain-showers":
            return <CloudRain />;
        case "thunderstorm":
            return <CloudLightning />;
        default:
            return <Cloud />;
    }
}
export default WeatherIcon;