import React, { useEffect, useRef } from 'react';

interface AnimatedBackgroundProps {
  variant?: 'sky' | 'town' | 'full';
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ variant = 'full' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add slight parallax effect on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      containerRef.current.style.setProperty('--mouse-x', `${x}px`);
      containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: -1 }}
    >
      {/* Sky Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] via-[#E8F4F8] to-background opacity-30" />

      {/* Animated Clouds */}
      <div className="absolute top-0 left-0 right-0 h-48">
        {/* Cloud 1 - slow */}
        <div 
          className="absolute top-8 animate-cloud-slow"
          style={{ 
            left: '-200px',
            transform: 'translateX(var(--mouse-x, 0px)) translateY(var(--mouse-y, 0px))'
          }}
        >
          <svg width="160" height="80" viewBox="0 0 160 80" className="opacity-40">
            <ellipse cx="40" cy="50" rx="35" ry="25" fill="white" />
            <ellipse cx="80" cy="40" rx="45" ry="35" fill="white" />
            <ellipse cx="120" cy="50" rx="35" ry="25" fill="white" />
          </svg>
        </div>

        {/* Cloud 2 - medium */}
        <div 
          className="absolute top-20 animate-cloud-medium"
          style={{ left: '-150px' }}
        >
          <svg width="120" height="60" viewBox="0 0 120 60" className="opacity-30">
            <ellipse cx="30" cy="35" rx="25" ry="18" fill="white" />
            <ellipse cx="60" cy="28" rx="35" ry="25" fill="white" />
            <ellipse cx="90" cy="35" rx="25" ry="18" fill="white" />
          </svg>
        </div>

        {/* Cloud 3 - fast */}
        <div 
          className="absolute top-4 animate-cloud-fast"
          style={{ left: '-100px' }}
        >
          <svg width="100" height="50" viewBox="0 0 100 50" className="opacity-25">
            <ellipse cx="25" cy="30" rx="20" ry="15" fill="white" />
            <ellipse cx="50" cy="25" rx="28" ry="20" fill="white" />
            <ellipse cx="75" cy="30" rx="20" ry="15" fill="white" />
          </svg>
        </div>
      </div>

      {/* Sun */}
      <div 
        className="absolute top-12 right-16 w-20 h-20 opacity-20"
        style={{
          background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)',
          animation: 'pulse 4s ease-in-out infinite',
        }}
      />

      {/* Town Silhouette - Family Guy Quahog Style */}
      {(variant === 'town' || variant === 'full') && (
        <div className="absolute bottom-0 left-0 right-0 h-48 opacity-10">
          <svg viewBox="0 0 1200 200" className="w-full h-full" preserveAspectRatio="xMidYMax slice">
            {/* Buildings */}
            <rect x="0" y="80" width="60" height="120" fill="hsl(var(--primary))" />
            <rect x="70" y="60" width="40" height="140" fill="hsl(var(--foreground))" />
            <rect x="120" y="100" width="50" height="100" fill="hsl(var(--primary))" />
            <rect x="180" y="40" width="70" height="160" fill="hsl(var(--foreground))" />
            <rect x="260" y="80" width="45" height="120" fill="hsl(var(--primary))" />
            
            {/* Church/Town Hall */}
            <rect x="320" y="50" width="80" height="150" fill="hsl(var(--foreground))" />
            <polygon points="360,50 320,90 400,90" fill="hsl(var(--primary))" />
            
            {/* More buildings */}
            <rect x="420" y="70" width="55" height="130" fill="hsl(var(--primary))" />
            <rect x="485" y="90" width="40" height="110" fill="hsl(var(--foreground))" />
            <rect x="535" y="60" width="65" height="140" fill="hsl(var(--primary))" />
            <rect x="610" y="100" width="50" height="100" fill="hsl(var(--foreground))" />
            <rect x="670" y="50" width="80" height="150" fill="hsl(var(--primary))" />
            
            {/* Right side buildings */}
            <rect x="760" y="80" width="55" height="120" fill="hsl(var(--foreground))" />
            <rect x="825" y="60" width="45" height="140" fill="hsl(var(--primary))" />
            <rect x="880" y="90" width="60" height="110" fill="hsl(var(--foreground))" />
            <rect x="950" y="70" width="50" height="130" fill="hsl(var(--primary))" />
            <rect x="1010" y="50" width="70" height="150" fill="hsl(var(--foreground))" />
            <rect x="1090" y="80" width="55" height="120" fill="hsl(var(--primary))" />
            <rect x="1155" y="100" width="45" height="100" fill="hsl(var(--foreground))" />
            
            {/* Trees */}
            <circle cx="50" cy="150" r="25" fill="hsl(var(--primary))" opacity="0.5" />
            <circle cx="300" cy="160" r="20" fill="hsl(var(--primary))" opacity="0.5" />
            <circle cx="500" cy="155" r="22" fill="hsl(var(--primary))" opacity="0.5" />
            <circle cx="750" cy="160" r="18" fill="hsl(var(--primary))" opacity="0.5" />
            <circle cx="1000" cy="155" r="24" fill="hsl(var(--primary))" opacity="0.5" />
          </svg>
          
          {/* Animated car */}
          <div className="absolute bottom-4 animate-car">
            <svg width="40" height="20" viewBox="0 0 40 20">
              <rect x="5" y="8" width="30" height="8" rx="2" fill="hsl(var(--secondary))" />
              <rect x="10" y="4" width="15" height="6" rx="1" fill="hsl(var(--primary))" />
              <circle cx="10" cy="16" r="3" fill="hsl(var(--foreground))" />
              <circle cx="30" cy="16" r="3" fill="hsl(var(--foreground))" />
            </svg>
          </div>
        </div>
      )}

      {/* Floating food items */}
      <div className="absolute top-32 left-[10%] text-4xl opacity-10 animate-float-slow">🍕</div>
      <div className="absolute top-48 right-[15%] text-3xl opacity-10 animate-float-medium">🍔</div>
      <div className="absolute top-64 left-[25%] text-4xl opacity-10 animate-float-fast">🍰</div>
      <div className="absolute top-40 right-[30%] text-3xl opacity-10 animate-float-slow" style={{ animationDelay: '1s' }}>🌮</div>
    </div>
  );
};

export default AnimatedBackground;
