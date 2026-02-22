import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface TrafficChartProps {
  data: Record<string, number>;
}

const TrafficChart: React.FC<TrafficChartProps> = ({ data }) => {
  const sources = Object.entries(data);
  
  // Family Guy color palette: alternating blue and yellow tones
  const colors = [
    'rgba(21, 110, 161, 0.85)',   // Primary blue
    'rgba(255, 205, 86, 0.85)',   // Yellow
    'rgba(51, 151, 208, 0.85)',   // Light blue
    'rgba(255, 193, 7, 0.85)',    // Gold
    'rgba(21, 110, 161, 0.7)',    // Darker blue
    'rgba(255, 205, 86, 0.7)',    // Darker yellow
  ];

  const chartData = {
    labels: sources.map(([key]) => key.charAt(0).toUpperCase() + key.slice(1)),
    datasets: [
      {
        data: sources.map(([, value]) => value),
        backgroundColor: colors.slice(0, sources.length),
        borderColor: colors.slice(0, sources.length),
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
        font: { size: 16, weight: 'bold' as const },
        color: '#333'
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-80 border-[3px] border-primary/20">
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default TrafficChart;