
import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, ArrowUp, Sparkles, Lightbulb, LightbulbOff, Coins, Target, BookOpen, Skull, Shield, Crosshair, Rocket, Pause, Play, RotateCcw, Home, Trophy, LogOut } from 'lucide-react';
import { GameState, Mission, AppMode } from '../types';
import { SEA_ENTITIES } from '../constants';

interface HUDProps {
  gameState: GameState;
  missions: Mission[];
  appMode: AppMode;
  onCloseFact: () => void;
  onReset: () => void;
  onToggleLight: () => void;
  onShoot?: (entityId: string) => void;
  onPause: () => void;
  onResume: () => void;
  onExit: () => void;
  onGoHome: () => void;
  isPaused: boolean;
  lastFired?: number;
}

export const HUD: React.FC<HUDProps> = ({ gameState, missions, appMode, onCloseFact, onReset, onToggleLight, onShoot, onPause, onResume, onExit, onGoHome, isPaused, lastFired = 0 }) => {
  const totalCreatures = SEA_ENTITIES.length;
  const discoveredCount = gameState.catalogedIds.length;
  const progressPercent = (discoveredCount / totalCreatures) * 100;

  const isSurvival = gameState.gameMode === 'SURVIVAL';

  // Joystick & Crosshair State
  const [crosshairPos, setCrosshairPos] = useState({ x: 50, y: 50 }); // Percentage
  const joystickRef = useRef<HTMLDivElement>(null);
  const [joystickVec, setJoystickVec] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  // Target Locking State
  const [lockedTargetId, setLockedTargetId] = useState<string | null>(null);

  // Reload Animation State
  const [reloadProgress, setReloadProgress] = useState(100);
  const COOLDOWN = 1500;

  useEffect(() => {
    if (lastFired === 0) {
        setReloadProgress(100);
        return;
    }
    const tick = setInterval(() => {
        const now = Date.now();
        const diff = now - lastFired;
        if (diff >= COOLDOWN) {
            setReloadProgress(100);
            clearInterval(tick);
        } else {
            setReloadProgress((diff / COOLDOWN) * 100);
        }
    }, 16);
    return () => clearInterval(tick);
  }, [lastFired]);

  const canFire = reloadProgress >= 100 && gameState.ammo > 0;

  // Joystick Loop & Target Scanning
  useEffect(() => {
    if (!isSurvival || isPaused || appMode !== 'GAME') return;
    let animationFrame: number;

    const update = () => {
        // Update Position
        if (joystickVec.x !== 0 || joystickVec.y !== 0) {
            setCrosshairPos(prev => ({
                x: Math.min(95, Math.max(5, prev.x + joystickVec.x * 0.8)),
                y: Math.min(95, Math.max(5, prev.y + joystickVec.y * 0.8))
            }));
        }

        // Scan for Target under Crosshair
        const x = (crosshairPos.x / 100) * window.innerWidth;
        const y = (crosshairPos.y / 100) * window.innerHeight;
        
        // Temporarily hide crosshair DOM to raycast beneath it
        const crosshairEl = document.getElementById('hud-crosshair');
        if (crosshairEl) crosshairEl.style.display = 'none';
        const el = document.elementFromPoint(x, y);
        if (crosshairEl) crosshairEl.style.display = 'block';

        let foundId = null;
        let current = el;
        while (current) {
            const id = current.getAttribute('data-entity-id');
            if (id) {
                foundId = id;
                break;
            }
            current = current.parentElement;
        }
        
        setLockedTargetId(foundId);

        animationFrame = requestAnimationFrame(update);
    };
    animationFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrame);
  }, [isSurvival, joystickVec, crosshairPos, isPaused, appMode]);

  const handleJoystickStart = (e: React.PointerEvent) => {
      setIsDragging(true);
      joystickRef.current?.setPointerCapture(e.pointerId);
  };

  const handleJoystickMove = (e: React.PointerEvent) => {
      if (!isDragging || !joystickRef.current) return;
      const rect = joystickRef.current.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const centerX = rect.left + rect.width / 2;
      
      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);
      
      // Clamp magnitude
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDist = 1;
      const scale = distance > maxDist ? maxDist / distance : 1;
      
      setJoystickVec({ x: deltaX * scale, y: deltaY * scale });
  };

  const handleJoystickEnd = () => {
      setIsDragging(false);
      setJoystickVec({ x: 0, y: 0 });
  };

  const handleFire = () => {
      if (!onShoot || isPaused || !canFire) return;
      // Fire at whatever is currently locked (or force a check if moving fast)
      if (lockedTargetId) {
          onShoot(lockedTargetId);
      } else {
          // Manual check if lock didn't update in time
          const x = (crosshairPos.x / 100) * window.innerWidth;
          const y = (crosshairPos.y / 100) * window.innerHeight;
          const crosshairEl = document.getElementById('hud-crosshair');
          if (crosshairEl) crosshairEl.style.display = 'none';
          const el = document.elementFromPoint(x, y);
          if (crosshairEl) crosshairEl.style.display = 'block';
          
          let current = el;
          while (current) {
              const id = current.getAttribute('data-entity-id');
              if (id) {
                  onShoot(id);
                  break;
              }
              current = current.parentElement;
          }
      }
  };

  return (
    <div className={`absolute inset-0 pointer-events-none flex flex-col justify-between p-6 z-10`}>
      
      {/* SURVIVAL CROSSHAIR */}
      {isSurvival && appMode === 'GAME' && !isPaused && (
          <div 
            id="hud-crosshair"
            className="absolute -ml-8 -mt-8 pointer-events-none z-50 transition-all duration-100"
            style={{ 
                left: `${crosshairPos.x}%`, 
                top: `${crosshairPos.y}%`,
                width: lockedTargetId ? '64px' : '48px',
                height: lockedTargetId ? '64px' : '48px'
            }}
          >
              <div className={`relative w-full h-full flex items-center justify-center transition-colors duration-200 ${lockedTargetId ? 'text-green-500' : 'text-red-500'}`}>
                  <Crosshair className={`w-full h-full drop-shadow-[0_0_5px_rgba(0,0,0,0.8)] ${lockedTargetId ? 'animate-pulse' : ''}`} />
                  {/* Center Dot */}
                  <div className={`absolute w-1 h-1 rounded-full shadow-[0_0_10px_white] ${lockedTargetId ? 'bg-green-200' : 'bg-red-200'}`} />
                  
                  {/* Locking Brackets Animation */}
                  {lockedTargetId && (
                      <>
                        <div className="absolute inset-0 border-2 border-green-500 rounded-lg animate-ping opacity-50" />
                        <div className="absolute -bottom-6 text-[10px] font-bold bg-green-900/80 text-green-400 px-2 py-1 rounded font-mono tracking-widest">
                            LOCKED
                        </div>
                      </>
                  )}
              </div>
          </div>
      )}

      {/* Top Bar */}
      <div className="w-full flex justify-between items-start pointer-events-auto">
        
        {/* Left: Stats */}
        <div className="flex flex-col gap-2 max-w-xs">
            {isSurvival ? (
                <div className="bg-red-950/60 backdrop-blur-md border border-red-500/30 rounded-xl p-4 shadow-lg">
                    <div className="flex items-center gap-2 text-red-400 font-bold mb-2 text-xs uppercase tracking-widest">
                        <Shield className="w-3 h-3" /> Hull Integrity
                    </div>
                    <div className="w-full h-4 bg-black rounded-full overflow-hidden mb-2 border border-white/10">
                        <div className="h-full bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-300" style={{ width: `${Math.max(0, gameState.health)}%` }} />
                    </div>
                    
                    <div className="flex items-center gap-2 text-yellow-400 font-bold mt-4 text-xs uppercase tracking-widest">
                         <Rocket className="w-3 h-3" /> Missiles
                    </div>
                    <div className="text-2xl font-mono font-bold text-yellow-300">
                        {gameState.ammo} <span className="text-xs text-yellow-600">UNITS</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="bg-black/60 backdrop-blur-md border border-cyan-500/30 rounded-xl p-3 shadow-lg">
                        <div className="flex items-center gap-2 text-cyan-300 font-bold mb-2 text-xs uppercase tracking-widest">
                            <BookOpen className="w-3 h-3" /> Catalog Status
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-1">
                            <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                        </div>
                        <div className="text-[10px] text-slate-400 flex justify-between">
                            <span>{discoveredCount} Discovered</span>
                            <span>{totalCreatures} Total</span>
                        </div>
                    </div>

                    <div className="hidden md:block bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 mt-2">
                        <div className="flex items-center gap-2 text-yellow-400 font-bold mb-2 text-xs uppercase tracking-widest">
                            <Target className="w-3 h-3" /> Missions
                        </div>
                        <div className="space-y-2">
                            {missions.map(mission => (
                                <div key={mission.id} className={`text-xs p-2 rounded border ${mission.completed ? 'bg-green-900/40 border-green-500/50 text-green-200' : 'bg-white/5 border-white/10 text-slate-300'} transition-colors`}>
                                    <div className="flex justify-between items-center">
                                        <span>{mission.description}</span>
                                        {mission.completed && <span className="text-[10px] bg-green-500 text-black px-1 rounded font-bold">✓</span>}
                                    </div>
                                    <div className="text-[10px] mt-1 text-yellow-500/80 font-mono flex items-center gap-1">
                                        <Coins className="w-3 h-3" /> +{mission.reward}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>

        {/* Center Depth */}
        <div className={`backdrop-blur-md border px-8 py-4 rounded-full flex flex-col items-center text-white shadow-lg ${isSurvival ? 'bg-red-950/40 border-red-500/20' : 'bg-black/40 border-white/20'}`}>
            <span className="text-4xl font-bold font-mono tracking-tighter flex items-baseline gap-2">
                {Math.floor(gameState.depth)} <span className={`text-sm font-sans font-normal ${isSurvival ? 'text-red-400' : 'text-cyan-400'}`}>meters</span>
            </span>
            <div className={`flex items-center gap-2 text-[10px] mt-1 uppercase tracking-widest opacity-80 ${isSurvival ? 'text-red-200' : 'text-cyan-200'}`}>
                {gameState.depth < 10 ? (
                    <>Scroll Down <ArrowDown className="w-3 h-3 animate-bounce" /></>
                ) : (
                    <>Current Depth</>
                )}
            </div>
        </div>

        {/* Right: Coins & Pause */}
        <div className="flex flex-col items-end gap-2">
             <div className="bg-yellow-500/20 backdrop-blur-md border border-yellow-500/50 px-4 py-2 rounded-full flex items-center gap-2 text-yellow-300 shadow-lg">
                <Coins className="w-5 h-5" />
                <span className="font-bold font-mono text-xl">{gameState.coins}</span>
            </div>
            <button 
                onClick={onPause}
                className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center text-white border border-white/20"
            >
                <Pause className="w-4 h-4" />
            </button>
        </div>
      </div>

      {/* Right: Fact Card */}
      {gameState.selectedEntity && !isSurvival && !isPaused && (
          <div className="pointer-events-auto absolute top-1/2 right-4 md:right-12 transform -translate-y-1/2 w-80 perspective-1000 z-50">
              <div className="bg-slate-900/95 border border-cyan-500/50 rounded-xl p-0 overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.2)] backdrop-blur-xl transition-all animate-in slide-in-from-right-10 duration-300 flex flex-col">
                <button 
                    onClick={onCloseFact}
                    className="absolute top-3 right-4 text-white/80 hover:text-white bg-black/50 rounded-full w-8 h-8 flex items-center justify-center z-20 hover:bg-black/70 transition-colors"
                >
                    ✕
                </button>
                
                <div className="w-full h-48 bg-black relative">
                    <img 
                        src={gameState.selectedEntity.image} 
                        alt={gameState.selectedEntity.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                         <h2 className="text-2xl font-bold text-cyan-300 leading-tight shadow-black drop-shadow-md">{gameState.selectedEntity.name}</h2>
                         <span className="px-2 py-0.5 bg-cyan-950/80 text-cyan-400 text-[10px] rounded font-mono border border-cyan-900 backdrop-blur-sm">
                            DEPTH: {gameState.selectedEntity.depth}m
                        </span>
                    </div>
                </div>

                <div className="p-6 pt-2">
                    <div className="min-h-[60px]">
                        {gameState.loadingFact ? (
                            <div className="flex items-center gap-2 text-cyan-400 animate-pulse py-2">
                                <Sparkles className="w-4 h-4" />
                                <span className="text-sm font-mono">Decrypting signal...</span>
                            </div>
                        ) : (
                            <p className="text-slate-200 leading-relaxed text-sm font-medium border-l-2 border-cyan-500/30 pl-3">
                                {gameState.fact}
                            </p>
                        )}
                    </div>
                </div>
              </div>
          </div>
      )}

      {/* --- OVERLAYS --- */}

      {/* PAUSE MENU */}
      {isPaused && appMode === 'GAME' && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center pointer-events-auto animate-in fade-in duration-300">
               <h2 className="text-4xl font-bold text-white mb-8 tracking-widest">SYSTEM PAUSED</h2>
               <div className="flex flex-col gap-4 w-64">
                   <button onClick={onResume} className="bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors">
                       <Play className="w-4 h-4" /> RESUME
                   </button>
                   <button onClick={onExit} className="bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors">
                       <Home className="w-4 h-4" /> RETURN TO BASE
                   </button>
               </div>
          </div>
      )}

      {/* GAME OVER */}
      {appMode === 'GAME_OVER' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-950/90 backdrop-blur-lg z-50 animate-in zoom-in duration-500 pointer-events-auto">
              <Skull className="w-24 h-24 text-red-500 mb-6 animate-pulse" />
              <h1 className="text-6xl font-bold text-red-500 mb-2 text-center">CRITICAL FAILURE</h1>
              <p className="text-red-200 text-xl mb-8">Submarine Destroyed</p>
              <div className="flex gap-4">
                <button 
                    onClick={onReset}
                    className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center gap-2"
                >
                    <RotateCcw className="w-4 h-4" /> Emergency Surface
                </button>
                <button 
                    onClick={onExit}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded font-bold uppercase tracking-widest transition-all"
                >
                    Return to Menu
                </button>
              </div>
          </div>
      )}

      {/* YOU WON */}
      {appMode === 'GAME_WON' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-cyan-950/90 backdrop-blur-lg z-50 animate-in zoom-in duration-1000 pointer-events-auto">
              <Trophy className="w-24 h-24 text-yellow-400 mb-6 animate-bounce" />
              <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 mb-2 text-center">MISSION ACCOMPLISHED</h1>
              <p className="text-cyan-200 text-xl mb-4">Deepest Point Reached</p>
              <div className="bg-black/40 px-6 py-3 rounded-full mb-8 flex items-center gap-3 border border-yellow-500/30">
                  <span className="text-slate-300 uppercase text-xs tracking-widest">Reward</span>
                  <div className="flex items-center gap-1 text-yellow-400 font-bold text-2xl">
                      <Coins className="w-6 h-6" /> +1000
                  </div>
              </div>
              
              <button 
                onClick={onExit}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(8,145,178,0.6)] hover:scale-105"
              >
                  Return to Base
              </button>
          </div>
      )}

      {/* SURVIVAL CONTROLS */}
      {isSurvival && appMode === 'GAME' && !isPaused && (
          <div className="absolute bottom-8 right-8 flex gap-6 items-end pointer-events-auto">
              {/* Fire Button with Reload Animation */}
              <button 
                onPointerDown={handleFire}
                disabled={!canFire}
                className={`w-20 h-20 rounded-full border-4 shadow-[0_0_20px_rgba(220,38,38,0.6)] active:scale-90 transition-transform flex items-center justify-center overflow-hidden relative 
                    ${lockedTargetId ? 'bg-green-600 border-green-500 animate-pulse' : 'bg-red-600 border-red-800'}
                    ${!canFire ? 'grayscale opacity-70 cursor-not-allowed' : ''}
                `}
              >
                  {/* Reload Overlay */}
                  <div 
                    className="absolute inset-0 bg-black/50 z-10 transition-all duration-100 ease-linear"
                    style={{ bottom: `${reloadProgress}%` }}
                  />
                  <Rocket className="w-10 h-10 text-white z-20 relative" />
              </button>

              {/* Virtual Joystick */}
              <div 
                ref={joystickRef}
                onPointerDown={handleJoystickStart}
                onPointerMove={handleJoystickMove}
                onPointerUp={handleJoystickEnd}
                onPointerLeave={handleJoystickEnd}
                className="w-32 h-32 bg-slate-900/50 rounded-full border-2 border-slate-500/50 backdrop-blur relative touch-none"
              >
                  <div 
                    className="absolute w-12 h-12 bg-cyan-500/80 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)] top-1/2 left-1/2 -ml-6 -mt-6 pointer-events-none"
                    style={{
                        transform: `translate(${joystickVec.x * 40}px, ${joystickVec.y * 40}px)`
                    }}
                  />
              </div>
          </div>
      )}

      {/* Bottom Controls (Light / Surface) */}
      {appMode === 'GAME' && !isPaused && (
          <div className="absolute bottom-8 left-8 flex items-center gap-4 pointer-events-auto">
              <button
                onClick={onToggleLight}
                className={`group flex items-center justify-center w-12 h-12 rounded-full border transition-all shadow-lg ${gameState.lightOn ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.3)]' : 'bg-slate-800 border-slate-600 text-slate-400'}`}
                title="Toggle Submarine Lights"
              >
                  {gameState.lightOn ? <Lightbulb className="w-6 h-6" /> : <LightbulbOff className="w-6 h-6" />}
              </button>

              {/* GO HOME BUTTON - APPEARS AT SURFACE */}
              {gameState.depth < 20 && (
                  <button 
                    onClick={onGoHome}
                    className="group flex items-center gap-2 px-6 py-3 rounded-lg border bg-indigo-900/80 hover:bg-indigo-800 text-indigo-300 border-indigo-500/50 transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] animate-in fade-in"
                  >
                      <LogOut className="w-4 h-4" />
                      <span className="font-bold text-sm tracking-wide">DOCK & GO HOME</span>
                  </button>
              )}

              {/* EMERGENCY SURFACE */}
              {gameState.depth > 100 && gameState.health > 0 && !isSurvival && (
                  <button 
                    onClick={onReset}
                    className="group flex items-center gap-2 px-4 py-3 rounded-lg border bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border-cyan-800/50 transition-all hover:shadow-[0_0_20px_rgba(8,145,178,0.4)]"
                  >
                      <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                      <span className="font-bold text-sm tracking-wide">SURFACE</span>
                  </button>
              )}
          </div>
      )}
    </div>
  );
};
