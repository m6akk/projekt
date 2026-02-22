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
 * Dohvaća korisnički profil na temelju pregledanih recepata iz localStorage
 */
export function getUserProfileFromHistory(): RecipeFeatures {
  try {
    const history = JSON.parse(localStorage.getItem('recipe_view_history') || '[]');
    
    if (!history.length) {
      return {
        vegetarijanstvo: 0.5,
        težina: 0.5,
        brzina: 0.5,
        zdravlje: 0.5,
        slat_deserti: 0.5,
      };
    }

    // Prosječno svojstva pregleda recepti
    const avg = {
      vegetarijanstvo: 0,
      težina: 0,
      brzina: 0,
      zdravlje: 0,
      slat_deserti: 0,
    };

    history.forEach((recipeId: number) => {
      // U stvarnoj aplikaciji, trebao bi pristup recipe objektu
      // Za sada, koristi se srednja vrijednost
    });

    return {
      vegetarijanstvo: Math.min(avg.vegetarijanstvo / history.length || 0.5, 1),
      težina: Math.min(avg.težina / history.length || 0.5, 1),
      brzina: Math.min(avg.brzina / history.length || 0.5, 1),
      zdravlje: Math.min(avg.zdravlje / history.length || 0.5, 1),
      slat_deserti: Math.min(avg.slat_deserti / history.length || 0.5, 1),
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return {
      vegetarijanstvo: 0.5,
      težina: 0.5,
      brzina: 0.5,
      zdravlje: 0.5,
      slat_deserti: 0.5,
    };
  }
}

/**
 * Generiraj preporuke za recept slične destinaciji (ili zasebno ako je za analytics)
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
 * Generiraj preporuke temeljene na korisniku
 */
export function generateUserBasedRecommendations(
  allRecipes: Recipe[],
  limit: number = 3
): Array<Recipe & { similarity: number }> {
  const userProfile = getUserProfileFromHistory();

  const recommendations = allRecipes
    .map((r) => ({
      ...r,
      similarity: cosineSimilarity(userProfile, getRecipeFeatures(r)),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);

  return recommendations;
}
