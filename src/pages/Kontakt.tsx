import { useState, useRef, useEffect } from "react";
import * as d3 from "d3";
import Navigation from "@/components/Navigation";
import InteractiveFooter from "@/components/InteractiveFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const Kontakt = () => {
  const [formData, setFormData] = useState({ ime: "", email: "", poruka: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const decorRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!decorRef.current) return;

    const svg = d3.select(decorRef.current);
    svg.selectAll("*").remove();

    const width = 200;
    const height = 200;

    svg.attr("width", width).attr("height", height);

    // Create decorative circles
    const circles = [
      { cx: 100, cy: 100, r: 80, color: "hsl(210, 90%, 42%)", opacity: 0.1 },
      { cx: 100, cy: 100, r: 60, color: "hsl(210, 90%, 42%)", opacity: 0.15 },
      { cx: 100, cy: 100, r: 40, color: "hsl(210, 90%, 42%)", opacity: 0.2 },
    ];

    svg.selectAll("circle")
      .data(circles)
      .enter()
      .append("circle")
      .attr("cx", d => d.cx)
      .attr("cy", d => d.cy)
      .attr("r", 0)
      .attr("fill", d => d.color)
      .attr("opacity", d => d.opacity)
      .transition()
      .delay((d, i) => i * 150)
      .duration(600)
      .attr("r", d => d.r);

    // Envelope icon in center
    svg.append("text")
      .attr("x", 100)
      .attr("y", 110)
      .attr("text-anchor", "middle")
      .attr("font-size", "40px")
      .attr("fill", "hsl(210, 90%, 42%)")
      .text("✉")
      .attr("opacity", 0)
      .transition()
      .delay(500)
      .duration(400)
      .attr("opacity", 1);

  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ime || !formData.email || !formData.poruka) {
      toast.error("Molimo ispunite sva polja");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Poruka uspješno poslana!", {
        description: "Javit ćemo vam se u najkraćem roku.",
        icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      });
      setFormData({ ime: "", email: "", poruka: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Kontaktirajte nas
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Imate pitanje ili prijedlog? Javite nam se!
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <div className="flex justify-center mb-8">
              <svg ref={decorRef} />
            </div>

            <div className="space-y-6">
              {[
                { icon: Mail, label: "Email", value: "info@dijabeto.hr" },
                { icon: Phone, label: "Telefon", value: "+385 1 234 5678" },
                { icon: MapPin, label: "Adresa", value: "Zagreb, Hrvatska" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-ui text-sm text-muted-foreground">{item.label}</p>
                    <p className="font-body font-medium text-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
            <h2 className="font-display text-2xl font-semibold mb-6">Pošaljite poruku</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="font-ui text-sm font-medium text-foreground mb-2 block">
                  Vaše ime
                </label>
                <Input
                  value={formData.ime}
                  onChange={(e) => setFormData({ ...formData, ime: e.target.value })}
                  placeholder="Unesite ime"
                  className="font-ui"
                />
              </div>

              <div>
                <label className="font-ui text-sm font-medium text-foreground mb-2 block">
                  Email adresa
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="vas@email.com"
                  className="font-ui"
                />
              </div>

              <div>
                <label className="font-ui text-sm font-medium text-foreground mb-2 block">
                  Poruka
                </label>
                <Textarea
                  value={formData.poruka}
                  onChange={(e) => setFormData({ ...formData, poruka: e.target.value })}
                  placeholder="Napišite svoju poruku..."
                  rows={5}
                  className="font-body resize-none"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Šaljem..." : "Pošalji poruku"}
              </Button>
            </form>
          </div>
        </div>
      </main>

      {/* Interactive Footer */}
      <div className="mt-20" />
      <InteractiveFooter />
    </div>
  );
};

export default Kontakt;