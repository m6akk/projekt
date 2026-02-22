import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface UsersTimeChartProps {
  data: Array<{ date: string; users: number }>;
}

const UsersTimeChart: React.FC<UsersTimeChartProps> = ({ data }) => {
  // Format dates from YYYYMMDD to DD/MM
  const formatDate = (dateStr: string) => {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${day}.${month}.`;
  };

  const chartData = {
    labels: data.map(d => formatDate(d.date)),
    datasets: [
      {
        label: 'Korisnici',
        data: data.map(d => d.users),
        borderColor: 'rgba(21, 110, 161, 1)',
        backgroundColor: 'rgba(21, 110, 161, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Korisnici kroz vrijeme (zadnjih 30 dana)',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-80">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default UsersTimeChart;