import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface TrafficChartProps {
  data: Record<string, number>;
}

const TrafficChart: React.FC<TrafficChartProps> = ({ data }) => {
  const sources = Object.entries(data);
  
  // Generate colors
  const colors = [
    'rgba(21, 110, 161, 0.8)',
    'rgba(51, 151, 208, 0.8)',
    'rgba(74, 163, 216, 0.8)',
    'rgba(102, 178, 224, 0.8)',
    'rgba(130, 193, 232, 0.8)',
    'rgba(158, 208, 240, 0.8)',
  ];

  const chartData = {
    labels: sources.map(([key]) => key.charAt(0).toUpperCase() + key.slice(1)),
    datasets: [
      {
        data: sources.map(([, value]) => value),
        backgroundColor: colors.slice(0, sources.length),
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
        text: 'Izvori prometa',
        font: {
          size: 16,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-80">
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default TrafficChart;