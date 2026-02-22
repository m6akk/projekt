import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PagesChartProps {
  data: Array<{ name: string; views: number }>;
}

const PagesChart: React.FC<PagesChartProps> = ({ data }) => {
  // Compute colors from CSS variables so chart matches site theme
  const chartColors = useMemo(() => {
    if (typeof window === 'undefined') return [
      'rgba(255, 205, 86, 0.9)'
    ];

    const css = getComputedStyle(document.documentElement);
    const vars = ['--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5'];
    const colors = vars.map(v => {
      const val = css.getPropertyValue(v).trim();
      return val ? `hsl(${val})` : null;
    }).filter(Boolean) as string[];

    if (colors.length === 0) return ['rgba(21,110,161,0.85)'];
    return colors;
  }, []);

  const chartData = {
    labels: data.map(d => d.name),
    datasets: [
      {
        label: 'Pregledi',
        data: data.map(d => d.views),
        backgroundColor: data.map((_, i) => chartColors[i % chartColors.length]),
        borderColor: data.map((_, i) => chartColors[i % chartColors.length]),
        borderWidth: 1,
        borderRadius: 6,
        barThickness: 18,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Najpopularnije stranice',
        font: { size: 16 },
        color: getComputedStyle(document.documentElement).getPropertyValue('--foreground')
          ? `hsl(${getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim()})`
          : '#111'
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-80">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default PagesChart;