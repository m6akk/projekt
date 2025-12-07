import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import Navigation from "@/components/Navigation";
import InteractiveFooter from "@/components/InteractiveFooter";

const galleryImages = [
  { id: 1, src: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop", title: "Čokoladni kolač", category: "deserti" },
  { id: 2, src: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&h=400&fit=crop", title: "Pasta Carbonara", category: "pasta" },
  { id: 3, src: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&h=400&fit=crop", title: "Rižot od gljiva", category: "rizoti" },
  { id: 4, src: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&h=400&fit=crop", title: "Pečena piletina", category: "meso" },
  { id: 5, src: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop", title: "Palačinke", category: "deserti" },
  { id: 6, src: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&h=400&fit=crop", title: "Tjestenina s pestom", category: "pasta" },
  { id: 7, src: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&h=400&fit=crop", title: "Cheesecake", category: "deserti" },
  { id: 8, src: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=400&fit=crop", title: "Pečeni losos", category: "riba" },
  { id: 9, src: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=400&fit=crop", title: "Brownies", category: "deserti" },
  { id: 10, src: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=600&h=400&fit=crop", title: "Gulaš", category: "meso" },
  { id: 11, src: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=400&fit=crop", title: "Mediteranska salata", category: "salate" },
  { id: 12, src: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=400&fit=crop", title: "Tiramisu", category: "deserti" },
];

const categories = ["sve", "deserti", "pasta", "meso", "riba", "salate", "rizoti"];

const Galerija = () => {
  const [activeCategory, setActiveCategory] = useState("sve");
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);
  const chartRef = useRef<SVGSVGElement>(null);

  const filteredImages = activeCategory === "sve" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

  // D3 category distribution chart
  useEffect(() => {
    if (!chartRef.current) return;

    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove();

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2 - 20;

    svg.attr("width", width).attr("height", height);

    const categoryCount = categories.slice(1).map(cat => ({
      category: cat,
      count: galleryImages.filter(img => img.category === cat).length
    }));

    const color = d3.scaleOrdinal<string>()
      .domain(categoryCount.map(d => d.category))
      .range(["hsl(210, 90%, 42%)", "hsl(210, 70%, 52%)", "hsl(48, 100%, 50%)", "hsl(48, 80%, 60%)", "hsl(145, 70%, 40%)", "hsl(180, 50%, 45%)"]);

    const pie = d3.pie<{ category: string; count: number }>()
      .value(d => d.count)
      .sort(null);

    const arc = d3.arc<d3.PieArcDatum<{ category: string; count: number }>>()
      .innerRadius(radius * 0.5)
      .outerRadius(radius);

    const g = svg.append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const arcs = g.selectAll(".arc")
      .data(pie(categoryCount))
      .enter()
      .append("g")
      .attr("class", "arc")
      .style("cursor", "pointer");

    arcs.append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.category))
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .on("mouseenter", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("transform", "scale(1.05)");
        setActiveCategory(d.data.category);
      })
      .on("mouseleave", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("transform", "scale(1)");
      })
      .on("click", function(event, d) {
        setActiveCategory(d.data.category);
      });

    arcs.append("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .attr("fill", "white")
      .attr("font-weight", "600")
      .text(d => d.data.count > 0 ? d.data.category : "");

    // Center text
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-0.2em")
      .attr("font-size", "24px")
      .attr("font-weight", "bold")
      .attr("fill", "hsl(210, 90%, 42%)")
      .text(galleryImages.length);

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.2em")
      .attr("font-size", "12px")
      .attr("fill", "hsl(0, 0%, 45%)")
      .text("recepata");

  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl text-primary mb-4" style={{ textShadow: '3px 3px 0px hsl(48 100% 50%), 5px 5px 0px hsl(215 35% 15% / 0.15)' }}>
            Galerija 📸
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Pregledajte našu kolekciju kulinarskih fotografija
          </p>
        </div>

        {/* D3 Chart and Filters */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-12">
          <svg ref={chartRef} className="overflow-visible" />
          
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-xl font-display text-sm uppercase tracking-wider border-[3px] transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary shadow-[3px_3px_0px_hsl(var(--foreground)/0.3)]"
                    : "bg-card text-foreground border-foreground/30 hover:border-primary hover:bg-secondary/30 hover:shadow-[3px_3px_0px_hsl(var(--primary)/0.3)]"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="relative group cartoon-card overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_hsl(var(--primary)/0.35)]"
              onMouseEnter={() => setHoveredImage(image.id)}
              onMouseLeave={() => setHoveredImage(null)}
              style={{
                transform: hoveredImage === image.id ? "scale(1.02)" : "scale(1)",
                transition: "transform 0.3s ease"
              }}
            >
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-56 object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent transition-opacity ${
                hoveredImage === image.id ? "opacity-100" : "opacity-0"
              }`}>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-display text-xl text-primary-foreground font-semibold">
                    {image.title}
                  </h3>
                  <span className="inline-block mt-2 px-3 py-1 bg-primary/90 text-primary-foreground text-xs rounded-full font-ui uppercase">
                    {image.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Interactive Footer */}
      <div className="mt-20" />
      <InteractiveFooter />
    </div>
  );
};

export default Galerija;