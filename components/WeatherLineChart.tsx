"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import type { ChartOptions } from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale);

interface WeatherLineChartProps {
  hourlyData: {
    time: string[];
    temperature_2m: number[];
  };
}

const chartOptions: ChartOptions<"line"> = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      mode: "index",
      intersect: false,
    },
  },
  scales: {
    x: {
      type: "time",
      time: { unit: "day" },
      ticks: { color: "#6b7280" },
    },
    y: {
      ticks: {
        color: "#6b7280",
        callback: (val) => `${val as string}°`,
      },
      grid: { color: "rgba(156, 163, 175, 0.2)" },
    },
  },
};

export default function WeatherLineChart({ hourlyData }: WeatherLineChartProps) {
  const data = {
    labels: hourlyData.time,
    datasets: [
      {
        label: "Temperature (°C)",
        data: hourlyData.temperature_2m,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.3)",
        tension: 0.3,
        fill: true,
        pointRadius: 0,
      },
    ],
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-lg dark:bg-slate-900">
      <h3 className="mb-2 font-semibold text-slate-700 dark:text-white">Temperature (last 7 days)</h3>
      <Line data={data} options={chartOptions} />
    </div>
  );
}
