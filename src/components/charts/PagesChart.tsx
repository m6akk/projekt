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
  // Family Guy colors: blue primary and yellow accent
  const familyGuyColors = [
    'rgba(21, 110, 161, 0.85)',   // Primary blue
    'rgba(255, 205, 86, 0.85)',   // Yellow
    'rgba(51, 151, 208, 0.85)',   // Light blue
    'rgba(255, 193, 7, 0.85)',    // Gold yellow
  ];

  const chartData = {
    labels: data.map(d => d.name),
    datasets: [
      {
        label: 'Pregledi',
        data: data.map(d => d.views),
        backgroundColor: data.map((_, i) => familyGuyColors[i % familyGuyColors.length]),
        borderColor: data.map((_, i) => familyGuyColors[i % familyGuyColors.length]),
        borderWidth: 2,
        borderRadius: 6,
        barThickness: 20,
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
        font: { size: 16, weight: 'bold' as const },
        color: '#333'
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-80 border-[3px] border-primary/20">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default PagesChart;