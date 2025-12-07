import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface IngredientListProps {
  sastojci: string[];
}

const IngredientList = ({ sastojci }: IngredientListProps) => {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const checkboxRefs = useRef<(SVGSVGElement | null)[]>([]);

  const toggleItem = (index: number) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedItems(newChecked);
  };

  useEffect(() => {
    checkboxRefs.current.forEach((svgEl, index) => {
      if (!svgEl) return;

      const svg = d3.select(svgEl);
      svg.selectAll("*").remove();

      const size = 24;
      const isChecked = checkedItems.has(index);

      svg.attr("width", size).attr("height", size);

      // Background circle
      svg
        .append("circle")
        .attr("cx", size / 2)
        .attr("cy", size / 2)
        .attr("r", size / 2 - 2)
        .attr("fill", isChecked ? "hsl(var(--primary))" : "transparent")
        .attr("stroke", isChecked ? "hsl(var(--primary))" : "hsl(var(--border))")
        .attr("stroke-width", 2)
        .style("cursor", "pointer")
        .transition()
        .duration(200);

      // Checkmark
      if (isChecked) {
        const checkPath = svg
          .append("path")
          .attr("d", "M6 12 L10 16 L18 8")
          .attr("fill", "none")
          .attr("stroke", "hsl(var(--primary-foreground))")
          .attr("stroke-width", 2.5)
          .attr("stroke-linecap", "round")
          .attr("stroke-linejoin", "round");

        // Animate checkmark
        const totalLength = (checkPath.node() as SVGPathElement)?.getTotalLength() || 20;
        checkPath
          .attr("stroke-dasharray", totalLength)
          .attr("stroke-dashoffset", totalLength)
          .transition()
          .duration(300)
          .ease(d3.easeBackOut)
          .attr("stroke-dashoffset", 0);
      }
    });
  }, [checkedItems, sastojci.length]);

  const checkedCount = checkedItems.size;
  const totalCount = sastojci.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl font-semibold">Sastojci</h3>
        <span className="font-ui text-sm text-muted-foreground">
          {checkedCount} / {totalCount} označeno
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
          style={{ width: `${(checkedCount / totalCount) * 100}%` }}
        />
      </div>

      <ul className="space-y-3">
        {sastojci.map((sastojak, index) => (
          <li
            key={index}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer
              ${checkedItems.has(index)
                ? "bg-primary/10 border-primary/30"
                : "bg-card border-border hover:border-primary/30 hover:bg-secondary/50"
              }`}
            onClick={() => toggleItem(index)}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <svg
              ref={(el) => (checkboxRefs.current[index] = el)}
              className="flex-shrink-0"
            />
            <span
              className={`font-body transition-all duration-200 ${
                checkedItems.has(index)
                  ? "text-muted-foreground line-through"
                  : "text-foreground"
              }`}
            >
              {sastojak}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IngredientList;
