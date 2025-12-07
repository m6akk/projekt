import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Recipe } from "@/data/recipes";
import { getStoredRecipes } from "@/hooks/useRecipeStorage";
import Navigation from "@/components/Navigation";
import InteractiveFooter from "@/components/InteractiveFooter";
import { Clock, Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const recipeImages: Record<number, string> = {
  1: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
  2: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop",
  3: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop",
  4: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop",
  5: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
  6: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&h=300&fit=crop",
  7: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop",
  8: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
  9: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop",
  10: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400&h=300&fit=crop",
  11: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop",
  12: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop",
};

const Recepti = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    setRecipes(getStoredRecipes());
  }, []);

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.ime.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.kategorije.some((k) => k.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getAverageRating = (ocjene: number[]) => {
    if (ocjene.length === 0) return 0;
    return ocjene.reduce((a, b) => a + b, 0) / ocjene.length;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-10">
        {/* Header - Cartoon style */}
        <div className="text-center mb-14">
          <h1 className="font-display text-5xl md:text-6xl text-primary mb-4" style={{ textShadow: '3px 3px 0px hsl(48 100% 50%), 5px 5px 0px hsl(215 35% 15% / 0.2)' }}>
            Naši Recepti
          </h1>
          <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto">
            Pronađite savršeni recept za svaku priliku! 🍳
          </p>
        </div>

        {/* Search - Cartoon style */}
        <div className="max-w-md mx-auto mb-14">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
            <Input
              type="text"
              placeholder="Pretraži recepte..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-6 font-body text-lg border-[3px] border-primary/50 rounded-2xl focus:border-primary bg-card shadow-[4px_4px_0px_hsl(var(--primary)/0.2)]"
            />
          </div>
        </div>

        {/* Recipe Grid - Cartoon cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecipes.map((recipe) => (
            <Link
              key={recipe.id}
              to={`/recept/${recipe.id}`}
              className="group cartoon-card overflow-hidden transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_hsl(var(--primary)/0.35)]"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden border-b-[3px] border-primary/40">
                <img
                  src={recipeImages[recipe.id]}
                  alt={recipe.ime}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
                
                {/* Rating - Cartoon badge */}
                {recipe.ocjene.length > 0 && (
                  <div className="absolute top-3 right-3 bg-secondary border-[2px] border-foreground/50 rounded-xl px-3 py-1.5 flex items-center gap-1.5 shadow-[2px_2px_0px_hsl(var(--foreground)/0.3)]">
                    <span className="text-xl">⭐</span>
                    <span className="font-display text-lg text-foreground">
                      {getAverageRating(recipe.ocjene).toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 bg-gradient-to-b from-card to-secondary/20">
                <h3 className="font-display text-2xl text-foreground mb-3 group-hover:text-primary transition-colors">
                  {recipe.ime}
                </h3>

                {/* Categories - Cartoon badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe.kategorije.slice(0, 2).map((kategorija) => (
                    <Badge 
                      key={kategorija} 
                      variant="secondary" 
                      className="font-body text-sm capitalize border-[2px] border-foreground/30 rounded-lg px-3 py-1"
                    >
                      {kategorija}
                    </Badge>
                  ))}
                </div>

                {/* Info */}
                <div className="flex items-center gap-5 text-muted-foreground">
                  <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-lg border-[2px] border-primary/30">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="font-body text-base font-bold">
                      {recipe.vrijeme_pripreme + recipe.vrijeme_kuhanja} min
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-lg border-[2px] border-secondary/50">
                    <Users className="w-5 h-5 text-foreground" />
                    <span className="font-body text-base font-bold">{recipe.broj_serviranja}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-16">
            <p className="font-display text-2xl text-muted-foreground">Nema pronađenih recepata! 😢</p>
          </div>
        )}
      </main>

      {/* Interactive Footer */}
      <div className="mt-20" />
      <InteractiveFooter />
    </div>
  );
};

export default Recepti;