import { Recipe } from '@/data/recipes';
import { RecipeFeatures } from '@/utils/recommendations';
import { CONFIG } from '@/config/config';

/**
 * ✅ DOHVAĆA STVARNE PODATKE IZ GA4 - KOJI RECEPTI SU PREGLEDANI
 */
export async function fetchUserInteractionsFromGA4(accessToken: string) {
  const propertyId = CONFIG.GA_PROPERTY_ID;
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;

  const requestBody = {
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [
      { name: 'pagePath' },
      { name: 'pageTitle' }
    ],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' },
      { name: 'engagedSessions' },
      { name: 'eventCount' }
    ],
    orderBys: [
      { metric: { metricName: 'screenPageViews' }, desc: true }
    ],
    limit: 100
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

    return await response.json();
  } catch (error) {
    console.error('Error fetching GA4 interactions:', error);
    return null;
  }
}

/**
 * ✅ ANALIZIRA KOJE RECEPTE JE KORISNIK PREGLEDAO IZ GA4 PODATAKA
 */
export function analyzeRecipeViewsFromGA4(ga4Data: any): Map<number, {
  views: number;
  duration: number;
  engaged: number;
  events: number;
}> {
  const recipeViews = new Map();

  ga4Data?.rows?.forEach((row: any) => {
    const pagePath = row.dimensionValues[0]?.value || '';
    const recipeIdMatch = pagePath.match(/\/recept\/(\d+)/);
    
    if (!recipeIdMatch) return;

    const recipeId = parseInt(recipeIdMatch[1]);
    const views = parseInt(row.metricValues[0]?.value) || 0;
    const duration = parseFloat(row.metricValues[1]?.value) || 0;
    const engaged = parseInt(row.metricValues[2]?.value) || 0;
    const events = parseInt(row.metricValues[3]?.value) || 0;

    const existing = recipeViews.get(recipeId) || { views: 0, duration: 0, engaged: 0, events: 0 };
    recipeViews.set(recipeId, {
      views: existing.views + views,
      duration: existing.duration + duration,
      engaged: existing.engaged + engaged,
      events: existing.events + events
    });
  });

  return recipeViews;
}

/**
 * ✅ IZRAČUNAVA KORISNIČKI PROFIL NA TEMELJU STVARNIH PREGLEDA IZ GA4
 */
export function calculateProfileFromGA4Views(
  viewedRecipes: Map<number, any>,
  allRecipes: Recipe[]
): RecipeFeatures {
  if (viewedRecipes.size === 0) {
    return {
      vegetarijanstvo: 0.5,
      težina: 0.5,
      brzina: 0.5,
      zdravlje: 0.5,
      slat_deserti: 0.5,
    };
  }

  let avgVegetarian = 0;
  let avgEasy = 0;
  let avgFast = 0;
  let avgHealthy = 0;
  let avgSweet = 0;
  let viewCount = 0;

  viewedRecipes.forEach((data, recipeId) => {
    const recipe = allRecipes.find(r => r.id === recipeId);
    if (!recipe) return;

    const weight = Math.min(data.views / 10, 1); // Veća težina za više pregleda

    const isVegetarian = recipe.kategorije.some(k =>
      ['vegetarijansko', 'vegan', 'bez mesa'].includes(k.toLowerCase())
    );
    const isSweetDessert = recipe.kategorije.some(k =>
      ['deserti', 'slatko', 'kolači'].includes(k.toLowerCase())
    );

    avgVegetarian += (isVegetarian ? 0.9 : 0.1) * weight;
    avgEasy += (recipe.jednostavnost >= 3 ? 0.8 : 0.3) * weight;
    avgFast += (recipe.vrijeme_kuhanja <= 30 ? 0.9 : recipe.vrijeme_kuhanja <= 60 ? 0.5 : 0.1) * weight;
    avgHealthy += (recipe.nutritivne_vrijednosti.kalorije < 500 ? 0.8 : 0.4) * weight;
    avgSweet += (isSweetDessert ? 0.9 : 0.1) * weight;

    viewCount += weight;
  });

  return {
    vegetarijanstvo: Math.min(avgVegetarian / viewCount, 1),
    težina: Math.min(avgEasy / viewCount, 1),
    brzina: Math.min(avgFast / viewCount, 1),
    zdravlje: Math.min(avgHealthy / viewCount, 1),
    slat_deserti: Math.min(avgSweet / viewCount, 1),
  };
}
