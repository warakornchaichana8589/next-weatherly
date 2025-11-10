'use client';

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { HourlyPoint } from '@/type/weather';
import type { TooltipItem } from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

type HourlySeries = {
  label: string;
  data: HourlyPoint[];
  color?: string;
};

const PALETTE = ['#0ea5e9', '#f97316', '#22c55e', '#ec4899'];

function formatLabel(value: string) {
  const date = new Date(value);
  return Intl.DateTimeFormat('en', {
    weekday: 'short',
    hour: 'numeric',
  }).format(date);
}

export default function WeatherHourlyChart({
  series,
}: {
  series: HourlySeries[];
}) {
  const safeSeries = Array.isArray(series) ? series : [];
  const labels = safeSeries[0]?.data?.map((point) => formatLabel(point.time)) ?? [];

  const datasets = safeSeries.map((serie, index) => ({
    label: `${serie.label} A°C`,
    data: serie.data?.map((point) => point.temperature) ?? [],
    borderColor: serie.color ?? PALETTE[index % PALETTE.length],
    backgroundColor: 'transparent',
    pointRadius: 0,
    tension: 0.35,
  }));

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label(context: TooltipItem<'line'>) {
            const dataset = safeSeries[context.datasetIndex ?? 0];
            const point = dataset?.data?.[context.dataIndex];
            if (!point) return context.formattedValue;
            return `${dataset.label}: ${point.temperature.toFixed(1)} °C | \u00B0C ${point.precipitation.toFixed(
              1,
            )} mm | \u00B0C ${point.humidity}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value: string | number) => `${value}°`,
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.2)',
        },
      },
      x: {
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 8,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/80">
      <div className="mb-3 flex flex-col gap-1">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">Hourly trend</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Temperature, precipitation, and humidity across the past 7 days (hourly resolution)
        </p>
      </div>
      <div className="h-72">
        <Line data={{ labels, datasets }} options={options} />
      </div>
    </div>
  );
}
