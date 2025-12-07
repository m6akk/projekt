import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface NutritionChartProps {
  masti: number;
  ugljikohidrati: number;
  proteini: number;
}

const NutritionChart = ({ masti, ugljikohidrati, proteini }: NutritionChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 220;
    const height = 220;
    const radius = Math.min(width, height) / 2 - 20;

    svg.attr("width", width).attr("height", height);

    const g = svg.append("g").attr("transform", `translate(${width / 2}, ${height / 2})`);

    const total = masti + ugljikohidrati + proteini;
    const data = [
      { label: "Masti", value: masti, color: "hsl(var(--chart-fat))", percent: ((masti / total) * 100).toFixed(1) },
      { label: "Ugljikohidrati", value: ugljikohidrati, color: "hsl(var(--chart-carb))", percent: ((ugljikohidrati / total) * 100).toFixed(1) },
      { label: "Proteini", value: proteini, color: "hsl(var(--chart-protein))", percent: ((proteini / total) * 100).toFixed(1) },
    ];

    const pie = d3.pie<typeof data[0]>()
      .value((d) => d.value)
      .sort(null)
      .padAngle(0.03);

    const arc = d3.arc<d3.PieArcDatum<typeof data[0]>>()
      .innerRadius(radius * 0.5)
      .outerRadius(radius);

    const arcHover = d3.arc<d3.PieArcDatum<typeof data[0]>>()
      .innerRadius(radius * 0.5)
      .outerRadius(radius + 8);

    // Draw slices
    const slices = g
      .selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => d.data.color)
      .attr("stroke", "hsl(var(--background))")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .style("opacity", 0)
      .transition()
      .duration(800)
      .delay((d, i) => i * 200)
      .style("opacity", 1)
      .attrTween("d", function (d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return (t) => arc(interpolate(t)) || "";
      });

    // Add hover effects after animation
    setTimeout(() => {
      g.selectAll("path")
        .on("mouseenter", function (event, d: any) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("d", arcHover(d));

          if (tooltipRef.current) {
            tooltipRef.current.style.opacity = "1";
            tooltipRef.current.innerHTML = `
              <div class="font-semibold">${d.data.label}</div>
              <div>${d.data.value}g (${d.data.percent}%)</div>
            `;
          }
        })
        .on("mouseleave", function (event, d: any) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("d", arc(d));

          if (tooltipRef.current) {
            tooltipRef.current.style.opacity = "0";
          }
        });
    }, 1400);

    // Center text
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-0.2em")
      .attr("class", "font-display text-lg")
      .attr("fill", "hsl(var(--foreground))")
      .text(`${total}g`);

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.2em")
      .attr("class", "font-ui text-xs")
      .attr("fill", "hsl(var(--muted-foreground))")
      .text("ukupno");

  }, [masti, ugljikohidrati, proteini]);

  return (
    <div className="relative flex flex-col items-center">
      <svg ref={svgRef} />
      <div
        ref={tooltipRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none
          bg-card border border-border rounded-lg px-3 py-2 text-sm shadow-card opacity-0 transition-opacity font-ui text-center"
      />
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-chart-fat" />
          <span className="font-ui text-sm text-muted-foreground">Masti</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-chart-carb" />
          <span className="font-ui text-sm text-muted-foreground">Ugljikohidrati</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-chart-protein" />
          <span className="font-ui text-sm text-muted-foreground">Proteini</span>
        </div>
      </div>
    </div>
  );
};

export default NutritionChart;
