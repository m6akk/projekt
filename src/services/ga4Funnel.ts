import { CONFIG } from '@/config/config';

export interface FunnelStep {
  id: string;
  name: string;
  path: string;
  pathRegex?: RegExp;
  users: number;
  sessions: number;
  dropOff: number;
  conversionRate: number;
}

/**
 * ✅ PRAVA FUNNEL ANALIZA S DEFINIRANIM KORACIMA
 */
const FUNNEL_STEPS = [
  { id: 'homepage', name: 'Početna stranica', path: '/', pathRegex: /^\/$/ },
  { id: 'recipes', name: 'Popis recepata', path: '/recepti', pathRegex: /^\/recepti.*/ },
  { id: 'recipe_detail', name: 'Detalji recepta', path: '/recept/:id', pathRegex: /^\/recept\/\d+.*/ },
  { id: 'contact', name: 'Kontakt', path: '/kontakt', pathRegex: /^\/kontakt.*/ }
];

export async function performFunnelAnalysis(accessToken: string): Promise<FunnelStep[]> {
  const propertyId = CONFIG.GA_PROPERTY_ID;
  const baseUrl = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;

  const funnelResults: FunnelStep[] = [];

  for (let i = 0; i < FUNNEL_STEPS.length; i++) {
    const step = FUNNEL_STEPS[i];

    try {
      const stepData = await fetchStepData(baseUrl, accessToken, step);
      
      const prevStep = i > 0 ? funnelResults[i - 1] : null;
      const dropOff = prevStep && prevStep.users > 0
        ? ((prevStep.users - stepData.users) / prevStep.users) * 100
        : 0;
      const conversionRate = prevStep && prevStep.users > 0
        ? ((stepData.users / prevStep.users) * 100)
        : 100;

      funnelResults.push({
        ...step,
        users: stepData.users,
        sessions: stepData.sessions,
        dropOff: parseFloat(dropOff.toFixed(1)),
        conversionRate: parseFloat(conversionRate.toFixed(1))
      });
    } catch (error) {
      console.error(`Error fetching funnel data for step ${step.id}:`, error);
    }
  }

  return funnelResults;
}

/**
 * ✅ DOHVAĆA PODATKE ZA SPECIFIČAN FUNNEL KORAK
 */
async function fetchStepData(
  baseUrl: string,
  accessToken: string,
  step: typeof FUNNEL_STEPS[0]
): Promise<{ users: number; sessions: number }> {
  const requestBody = {
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [
      { name: 'activeUsers' },
      { name: 'sessions' }
    ],
    dimensionFilter: {
      filter: {
        fieldName: 'pagePath',
        stringFilter: {
          matchType: 'FULL_REGEX',
          value: step.pathRegex?.source || step.path
        }
      }
    }
  };

  try {
    const response = await fetch(baseUrl, {
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
    
    let totalUsers = 0;
    let totalSessions = 0;

    data.rows?.forEach((row: any) => {
      totalUsers += parseInt(row.metricValues[0]?.value) || 0;
      totalSessions += parseInt(row.metricValues[1]?.value) || 0;
    });

    return { users: totalUsers, sessions: totalSessions };
  } catch (error) {
    console.error(`Error fetching funnel step ${step.id}:`, error);
    return { users: 0, sessions: 0 };
  }
}

/**
 * ✅ GENERIRAJ INTERPRETACIJU FUNNEL REZULTATA
 */
export function generateFunnelInsights(funnelData: FunnelStep[]): string[] {
  const insights: string[] = [];

  funnelData.forEach((step, index) => {
    if (step.dropOff > 40) {
      insights.push(
        `⚠️ Visoki drop-off (${step.dropOff}%) nakon "${step.name}" - trebala bi optimizacija`
      );
    }

    if (index > 0 && step.conversionRate < 50) {
      insights.push(
        `📉 Samo ${step.conversionRate}% korisnika ide s "${funnelData[index - 1].name}" na "${step.name}"`
      );
    }
  });

  if (insights.length === 0) {
    insights.push('✅ Dobar tok konverzije - nema značajnih drop-off točaka');
  }

  return insights;
}
