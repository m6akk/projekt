import React from 'react';
import { AnalyticsData } from '../../types/analytics';

interface KPICardsProps {
  data: AnalyticsData;
}

const KPICards: React.FC<KPICardsProps> = ({ data }) => {
  const cards = [
    { label: 'Ukupno korisnika', value: data.totalUsers, icon: '👥' },
    { label: 'Ukupno sesija', value: data.totalSessions, icon: '📊' },
    { label: 'Pregleda stranica', value: data.totalPageviews, icon: '👁️' },
    { label: 'Prosječno trajanje sesije', value: data.avgDuration, icon: '⏱️' },
    { label: 'Bounce Rate', value: `${data.bounceRate}%`, icon: '📉' },
    { label: 'Ukupno događaja', value: data.totalEvents.toLocaleString(), icon: '🔔' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">{card.icon}</span>
            <span className="text-xs font-semibold text-gray-400 uppercase">KPI</span>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{card.value}</div>
          <div className="text-sm text-gray-500">{card.label}</div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;