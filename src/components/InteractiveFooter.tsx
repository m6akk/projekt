import React, { useRef, useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  emoji: string;
  size: number;
}

const foodEmojis = ['🍕', '🍔', '🌮', '🍰', '🍩', '🍳', '🥗', '🍝', '🍪', '🧁'];

const InteractiveFooter: React.FC = () => {
  const footerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  // Initialize particles
  useEffect(() => {
    const initialParticles: Particle[] = [];
    for (let i = 0; i < 15; i++) {
      initialParticles.push({
        id: i,
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
        y: Math.random() * 150,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        emoji: foodEmojis[Math.floor(Math.random() * foodEmojis.length)],
        size: 20 + Math.random() * 20,
      });
    }
    setParticles(initialParticles);
  }, []);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      setParticles(prev => prev.map(p => {
        let newX = p.x + p.vx;
        let newY = p.y + p.vy;
        let newVx = p.vx;
        let newVy = p.vy;

        // Bounce off walls
        const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
        if (newX < 0 || newX > width) newVx = -newVx;
        if (newY < 0 || newY > 150) newVy = -newVy;

        // Mouse repulsion
        const dx = newX - mousePos.x;
        const dy = newY - mousePos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100 && dist > 0) {
          const force = (100 - dist) / 100 * 3;
          newVx += (dx / dist) * force;
          newVy += (dy / dist) * force;
        }

        // Apply friction
        newVx *= 0.99;
        newVy *= 0.99;

        // Clamp velocity
        newVx = Math.max(-5, Math.min(5, newVx));
        newVy = Math.max(-5, Math.min(5, newVy));

        return {
          ...p,
          x: Math.max(0, Math.min(width, newX)),
          y: Math.max(0, Math.min(150, newY)),
          vx: newVx,
          vy: newVy,
        };
      }));
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [mousePos]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!footerRef.current) return;
    const rect = footerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <footer 
      ref={footerRef}
      className="relative border-t-[4px] border-primary py-16 bg-gradient-to-r from-secondary/40 via-primary/20 to-secondary/40 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Animated particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map(p => (
          <span
            key={p.id}
            className="absolute transition-transform duration-75"
            style={{
              left: p.x,
              top: p.y,
              fontSize: p.size,
              transform: `rotate(${Math.sin(Date.now() / 1000 + p.id) * 20}deg)`,
              opacity: 0.6,
            }}
          >
            {p.emoji}
          </span>
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-block">
            <h3 
              className="font-logo text-4xl md:text-5xl leading-tight"
              style={{
                color: 'hsl(var(--primary))',
                textShadow: `
                  3px 3px 0px hsl(var(--secondary)),
                  5px 5px 0px hsl(var(--foreground) / 0.2)
                `,
              }}
            >
              DIJABETOVA
            </h3>
            <h4 
              className="font-logo text-3xl md:text-4xl -mt-1"
              style={{
                color: 'hsl(var(--secondary))',
                textShadow: `
                  2px 2px 0px hsl(var(--primary)),
                  4px 4px 0px hsl(var(--foreground) / 0.2)
                `,
              }}
            >
              KUHARICA
            </h4>
          </div>
        </div>

        <p className="font-body text-lg text-muted-foreground text-center">
          © 2025 Svi recepti na jednom mjestu 🍕
        </p>
      </div>
    </footer>
  );
};

export default InteractiveFooter;
