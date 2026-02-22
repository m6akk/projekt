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
        backgroundColor: 'rgba(21, 110, 161, 0.8)',
        borderColor: 'rgba(21, 110, 161, 1)',
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