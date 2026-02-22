import React from 'react';
import { Recipe } from '@/data/recipes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface RecipeRecommendationCardsProps {
  recommendations: Array<Recipe & { similarity: number }>;
  showBadge?: boolean;
  showSimilarity?: boolean;
}

const RecipeRecommendationCards: React.FC<RecipeRecommendationCardsProps> = ({
  recommendations,
  showBadge = true,
  showSimilarity = true
}) => {
  if (recommendations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        <p>Nema dostupnih preporuka u ovom trenutku.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-display font-bold text-primary mb-6">
        Slični recepti
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((recipe, index) => {
          const avgRating = recipe.ocjene.length > 0
            ? (recipe.ocjene.reduce((a, b) => a + b, 0) / recipe.ocjene.length).toFixed(1)
            : 'N/A';

          const similarityPercent = Math.round(recipe.similarity * 100);

          return (
            <Link
              key={recipe.id}
              to={`/recept/${recipe.id}`}
              className="no-underline hover:no-underline"
            >
              <Card className="h-full hover:shadow-lg transition-all duration-200 border-[3px] border-primary/20 cursor-pointer">
                {/* Image */}
                <img
                  src={recipe.slika || (`https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=500&fit=crop&auto=format&q=60&ixlib=rb-${(recipe.id%10)+1}`)}
                  alt={recipe.ime}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    {showBadge && (
                      <Badge className="bg-accent text-accent-foreground">
                        #{index + 1} Preporuka
                      </Badge>
                    )}
                    {showSimilarity && (
                      <span className="text-xs font-bold text-primary">
                        {similarityPercent}% podudaranja
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-lg">{recipe.ime}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Kategorije */}
                    <div className="flex flex-wrap gap-1">
                      {recipe.kategorije.slice(0, 2).map((kat) => (
                        <Badge
                          key={kat}
                          variant="outline"
                          className="text-xs bg-secondary/30"
                        >
                          {kat}
                        </Badge>
                      ))}
                    </div>

                    {/* Info */}
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <strong>Vrijeme:</strong> {recipe.vrijeme_kuhanja} min
                      </p>
                      <p>
                        <strong>Jednostavnost:</strong> {recipe.jednostavnost}/5
                      </p>
                      <p>
                        <strong>Kalorije:</strong> {recipe.nutritivne_vrijednosti.kalorije}
                        kcal
                      </p>
                      <p>
                        <strong>Ocjena:</strong> {avgRating}/5 ({recipe.ocjene.length}{' '}
                        ocjena)
                      </p>
                    </div>

                    {/* Oznake */}
                    <div className="flex gap-2">
                      {recipe.vegan && (
                        <Badge variant="outline" className="text-xs bg-green-100">
                          🌱 Vegan
                        </Badge>
                      )}
                      {recipe.gluten_free && (
                        <Badge variant="outline" className="text-xs bg-yellow-100">
                          🌾 Bez glutena
                        </Badge>
                      )}
                    </div>

                    {/* CTA Button */}
                    <button className="w-full mt-3 cartoon-button bg-primary text-primary-foreground py-2 rounded">
                      Vidi recept →
                    </button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RecipeRecommendationCards;
