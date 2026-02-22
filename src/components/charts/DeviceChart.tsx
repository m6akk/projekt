import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DeviceChartProps {
  data: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
}

const DeviceChart: React.FC<DeviceChartProps> = ({ data }) => {
  const chartData = {
    labels: ['Desktop', 'Mobile', 'Tablet'],
    datasets: [
      {
        data: [data.desktop, data.mobile, data.tablet],
        backgroundColor: [
          'rgba(21, 110, 161, 0.8)',
          'rgba(51, 151, 208, 0.8)',
          'rgba(74, 163, 216, 0.8)',
        ],
        borderColor: [
          'rgba(21, 110, 161, 1)',
          'rgba(51, 151, 208, 1)',
          'rgba(74, 163, 216, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Korisnici po uređaju',
        font: {
          size: 16,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-80">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default DeviceChart;