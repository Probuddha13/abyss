
import React, { useState } from 'react';
import { ArrowRight, SkipForward } from 'lucide-react';

interface IntroStoryProps {
  onComplete: () => void;
}

const PANELS = [
  {
    id: 1,
    image: "https://image.pollinations.ai/prompt/comic%20book%20panel%20busy%20city%20street%20noisy%20crowded%20black%20and%20white%20noir%20style?width=600&height=400&nologo=true&seed=1",
    text: "THE CITY NOISE WAS ENDLESS. HORNS, SHOUTS, SIRENS... I COULDN'T HEAR MY OWN THOUGHTS ANYMORE.",
    speechPos: "top-4 left-4"
  },
  {
    id: 2,
    image: "https://image.pollinations.ai/prompt/comic%20book%20panel%20peaceful%20beach%20shack%20sunset%20cartoon%20style?width=600&height=400&nologo=true&seed=2",
    text: "SO I LEFT IT ALL BEHIND. A SHACK BY THE SEA. JUST ME AND THE RHYTHM OF THE WAVES.",
    speechPos: "bottom-8 right-4"
  },
  {
    id: 3,
    image: "https://image.pollinations.ai/prompt/comic%20book%20panel%20man%20fixing%20yellow%20submarine%20blueprint%20garage%20cartoon?width=600&height=400&nologo=true&seed=3",
    text: "I SPENT YEARS RESTORING 'THE CANARY'. MY GRANDFATHER'S OLD SUB. SHE WAS FINALLY READY.",
    speechPos: "top-8 left-8"
  },
  {
    id: 4,
    image: "https://image.pollinations.ai/prompt/comic%20book%20panel%20yellow%20submarine%20diving%20into%20dark%20water%20splash%20action%20shot?width=600&height=400&nologo=true&seed=4",
    text: "TODAY IS THE DAY. THE SURFACE IS JUST THE BEGINNING. TIME TO DIVE!",
    speechPos: "bottom-4 left-4"
  }
];

export const IntroStory: React.FC<IntroStoryProps> = ({ onComplete }) => {
  const [currentPanel, setCurrentPanel] = useState(0);

  const handleNext = () => {
    if (currentPanel < PANELS.length - 1) {
      setCurrentPanel(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="absolute inset-0 bg-yellow-400 flex flex-col items-center justify-center z-50 p-4">
      {/* Skip Button */}
      <button 
        onClick={onComplete}
        className="absolute top-4 right-4 text-black font-bold border-2 border-black bg-white px-3 py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2"
      >
        SKIP <SkipForward className="w-4 h-4" />
      </button>

      {/* Comic Container */}
      <div className="max-w-2xl w-full bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-4">
        
        {/* Panel Display */}
        <div className="relative w-full aspect-video border-4 border-black overflow-hidden mb-4 bg-black">
           <img 
             src={PANELS[currentPanel].image} 
             alt="Comic Panel" 
             className="w-full h-full object-cover animate-in fade-in zoom-in duration-500"
             key={currentPanel} // Force re-render animation
           />

           {/* Speech Bubble */}
           <div className={`absolute ${PANELS[currentPanel].speechPos} max-w-[70%] animate-in slide-in-from-bottom-4 duration-700 delay-300`}>
              <div className="bg-white border-4 border-black p-4 rounded-[20px] rounded-bl-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] relative">
                  <p className="font-sans font-bold italic text-sm md:text-lg uppercase leading-tight">
                      {PANELS[currentPanel].text}
                  </p>
                  {/* Bubble tail */}
                  <div className="absolute -bottom-4 left-0 w-6 h-6 bg-white border-l-4 border-b-4 border-black transform skew-y-12 rotate-45"></div>
              </div>
           </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
            <div className="text-black font-bold italic">
                PANEL {currentPanel + 1} / {PANELS.length}
            </div>
            
            <button
                onClick={handleNext}
                className="bg-cyan-400 border-4 border-black px-8 py-3 font-black text-xl flex items-center gap-2 hover:bg-cyan-300 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
                {currentPanel === PANELS.length - 1 ? 'DIVE!' : 'NEXT'} 
                <ArrowRight className="w-6 h-6 stroke-[3px]" />
            </button>
        </div>
      </div>
    </div>
  );
};
