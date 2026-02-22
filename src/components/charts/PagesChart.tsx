import React from 'react';
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
  const chartData = {
    labels: data.map(d => d.name),
    datasets: [
      {
        label: 'Pregledi',
        data: data.map(d => d.views),
        // Use site accent (yellow) from CSS variables so charts match site style
        backgroundColor: 'hsl(var(--accent))',
        borderColor: 'hsl(var(--accent))',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Najpopularnije stranice',
        font: {
          size: 16,
        },
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