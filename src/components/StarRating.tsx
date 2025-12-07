import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface StarRatingProps {
  ocjene: number[];
  onRate: (rating: number) => void;
}

const StarRating = ({ ocjene, onRate }: StarRatingProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const averageRating = ocjene.length > 0 
    ? ocjene.reduce((a, b) => a + b, 0) / ocjene.length 
    : 0;

  const displayRating = hoverRating !== null ? hoverRating : averageRating;

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 200;
    const height = 40;
    const starSize = 32;
    const padding = 6;

    svg.attr("width", width).attr("height", height);

    // Star path
    const starPath = d3.symbol().type(d3.symbolStar).size(starSize * 12);

    // Create star groups
    const stars = svg
      .selectAll("g.star")
      .data([1, 2, 3, 4, 5])
      .enter()
      .append("g")
      .attr("class", "star")
      .attr("transform", (d, i) => `translate(${i * (starSize + padding) + starSize / 2 + 5}, ${height / 2})`)
      .style("cursor", "pointer");

    // Background stars (empty)
    stars
      .append("path")
      .attr("d", starPath)
      .attr("fill", "hsl(var(--star-empty))")
      .attr("transform", "rotate(-18)");

    // Foreground stars (filled) with clip
    stars.each(function (starIndex) {
      const star = d3.select(this);
      const clipId = `star-clip-${starIndex}`;

      // Calculate fill percentage for this star
      const getFillPercent = () => {
        if (displayRating >= starIndex) return 100;
        if (displayRating > starIndex - 1) return (displayRating - (starIndex - 1)) * 100;
        return 0;
      };

      // Create clip path
      svg
        .append("defs")
        .append("clipPath")
        .attr("id", clipId)
        .append("rect")
        .attr("x", -starSize / 2)
        .attr("y", -starSize / 2)
        .attr("width", (starSize * getFillPercent()) / 100)
        .attr("height", starSize);

      // Filled star
      star
        .append("path")
        .attr("class", "star-fill")
        .attr("d", starPath)
        .attr("fill", "hsl(var(--star-filled))")
        .attr("clip-path", `url(#${clipId})`)
        .attr("transform", "rotate(-18)");
    });

    // Add interaction - always allow rating
    stars
      .on("mouseenter", function (event, d) {
        setHoverRating(d);
        d3.select(this)
          .select(".star-fill")
          .transition()
          .duration(150)
          .attr("transform", "rotate(-18) scale(1.15)");
      })
      .on("mouseleave", function () {
        setHoverRating(null);
        d3.select(this)
          .select(".star-fill")
          .transition()
          .duration(150)
          .attr("transform", "rotate(-18) scale(1)");
      })
      .on("click", function (event, d) {
        onRate(d);
        
        // Pulse animation
        d3.select(this)
          .select(".star-fill")
          .transition()
          .duration(150)
          .attr("transform", "rotate(-18) scale(1.3)")
          .transition()
          .duration(150)
          .attr("transform", "rotate(-18) scale(1)");
      });
  }, [displayRating, onRate]);

  // Update fill when rating changes
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const starSize = 32;

    [1, 2, 3, 4, 5].forEach((starIndex) => {
      const getFillPercent = () => {
        if (displayRating >= starIndex) return 100;
        if (displayRating > starIndex - 1) return (displayRating - (starIndex - 1)) * 100;
        return 0;
      };

      svg
        .select(`#star-clip-${starIndex} rect`)
        .transition()
        .duration(200)
        .attr("width", (starSize * getFillPercent()) / 100);
    });
  }, [displayRating]);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg ref={svgRef} className="overflow-visible" />
      <div className="font-ui text-sm text-muted-foreground">
        {averageRating > 0 ? (
          <>
            <span className="font-semibold text-foreground">{averageRating.toFixed(1)}</span>
            <span> / 5 ({ocjene.length} {ocjene.length === 1 ? "ocjena" : "ocjena"})</span>
          </>
        ) : (
          <span>Budite prvi koji ocjenjuje!</span>
        )}
      </div>
      <p className="font-ui text-xs text-muted-foreground">Kliknite za ocjenu</p>
    </div>
  );
};

export default StarRating;