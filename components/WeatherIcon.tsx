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


type Props = {
    weatherCode: number,
    isDay?: boolean,
}
const weatherGroups: Record<number, string> = {
    0: "clear",
    1: "clear",
    2: "partly-cloudy",
    3: "cloudy",
    45: "fog",
    48: "fog",
    51: "drizzle",
    53: "drizzle",
    55: "drizzle",
    61: "rain",
    63: "rain",
    65: "rain",
    80: "rain-showers",
    81: "rain-showers",
    82: "rain-showers",
    95: "thunderstorm",
    96: "thunderstorm",
    99: "thunderstorm",
};
function WeatherIcon({ weatherCode, isDay }: Props) {
    const type = weatherGroups[weatherCode] || "unknown";
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