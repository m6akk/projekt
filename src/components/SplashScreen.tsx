import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'clouds' | 'logo' | 'zoom' | 'done'>('clouds');

  useEffect(() => {
    // Phase 1: Clouds move aside (0.5s)
    const cloudTimer = setTimeout(() => setPhase('logo'), 500);
    
    // Phase 2: Logo appears and stays (2s)
    const logoTimer = setTimeout(() => setPhase('zoom'), 2500);
    
    // Phase 3: Zoom out and fade (0.5s)
    const completeTimer = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(cloudTimer);
      clearTimeout(logoTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden transition-all duration-500 ${
        phase === 'zoom' ? 'scale-150 opacity-0' : 'scale-100 opacity-100'
      }`}
    >
      {/* Sky Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] via-[#98D8E8] to-[#B0E0E6]" />
      
      {/* Animated Clouds */}
      <div className={`absolute inset-0 transition-transform duration-1000 ${phase !== 'clouds' ? '-translate-x-full' : ''}`}>
        {/* Cloud 1 */}
        <div className="absolute top-[10%] left-[5%] w-40 h-20">
          <div className="relative">
            <div className="absolute w-16 h-12 bg-white rounded-full" />
            <div className="absolute left-8 -top-2 w-20 h-16 bg-white rounded-full" />
            <div className="absolute left-20 top-1 w-14 h-10 bg-white rounded-full" />
          </div>
        </div>
        
        {/* Cloud 2 */}
        <div className="absolute top-[20%] right-[10%] w-48 h-24">
          <div className="relative">
            <div className="absolute w-20 h-14 bg-white rounded-full" />
            <div className="absolute left-10 -top-3 w-24 h-18 bg-white rounded-full" />
            <div className="absolute left-24 top-2 w-16 h-12 bg-white rounded-full" />
          </div>
        </div>
        
        {/* Cloud 3 */}
        <div className="absolute top-[35%] left-[15%] w-36 h-18">
          <div className="relative">
            <div className="absolute w-14 h-10 bg-white rounded-full" />
            <div className="absolute left-7 -top-2 w-18 h-14 bg-white rounded-full" />
            <div className="absolute left-18 top-1 w-12 h-9 bg-white rounded-full" />
          </div>
        </div>
      </div>
      
      {/* Right side clouds */}
      <div className={`absolute inset-0 transition-transform duration-1000 ${phase !== 'clouds' ? 'translate-x-full' : ''}`}>
        {/* Cloud 4 */}
        <div className="absolute top-[15%] right-[20%] w-44 h-22">
          <div className="relative">
            <div className="absolute w-18 h-13 bg-white rounded-full" />
            <div className="absolute left-9 -top-2 w-22 h-17 bg-white rounded-full" />
            <div className="absolute left-22 top-2 w-15 h-11 bg-white rounded-full" />
          </div>
        </div>
        
        {/* Cloud 5 */}
        <div className="absolute bottom-[30%] right-[5%] w-40 h-20">
          <div className="relative">
            <div className="absolute w-16 h-12 bg-white rounded-full" />
            <div className="absolute left-8 -top-2 w-20 h-16 bg-white rounded-full" />
            <div className="absolute left-20 top-1 w-14 h-10 bg-white rounded-full" />
          </div>
        </div>
      </div>

      {/* Sun */}
      <div className="absolute top-8 right-12 w-24 h-24 bg-[#FFD700] rounded-full shadow-[0_0_60px_#FFD700] animate-pulse" />

      {/* Logo Container */}
      <div className={`relative z-10 text-center transition-all duration-700 ${
        phase === 'clouds' ? 'opacity-0 scale-50' : 'opacity-100 scale-100'
      }`}>
        {/* Main Logo - Family Guy Style */}
        <div className="relative">
          <h1 
            className="font-logo text-6xl md:text-8xl leading-tight"
            style={{
              color: '#1E5AA8',
              textShadow: `
                4px 4px 0px #FFD700,
                8px 8px 0px rgba(0,0,0,0.3),
                0 0 30px rgba(255,215,0,0.5)
              `,
              WebkitTextStroke: '3px #0D3A6E',
              letterSpacing: '0.05em',
            }}
          >
            DIJABETOVA
          </h1>
          <h2 
            className="font-logo text-5xl md:text-7xl -mt-2"
            style={{
              color: '#FFD700',
              textShadow: `
                3px 3px 0px #1E5AA8,
                6px 6px 0px rgba(0,0,0,0.3),
                0 0 20px rgba(30,90,168,0.5)
              `,
              WebkitTextStroke: '2px #8B6914',
              letterSpacing: '0.08em',
            }}
          >
            KUHARICA
          </h2>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-8 -left-12 text-5xl animate-bounce" style={{ animationDelay: '0.2s' }}>🍳</div>
        <div className="absolute -top-4 -right-10 text-4xl animate-bounce" style={{ animationDelay: '0.4s' }}>🍕</div>
        <div className="absolute -bottom-6 -left-8 text-4xl animate-bounce" style={{ animationDelay: '0.6s' }}>🍰</div>
        <div className="absolute -bottom-4 -right-6 text-5xl animate-bounce" style={{ animationDelay: '0.8s' }}>👨‍🍳</div>
      </div>

      {/* Bottom grass */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#228B22] to-[#32CD32]" />
      
      {/* Trees removed per user request */}
    </div>
  );
};

export default SplashScreen;
