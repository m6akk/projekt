import { CONFIG } from '@/config/config';

export interface RetentionSegment {
  segment: string;
  totalUsers: number;
  newUsers: number;
  returningUsers: number;
  retentionRate: number;
}

/**
 * ✅ RETENTION ANALIZA - DAN 1 I VRAĆENI KORISNICI
 */
export async function performRetentionAnalysis(accessToken: string): Promise<RetentionSegment[]> {
  const propertyId = CONFIG.GA_PROPERTY_ID;
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;

  const requestBody = {
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [
      { name: 'newVsReturning' },
      { name: 'deviceCategory' }
    ],
    metrics: [
      { name: 'activeUsers' },
      { name: 'sessions' },
      { name: 'engagedSessions' }
    ]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`GA4 API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Agregacija po segmentima
    const segments: Record<string, {
      totalUsers: number;
      newUsers: number;
      returningUsers: number;
    }> = {
      'Svi': { totalUsers: 0, newUsers: 0, returningUsers: 0 },
      'Desktop': { totalUsers: 0, newUsers: 0, returningUsers: 0 },
      'Mobile': { totalUsers: 0, newUsers: 0, returningUsers: 0 },
      'Tablet': { totalUsers: 0, newUsers: 0, returningUsers: 0 }
    };

    data.rows?.forEach((row: any) => {
      const userType = row.dimensionValues[0]?.value || 'new'; // 'new' | 'returning'
      const device = row.dimensionValues[1]?.value || 'desktop';
      const users = parseInt(row.metricValues[0]?.value) || 0;

      const deviceLabel = capitalizeDevice(device);
      if (!segments[deviceLabel]) {
        segments[deviceLabel] = { totalUsers: 0, newUsers: 0, returningUsers: 0 };
      }

      // Dodaj u sve
      segments['Svi'].totalUsers += users;
      if (userType === 'new') {
        segments['Svi'].newUsers += users;
      } else {
        segments['Svi'].returningUsers += users;
      }

      // Dodaj u device segment
      segments[deviceLabel].totalUsers += users;
      if (userType === 'new') {
        segments[deviceLabel].newUsers += users;
      } else {
        segments[deviceLabel].returningUsers += users;
      }
    });

    // Pretvori u array s postotcima
    return Object.entries(segments).map(([name, data]) => ({
      segment: name,
      totalUsers: data.totalUsers,
      newUsers: data.newUsers,
      returningUsers: data.returningUsers,
      retentionRate: data.totalUsers > 0 
        ? parseFloat(((data.returningUsers / data.totalUsers) * 100).toFixed(1))
        : 0
    }));
  } catch (error) {
    console.error('Error fetching retention analysis:', error);
    return [];
  }
}

/**
 * ✅ HELPER - KAPITALIZACIJA NAZIVA UREĐAJA
 */
function capitalizeDevice(device: string): string {
  const deviceMap: Record<string, string> = {
    'desktop': 'Desktop',
    'mobile': 'Mobile',
    'tablet': 'Tablet'
  };
  return deviceMap[device.toLowerCase()] || device;
}

/**
 * ✅ GENERIRAJ INSIGHTS ZA RETENTION
 */
export function generateRetentionInsights(segments: RetentionSegment[]): string[] {
  const insights: string[] = [];
  
  const allSegment = segments.find(s => s.segment === 'Svi');
  if (allSegment) {
    insights.push(
      `📊 Ukupna retention stopa: ${allSegment.retentionRate}% vraćenih korisnika`
    );

    if (allSegment.retentionRate < 30) {
      insights.push(
        `⚠️ Niska retention stopa - trebalo bi poboljšati korisničko iskustvo i engagement`
      );
    } else if (allSegment.retentionRate > 60) {
      insights.push(
        `✅ Odličan retention - korisnici se voljno vraćaju`
      );
    }
  }

  // Usporedba mobilnih vs desktop
  const mobile = segments.find(s => s.segment === 'Mobile');
  const desktop = segments.find(s => s.segment === 'Desktop');

  if (mobile && desktop && mobile.retentionRate > desktop.retentionRate + 10) {
    insights.push(
      `📱 Mobilni korisnici se češće vraćaju (${mobile.retentionRate}% vs ${desktop.retentionRate}% na desktopu)`
    );
  }

  return insights;
}
