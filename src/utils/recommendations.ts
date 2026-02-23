import { Recipe } from '@/data/recipes';

// Recipe feature vectors: [vegetarijanstvo, teško, brzo, zdrava_prehrana, popularne_kategorije]
export interface RecipeFeatures {
  vegetarijanstvo: number;      // 0-1: vegetarijanski/vegan recepti
  težina: number;                // 0-1: jednostavnost (1=jednostavno, 0=teško)
  brzina: number;                // 0-1: brz recepti (vrijeme_kuhanja <= 30 min)
  zdravlje: number;              // 0-1: kalorije < 500, bolji nutrienti
  slat_deserti: number;          // 0-1: ako je desert
}

/**
 * Izračunava feature vektor za recept
 */
export function getRecipeFeatures(recipe: Recipe): RecipeFeatures {
  const isVegetarian = recipe.kategorije.some(k =>
    ['vegetarijansko', 'vegan', 'bez mesa'].includes(k.toLowerCase())
  );

  const isSweetDessert = recipe.kategorije.some(k =>
    ['deserti', 'slatko', 'kolači'].includes(k.toLowerCase())
  );

  return {
    vegetarijanstvo: isVegetarian ? 0.9 : 0.1,
    težina: recipe.jednostavnost >= 3 ? 0.8 : 0.3,
    brzina: recipe.vrijeme_kuhanja <= 30 ? 0.9 : recipe.vrijeme_kuhanja <= 60 ? 0.5 : 0.1,
    zdravlje: recipe.nutritivne_vrijednosti.kalorije < 500 ? 0.8 : 0.4,
    slat_deserti: isSweetDessert ? 0.9 : 0.1,
  };
}

/**
 * Izračunava cosine similarity između dva vektora
 */
export function cosineSimilarity(vecA: RecipeFeatures, vecB: RecipeFeatures): number {
  const values = (v: RecipeFeatures) => [v.vegetarijanstvo, v.težina, v.brzina, v.zdravlje, v.slat_deserti];
  const vA = values(vecA);
  const vB = values(vecB);

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vA.length; i++) {
    dotProduct += vA[i] * vB[i];
    normA += vA[i] * vA[i];
    normB += vB[i] * vB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Generiraj preporuke za slične recepte (content-based / recipe-to-recipe)
 * Uspoređuje karakteristike trenutnog recepta s drugim receptima
 */
export function generateSimilarRecipeRecommendations(
  recipe: Recipe,
  allRecipes: Recipe[],
  limit: number = 3
): Array<Recipe & { similarity: number }> {
  const currentRecipeFeatures = getRecipeFeatures(recipe);

  const recommendations = allRecipes
    .filter((r) => r.id !== recipe.id) // Isključi trenutni recept
    .map((r) => ({
      ...r,
      similarity: cosineSimilarity(currentRecipeFeatures, getRecipeFeatures(r)),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);

  return recommendations;
}


/**
 * Generiraj preporuke temeljene na GA4 korisnički profil - SAMO Google Analytics podaci
 * @param userProfile - RecipeFeatures profil generiran iz GA4 podataka
 * @param allRecipes - Svi dostupni recepti
 * @param limit - Broj preporuka
 */
export function generateUserBasedRecommendations(
  userProfile: RecipeFeatures,
  allRecipes: Recipe[],
  limit: number = 3
): Array<Recipe & { similarity: number }> {
  const recommendations = allRecipes
    .map((r) => ({
      ...r,
      similarity: cosineSimilarity(userProfile, getRecipeFeatures(r)),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);

  return recommendations;
}

/**
 * Generiraj preporuke temeljene na GA4 profilu, ali isključi već pregledane recepte
 * @param userProfile - RecipeFeatures profil generiran iz GA4 podataka
 * @param allRecipes - Svi dostupni recepti
 * @param viewedRecipeIds - Set ID-eva koji su već pregledani (iz GA4)
 * @param limit - Broj preporuka
 */
export function generateUserBasedRecommendationsExcludingViewed(
  userProfile: RecipeFeatures,
  allRecipes: Recipe[],
  viewedRecipeIds: Set<number>,
  limit: number = 6
): Array<Recipe & { similarity: number }> {
  const recommendations = allRecipes
    .filter((r) => !viewedRecipeIds.has(r.id)) // Isključi pregledane
    .map((r) => ({
      ...r,
      similarity: cosineSimilarity(userProfile, getRecipeFeatures(r)),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);

  return recommendations;
}
