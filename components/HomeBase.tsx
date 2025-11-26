
import React, { useState, useEffect } from 'react';
import { Bed, Monitor, Moon } from 'lucide-react';

interface HomeBaseProps {
  onSleep: () => void;
  onMenu: () => void;
  dayCount: number;
}

export const HomeBase: React.FC<HomeBaseProps> = ({ onSleep, onMenu, dayCount }) => {
  const [isSleeping, setIsSleeping] = useState(false);
  const [sleepPhase, setSleepPhase] = useState(0);

  const handleSleepClick = () => {
      setIsSleeping(true);
  };

  useEffect(() => {
      if (isSleeping) {
          // Phase 1: Climb into bed (2s)
          setTimeout(() => setSleepPhase(1), 2000);
          // Phase 2: Fade to black (4s)
          setTimeout(() => setSleepPhase(2), 4000);
          // Phase 3: Wake up (Complete) (6s)
          setTimeout(() => {
              onSleep(); 
          }, 6000);
      }
  }, [isSleeping, onSleep]);

  // CUTSCENE OVERLAY
  if (isSleeping) {
      return (
          <div className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden">
              {/* Image Sequence */}
              {sleepPhase === 0 && (
                 <img 
                    src="https://image.pollinations.ai/prompt/first%20person%20view%20walking%20towards%20cozy%20bunk%20bed%20inside%20submarine%20night?width=1024&height=768&nologo=true&seed=bed1"
                    alt="Walking to bed"
                    className="absolute inset-0 w-full h-full object-cover animate-in fade-in zoom-in duration-[4000ms]"
                 />
              )}
              {sleepPhase === 1 && (
                 <img 
                    src="https://image.pollinations.ai/prompt/person%20sleeping%20in%20submarine%20bunk%20window%20ocean%20outside%20peaceful?width=1024&height=768&nologo=true&seed=bed2"
                    alt="Sleeping"
                    className="absolute inset-0 w-full h-full object-cover animate-in fade-in zoom-in duration-[4000ms]"
                 />
              )}
              
              {/* Text Overlay */}
              <div className="z-10 text-white font-serif text-2xl italic animate-pulse">
                  {sleepPhase < 2 ? "Resting..." : "A new day begins."}
              </div>

              {/* Blackout Fade */}
              <div 
                className={`absolute inset-0 bg-black transition-opacity duration-[2000ms] pointer-events-none ${sleepPhase === 2 ? 'opacity-100' : 'opacity-0'}`} 
              />
          </div>
      );
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-60">
        <img 
            src="https://image.pollinations.ai/prompt/cozy%20beach%20shack%20bedroom%20interior%20night%20window%20ocean%20view%20realistic%203d%20render%20lighting?width=1024&height=768&nologo=true&seed=home" 
            alt="Home Base" 
            className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 max-w-2xl w-full p-8">
        <div className="bg-slate-900/90 border-4 border-slate-700 p-8 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] text-center backdrop-blur-sm">
            
            <h1 className="text-4xl font-bold text-yellow-100 mb-2 font-serif">HOME SWEET HOME</h1>
            <p className="text-slate-400 mb-8 uppercase tracking-widest text-xs">Day {dayCount} of Expedition</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button 
                    onClick={handleSleepClick}
                    className="group bg-indigo-900/80 hover:bg-indigo-800 border-2 border-indigo-500 p-6 rounded-xl transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                >
                    <div className="flex justify-center mb-4 text-indigo-300 group-hover:text-white transition-colors">
                        <Bed className="w-12 h-12" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">SLEEP</h2>
                    <p className="text-indigo-200 text-sm">Restores Health & Ammo. Saves Game.</p>
                </button>

                <button 
                    onClick={onMenu}
                    className="group bg-cyan-900/80 hover:bg-cyan-800 border-2 border-cyan-500 p-6 rounded-xl transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                >
                    <div className="flex justify-center mb-4 text-cyan-300 group-hover:text-white transition-colors">
                        <Monitor className="w-12 h-12" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">COMPUTER</h2>
                    <p className="text-cyan-200 text-sm">Access Submarine Shop & Missions.</p>
                </button>
            </div>

            <div className="mt-8 text-slate-500 italic text-sm">
                "The sea will be there tomorrow."
            </div>
        </div>
      </div>
    </div>
  );
};
