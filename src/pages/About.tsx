import { useEffect, useRef } from "react";
import * as d3 from "d3";
import Navigation from "@/components/Navigation";
import InteractiveFooter from "@/components/InteractiveFooter";
import { Heart, Users, ChefHat, Award } from "lucide-react";

const stats = [
  { icon: ChefHat, value: 12, label: "Recepata" },
  { icon: Users, value: 500, label: "Korisnika" },
  { icon: Heart, value: 1200, label: "Sviđanja" },
  { icon: Award, value: 50, label: "Nagrada" },
];

const About = () => {
  const timelineRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!timelineRef.current) return;

    const svg = d3.select(timelineRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 200;

    svg.attr("width", width).attr("height", height).attr("viewBox", `0 0 ${width} ${height}`);

    const milestones = [
      { year: 2022, event: "Početak projekta" },
      { year: 2023, event: "100 recepata" },
      { year: 2024, event: "Redizajn" },
      { year: 2025, event: "Nova verzija" },
    ];

    const xScale = d3.scaleLinear()
      .domain([2022, 2025])
      .range([50, width - 50]);

    // Timeline line
    svg.append("line")
      .attr("x1", 50)
      .attr("y1", 100)
      .attr("x2", width - 50)
      .attr("y2", 100)
      .attr("stroke", "hsl(210, 90%, 42%)")
      .attr("stroke-width", 3)
      .attr("stroke-linecap", "round");

    // Milestone dots and labels
    const milestoneGroups = svg.selectAll(".milestone")
      .data(milestones)
      .enter()
      .append("g")
      .attr("class", "milestone")
      .attr("transform", d => `translate(${xScale(d.year)}, 100)`);

    milestoneGroups.append("circle")
      .attr("r", 0)
      .attr("fill", "hsl(210, 90%, 42%)")
      .attr("stroke", "white")
      .attr("stroke-width", 3)
      .transition()
      .delay((d, i) => i * 200)
      .duration(500)
      .attr("r", 12);

    milestoneGroups.append("text")
      .attr("y", -25)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "600")
      .attr("fill", "hsl(0, 0%, 10%)")
      .text(d => d.year)
      .attr("opacity", 0)
      .transition()
      .delay((d, i) => i * 200 + 300)
      .duration(300)
      .attr("opacity", 1);

    milestoneGroups.append("text")
      .attr("y", 35)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "hsl(0, 0%, 45%)")
      .text(d => d.event)
      .attr("opacity", 0)
      .transition()
      .delay((d, i) => i * 200 + 300)
      .duration(300)
      .attr("opacity", 1);

  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            O nama
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Dobrodošli na Dijabeto - vašu destinaciju za ukusne recepte
          </p>
        </div>

        {/* Story */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
              Naša priča
            </h2>
            <p className="font-body text-foreground/80 leading-relaxed mb-4">
              Dijabeto je nastao iz ljubavi prema hrani i želje da podijelimo najbolje recepte 
              s vama. Naš tim strastvenih kuhara i food entuzijasta prikuplja, testira i 
              dijeli recepte koji će oduševiti vaše nepce.
            </p>
            <p className="font-body text-foreground/80 leading-relaxed">
              Vjerujemo da dobra hrana povezuje ljude. Svaki recept na našoj stranici je 
              pažljivo odabran i testiran kako bismo vam omogućili da kod kuće pripremite 
              jela restorananske kvalitete.
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex justify-center mb-16 overflow-x-auto">
          <svg ref={timelineRef} className="max-w-full" style={{ minWidth: "300px" }} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-border rounded-xl p-6 text-center shadow-soft card-hover"
            >
              <stat.icon className="w-10 h-10 mx-auto mb-3 text-primary" />
              <p className="font-display text-3xl font-bold text-primary">{stat.value}+</p>
              <p className="font-ui text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl font-semibold text-center mb-8">
            Naše vrijednosti
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Kvaliteta", desc: "Samo provjereni i testirani recepti dolaze na našu stranicu." },
              { title: "Jednostavnost", desc: "Recepti prilagođeni svima, od početnika do profesionalaca." },
              { title: "Zajednica", desc: "Gradimo zajednicu ljubitelja hrane koji dijele iskustva." },
            ].map((value) => (
              <div key={value.title} className="bg-secondary/50 rounded-xl p-6 text-center">
                <h3 className="font-display text-xl font-semibold text-primary mb-2">
                  {value.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Interactive Footer */}
      <div className="mt-20" />
      <InteractiveFooter />
    </div>
  );
};

export default About;