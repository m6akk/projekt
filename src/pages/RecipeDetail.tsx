import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Recipe } from "@/data/recipes";
import { getStoredRecipes, updateStoredRecipe } from "@/hooks/useRecipeStorage";
import Navigation from "@/components/Navigation";
import InteractiveFooter from "@/components/InteractiveFooter";
import StarRating from "@/components/StarRating";
import NutritionChart from "@/components/NutritionChart";
import IngredientList from "@/components/IngredientList";
import CommentSection from "@/components/CommentSection";
import RecipeRecommendationCards from "@/components/RecipeRecommendationCards";
import { Clock, ChefHat, Users, Calendar, ArrowLeft, Leaf, Wheat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { generateSimilarRecipeRecommendations } from "@/utils/recommendations";

// Recipe images mapping
const recipeImages: Record<number, string> = {
  1: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=500&fit=crop",
  2: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&h=500&fit=crop",
  3: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&h=500&fit=crop",
  4: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&h=500&fit=crop",
  5: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=500&fit=crop",
  6: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&h=500&fit=crop",
  7: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&h=500&fit=crop",
  8: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=500&fit=crop",
  9: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=500&fit=crop",
  10: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800&h=500&fit=crop",
  11: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=500&fit=crop",
  12: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&h=500&fit=crop",
};

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recommendations, setRecommendations] = useState<Array<Recipe & { similarity: number }>>([]);

  useEffect(() => {
    if (id) {
      const recipes = getStoredRecipes();
      const foundRecipe = recipes.find(r => r.id === parseInt(id));
      if (foundRecipe) {
        setRecipe({ ...foundRecipe });
        
        // Generate similar recipe recommendations
        const similar = generateSimilarRecipeRecommendations(foundRecipe, recipes, 3);
        setRecommendations(similar);
      }
    }
  }, [id]);

  const handleRate = (rating: number) => {
    if (recipe) {
      const updatedRecipe = {
        ...recipe,
        ocjene: [...recipe.ocjene, rating],
      };
      setRecipe(updatedRecipe);
      updateStoredRecipe(updatedRecipe);
    }
  };

  const handleAddComment = (comment: { autor: string; tekst: string; datum: string }) => {
    if (recipe) {
      const updatedRecipe = {
        ...recipe,
        komentari: [...recipe.komentari, comment],
      };
      setRecipe(updatedRecipe);
      updateStoredRecipe(updatedRecipe);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("hr-HR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-2xl text-foreground">Recept nije pronađen</h1>
          <Link to="/recepti" className="text-primary hover:underline mt-4 inline-block">
            Povratak na recepte
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back button */}
        <Link
          to="/recepti"
          className="inline-flex items-center gap-2 font-ui text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Povratak na recepte
        </Link>

        {/* Hero Image */}
        <div className="relative rounded-2xl overflow-hidden mb-8 shadow-elevated">
          <img
            src={recipeImages[recipe.id] || recipeImages[1]}
            alt={recipe.ime}
            className="w-full h-64 md:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
          
          {/* Date badge */}
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="font-ui text-xs backdrop-blur-sm bg-background/80">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(recipe.datum_objave)}
            </Badge>
          </div>

          {/* Dietary badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {recipe.vegan && (
              <Badge className="bg-chart-carb text-primary-foreground font-ui text-xs">
                <Leaf className="w-3 h-3 mr-1" />
                Vegan
              </Badge>
            )}
            {recipe.gluten_free && (
              <Badge className="bg-chart-protein text-primary-foreground font-ui text-xs">
                <Wheat className="w-3 h-3 mr-1" />
                Bez glutena
              </Badge>
            )}
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground drop-shadow-lg">
              {recipe.ime}
            </h1>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {recipe.kategorije.map((kategorija) => (
            <Badge key={kategorija} variant="outline" className="font-ui capitalize">
              {kategorija}
            </Badge>
          ))}
        </div>

        {/* Star Rating */}
        <div className="flex justify-center mb-8">
          <StarRating ocjene={recipe.ocjene} onRate={handleRate} />
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Clock, label: "Priprema", value: `${recipe.vrijeme_pripreme} min` },
            { icon: ChefHat, label: "Kuhanje", value: `${recipe.vrijeme_kuhanja} min` },
            { icon: Users, label: "Porcija", value: recipe.broj_serviranja.toString() },
            { icon: Clock, label: "Ukupno", value: `${recipe.vrijeme_pripreme + recipe.vrijeme_kuhanja} min` },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-card border border-border rounded-xl p-4 text-center card-hover"
            >
              <item.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="font-ui text-xs text-muted-foreground">{item.label}</p>
              <p className="font-display text-lg font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Nutrition Chart */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8 shadow-soft">
          <h3 className="font-display text-xl font-semibold mb-4 text-center">Nutritivne vrijednosti</h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <NutritionChart
              masti={recipe.nutritivne_vrijednosti.masti}
              ugljikohidrati={recipe.nutritivne_vrijednosti.ugljikohidrati}
              proteini={recipe.nutritivne_vrijednosti.proteini}
            />
            <div className="text-center md:text-left">
              <p className="font-display text-3xl font-bold text-primary">
                {recipe.nutritivne_vrijednosti.kalorije}
              </p>
              <p className="font-ui text-sm text-muted-foreground">kcal po porciji</p>
            </div>
          </div>
        </div>

        {/* Two column layout for ingredients and preparation */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Ingredients */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-soft">
            <IngredientList sastojci={recipe.sastojci} />
          </div>

          {/* Preparation */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-soft">
            <h3 className="font-display text-xl font-semibold mb-4">Priprema</h3>
            <div className="space-y-4">
              {recipe.priprema.split("\n").map((step, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-ui text-sm font-semibold text-primary">
                      {index + 1}
                    </span>
                  </div>
                  <p className="font-body text-foreground/90 pt-0.5">
                    {step.replace(/^\d+\.\s*/, "")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-soft mb-12">
          <CommentSection komentari={recipe.komentari} onAddComment={handleAddComment} />
        </div>

        {/* Recommendations removed per request - no user-level recommendations shown on recipe detail */}
      </main>

      {/* Interactive Footer */}
      <div className="mt-20" />
      <InteractiveFooter />
    </div>
  );
};

export default RecipeDetail;