import React, { useEffect, useState } from 'react';

interface MouseFollowerProps {
  children: React.ReactNode;
}

const MouseFollower: React.FC<MouseFollowerProps> = ({ children }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {children}
      
      {/* Custom cursor trail */}
      {isHovering && (
        <>
          <div 
            className="fixed w-4 h-4 bg-secondary/30 rounded-full pointer-events-none z-[1000] mix-blend-screen transition-transform duration-100"
            style={{
              left: mousePos.x - 8,
              top: mousePos.y - 8,
            }}
          />
          <div 
            className="fixed w-8 h-8 border-2 border-primary/30 rounded-full pointer-events-none z-[1000] transition-all duration-300"
            style={{
              left: mousePos.x - 16,
              top: mousePos.y - 16,
            }}
          />
        </>
      )}
    </div>
  );
};

export default MouseFollower;
