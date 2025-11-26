
import React, { useEffect, useState } from 'react';

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Fade in
    setTimeout(() => setOpacity(1), 100);
    // Fade out and complete
    setTimeout(() => setOpacity(0), 2500);
    setTimeout(onComplete, 3000);
  }, [onComplete]);

  return (
    <div 
      className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center transition-opacity duration-1000"
      style={{ opacity }}
    >
      <div className="text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 tracking-wider mb-8 font-serif">
          DALY COLLEGE GAMES
        </h1>
        <div className="w-32 h-1 bg-white/20 mx-auto mb-8"></div>
        <h2 className="text-2xl md:text-4xl font-light text-cyan-400 tracking-[0.5em] uppercase animate-pulse font-mono">
          ABYSS VOXEL DEEP DIVE
        </h2>
      </div>
    </div>
  );
};
