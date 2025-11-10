'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import type { DailyPoint } from '@/type/weather';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend);

type DailySeries = {
  label: string;
  data: DailyPoint[];
  color?: string;
};

const PALETTE = ['#0ea5e9', '#f97316', '#22c55e', '#ec4899'];
type MixedChartType = 'bar' | 'line';

export default function WeatherDailyChart({ series }: { series: DailySeries[] }) {
  const safeSeries = Array.isArray(series) ? series : [];
  const labels = safeSeries[0]?.data?.map((point) => point.date) ?? [];

  const datasets: ChartDataset<MixedChartType, number[]>[] = safeSeries.flatMap(
    (serie, index) => {
      const color = serie.color ?? PALETTE[index % PALETTE.length];
      const baseLabel = serie.label;
      return [
        {
          type: 'bar' as const,
        label: `${baseLabel} (max)`,
        data: serie.data?.map((point) => point.tempMax) ?? [],
        backgroundColor: color,
        borderRadius: 6,
        yAxisID: 'yTemp',
      },
      {
        type: 'bar' as const,
        label: `${baseLabel} (min)`,
        data: serie.data?.map((point) => point.tempMin) ?? [],
        backgroundColor: `${color}80`,
        borderRadius: 6,
        yAxisID: 'yTemp',
      },
      {
        type: 'line' as const,
        label: `${baseLabel} rain`,
        data: serie.data?.map((point) => point.rain) ?? [],
        borderColor: color,
        backgroundColor: color,
        yAxisID: 'yRain',
        tension: 0.3,
        },
      ];
    },
  );

  const data: ChartData<MixedChartType, number[]> = { labels, datasets };

  const options: ChartOptions<MixedChartType> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    scales: {
      yTemp: {
        beginAtZero: false,
        position: 'left' as const,
        ticks: {
          callback: (value: number) => `${value}°`,
        },
      },
      yRain: {
        beginAtZero: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: (value: number) => `${value} mm`,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/80">
      <div className="mb-3 flex flex-col gap-1">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">Daily summary</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Max/Min temperature and rainfall totals for the last 7 days
        </p>
      </div>
      <div className="h-80">
        <Chart type="bar" data={data} options={options} />
      </div>
    </div>
  );
}
