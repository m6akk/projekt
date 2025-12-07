import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Recipe } from "@/data/recipes";
import { getStoredRecipes } from "@/hooks/useRecipeStorage";
import Navigation from "@/components/Navigation";
import AnimatedBackground from "@/components/AnimatedBackground";
import InteractiveFooter from "@/components/InteractiveFooter";
import { ArrowRight, Clock, Users, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const Index = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [circles, setCircles] = useState<Array<{id: number, x: number, y: number, vx: number, vy: number, size: number, color: string, borderColor: string}>>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setRecipes(getStoredRecipes());
  }, []);

  // Initialize animated circles
  useEffect(() => {
    const initialCircles = [
      { id: 1, x: 80, y: 60, vx: 0.3, vy: 0.2, size: 80, color: 'bg-secondary/40', borderColor: 'border-primary/30' },
      { id: 2, x: 200, y: 150, vx: -0.25, vy: -0.35, size: 128, color: 'bg-primary/20', borderColor: 'border-secondary/50' },
      { id: 3, x: 280, y: 120, vx: 0.2, vy: -0.3, size: 48, color: 'bg-secondary/50', borderColor: 'border-foreground/20' },
      { id: 4, x: 220, y: 80, vx: -0.35, vy: 0.25, size: 64, color: 'bg-yellow-300/30', borderColor: 'border-yellow-500/40' },
      { id: 5, x: 100, y: 220, vx: 0.3, vy: 0.25, size: 96, color: 'bg-red-300/20', borderColor: 'border-red-400/40' },
      { id: 6, x: 300, y: 180, vx: -0.28, vy: -0.2, size: 56, color: 'bg-green-300/30', borderColor: 'border-green-500/40' },
    ];
    setCircles(initialCircles);

    let animationId: number;
    const animate = () => {
      setCircles(prev => prev.map(circle => {
        let newX = circle.x + circle.vx;
        let newY = circle.y + circle.vy;
        let newVx = circle.vx;
        let newVy = circle.vy;

        // Get section dimensions
        const section = sectionRef.current;
        if (section) {
          const heroWidth = section.clientWidth;
          const heroHeight = section.clientHeight;

          // Bounce off edges
          if (newX - circle.size/2 <= 0 || newX + circle.size/2 >= heroWidth) newVx = -newVx;
          if (newY - circle.size/2 <= 0 || newY + circle.size/2 >= heroHeight) newVy = -newVy;

          newX = Math.max(circle.size/2, Math.min(heroWidth - circle.size/2, newX));
          newY = Math.max(circle.size/2, Math.min(heroHeight - circle.size/2, newY));
        }

        return {
          ...circle,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
        };
      }));

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const featuredRecipes = recipes.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <AnimatedBackground variant="full" />
      <Navigation />

      {/* Hero Section - Cartoon style */}
      <section className="relative overflow-hidden py-24 md:py-36" ref={sectionRef}>
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 via-background to-primary/10" />
        
        {/* Dynamically animated circles */}
        {circles.map(circle => (
          <div
            key={circle.id}
            className={`absolute ${circle.color} rounded-full border-[4px] ${circle.borderColor} pointer-events-none`}
            style={{
              width: `${circle.size}px`,
              height: `${circle.size}px`,
              transform: `translate(${circle.x - circle.size/2}px, ${circle.y - circle.size/2}px)`,
              willChange: 'transform',
            }}
          />
        ))}
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block">
              <h1 
                className="font-logo text-5xl md:text-7xl leading-tight"
                style={{
                  color: 'hsl(var(--primary))',
                  textShadow: '3px 3px 0px hsl(var(--secondary)), 5px 5px 0px hsl(var(--foreground) / 0.2)',
                }}
              >
                DIJABETOVA
              </h1>
              <h2 
                className="font-logo text-4xl md:text-6xl -mt-2"
                style={{
                  color: 'hsl(var(--secondary))',
                  textShadow: '2px 2px 0px hsl(var(--primary)), 4px 4px 0px hsl(var(--foreground) / 0.2)',
                }}
              >
                KUHARICA
              </h2>
            </div>
            <p className="font-body text-xl md:text-2xl text-foreground/80 mb-10 max-w-xl mx-auto mt-8">
              Otkrijte svijet okusa s našom kolekcijom provjerenih recepata!
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Button asChild size="lg" className="cartoon-button bg-primary text-primary-foreground text-lg px-8 py-6">
                <Link to="/recepti">
                  Pregledaj recepte
                  <ArrowRight className="ml-2 w-6 h-6" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats - Cartoon cards */}
      <section className="py-14 border-y-[4px] border-primary bg-gradient-to-r from-secondary/40 via-primary/10 to-secondary/40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: ChefHat, value: recipes.length || 12, label: "Recepata", emoji: "👨‍🍳" },
              { icon: Clock, value: "15+", label: "Min. priprema", emoji: "⏱️" },
              { icon: Users, value: "1000+", label: "Korisnika", emoji: "👥" },
            ].map((stat) => (
              <div key={stat.label} className="text-center bg-card p-5 rounded-2xl border-[3px] border-primary/40 shadow-[4px_4px_0px_hsl(var(--primary)/0.25)]">
                <p className="text-3xl mb-2">{stat.emoji}</p>
                <p className="font-display text-3xl md:text-4xl text-primary">{stat.value}</p>
                <p className="font-body text-base text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Recipes - Cartoon cards */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl md:text-5xl text-primary mb-4" style={{ textShadow: '3px 3px 0px hsl(48 100% 50%), 5px 5px 0px hsl(215 35% 15% / 0.15)' }}>
              Popularni Recepti ⭐
            </h2>
            <p className="font-body text-xl text-muted-foreground">
              Naši najomiljeniji recepti koje morate probati!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {featuredRecipes.map((recipe) => (
              <Link
                key={recipe.id}
                to={`/recept/${recipe.id}`}
                className="group cartoon-card overflow-hidden transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_hsl(var(--primary)/0.35)]"
              >
                <div className="relative h-52 overflow-hidden border-b-[3px] border-primary/40">
                  <img
                    src={recipeImages[recipe.id]}
                    alt={recipe.ime}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
                </div>
                <div className="p-5 bg-gradient-to-b from-card to-secondary/20">
                  <h3 className="font-display text-2xl text-foreground group-hover:text-primary transition-colors">
                    {recipe.ime}
                  </h3>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-lg border-[2px] border-primary/30">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="font-body text-base font-bold text-foreground">
                        {recipe.vrijeme_pripreme + recipe.vrijeme_kuhanja} min
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="cartoon-button bg-secondary text-foreground text-lg px-8 py-6 border-primary/50">
              <Link to="/recepti">
                Vidi sve recepte 📖
                <ArrowRight className="ml-2 w-6 h-6" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Interactive Footer */}
      <div className="mt-20" />
      <InteractiveFooter />
    </div>
  );
};

export default Index;