
import React, { useState, useEffect, useRef } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { SplashScreen } from './components/SplashScreen';
import { MainMenu } from './components/MainMenu';
import { IntroStory } from './components/IntroStory';
import { HomeBase } from './components/HomeBase';
import { getCreatureFact } from './services/geminiService';
import { GameState, SeaEntity, AppMode, Submarine, Mission, Ocean, GameModeType } from './types';
import { MAX_DEPTH, SUBMARINES, MISSION_TEMPLATES, OCEANS, SEA_ENTITIES } from './constants';
import { getVisibleEntities } from './utils/worldGen';

const App: React.FC = () => {
  // Start with INTRO now
  const [mode, setMode] = useState<AppMode>('INTRO');
  const [selectedSub, setSelectedSub] = useState<Submarine>(SUBMARINES[0]);
  const [selectedOcean, setSelectedOcean] = useState<Ocean>(OCEANS[0]);
  const [ownedSubmarineIds, setOwnedSubmarineIds] = useState<string[]>(['classic']);
  
  // Game State
  const [depth, setDepth] = useState(0);
  const [gameMode, setGameMode] = useState<GameModeType>('EXPLORATION');
  const [health, setHealth] = useState(100);
  const [ammo, setAmmo] = useState(20);
  const [isPaused, setIsPaused] = useState(false);
  const [dayCount, setDayCount] = useState(1);
  const [lastFired, setLastFired] = useState(0); // For reload animation
  
  const [selectedEntity, setSelectedEntity] = useState<SeaEntity | null>(null);
  const [fact, setFact] = useState<string | null>(null);
  const [loadingFact, setLoadingFact] = useState(false);
  
  const [coins, setCoins] = useState(0);
  const [lightOn, setLightOn] = useState(true);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [catalogedIds, setCatalogedIds] = useState<string[]>([]);
  const [killedIds, setKilledIds] = useState<string[]>([]);
  
  // Firing logic
  const [firingAtId, setFiringAtId] = useState<string | null>(null);

  const targetDepth = useRef(0);
  const touchStartY = useRef<number | null>(null);

  // Load Data
  useEffect(() => {
    const savedCoins = localStorage.getItem('abyss_coins');
    if (savedCoins) setCoins(parseInt(savedCoins));

    const savedCatalog = localStorage.getItem('abyss_catalog');
    if (savedCatalog) setCatalogedIds(JSON.parse(savedCatalog));

    const savedOwned = localStorage.getItem('abyss_owned_subs');
    if (savedOwned) setOwnedSubmarineIds(JSON.parse(savedOwned));
    
    const savedDay = localStorage.getItem('abyss_day');
    if (savedDay) setDayCount(parseInt(savedDay));

    const savedMissions = localStorage.getItem('abyss_missions');
    const savedDate = localStorage.getItem('abyss_mission_date');
    const today = new Date().toDateString();

    if (savedMissions && savedDate === today) {
        setMissions(JSON.parse(savedMissions));
    } else {
        const newMissions: Mission[] = [];
        const shuffled = [...MISSION_TEMPLATES].sort(() => 0.5 - Math.random());
        for(let i=0; i<3; i++) {
            const tmpl = shuffled[i];
            newMissions.push({
                id: `m_${Date.now()}_${i}`,
                description: tmpl.description,
                targetId: tmpl.targetId,
                reward: tmpl.reward,
                completed: false
            });
        }
        setMissions(newMissions);
        localStorage.setItem('abyss_missions', JSON.stringify(newMissions));
        localStorage.setItem('abyss_mission_date', today);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('abyss_coins', coins.toString());
  }, [coins]);

  useEffect(() => {
    localStorage.setItem('abyss_catalog', JSON.stringify(catalogedIds));
  }, [catalogedIds]);

  useEffect(() => {
    localStorage.setItem('abyss_owned_subs', JSON.stringify(ownedSubmarineIds));
  }, [ownedSubmarineIds]);

  useEffect(() => {
    localStorage.setItem('abyss_day', dayCount.toString());
  }, [dayCount]);

  useEffect(() => {
      if(missions.length > 0) {
        localStorage.setItem('abyss_missions', JSON.stringify(missions));
      }
  }, [missions]);

  // --- SURVIVAL LOGIC ---
  useEffect(() => {
      if (mode !== 'GAME' || gameMode !== 'SURVIVAL' || health <= 0 || isPaused) return;

      const tick = setInterval(() => {
          // Simple logic: If hostile entities are visible and close, take damage
          // Use current ocean for visible calculation
          const visible = getVisibleEntities(depth, 50, selectedOcean.id);
          const hostiles = visible.filter(e => e.hostile && !killedIds.includes(e.id));
          
          if (hostiles.length > 0) {
              setHealth(h => {
                  const next = Math.max(0, h - (hostiles.length * 0.5));
                  if (next <= 0) setMode('GAME_OVER');
                  return next;
              });
          }
      }, 1000);

      return () => clearInterval(tick);
  }, [mode, gameMode, depth, killedIds, health, isPaused, selectedOcean.id]);

  // --- CONTROLS ---

  useEffect(() => {
    if (mode !== 'GAME' || isPaused) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * 0.15;
      targetDepth.current = Math.min(MAX_DEPTH, Math.max(0, targetDepth.current + delta));
    };

    const handleTouchStart = (e: TouchEvent) => {
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (touchStartY.current === null) return;
        const currentY = e.touches[0].clientY;
        const delta = (touchStartY.current - currentY) * 1.5; // Sensitivity
        targetDepth.current = Math.min(MAX_DEPTH, Math.max(0, targetDepth.current + delta));
        touchStartY.current = currentY;
    };

    const handleTouchEnd = () => {
        touchStartY.current = null;
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
        window.removeEventListener('wheel', handleWheel);
        window.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [mode, isPaused]);

  // Animation Loop
  useEffect(() => {
    if (mode !== 'GAME' || isPaused) return;

    let rAF: number;
    const animate = () => {
      setDepth(prev => {
        const diff = targetDepth.current - prev;
        if (Math.abs(diff) < 0.05) return prev;
        
        // Check for WIN condition (reached 10900+)
        if (prev > 10900 && mode === 'GAME') {
            setMode('GAME_WON');
            setCoins(c => c + 1000); // Win Reward
            return prev;
        }

        const easing = Math.abs(diff) > 500 ? 0.15 : 0.08;
        return prev + diff * easing; 
      });
      rAF = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(rAF);
  }, [mode, isPaused]);

  const checkMissionProgress = (entityId: string) => {
      setMissions(prev => {
          return prev.map(m => {
              if (!m.completed && (m.targetId === entityId || entityId.includes(m.targetId))) {
                  setCoins(c => c + m.reward);
                  return { ...m, completed: true };
              }
              return m;
          });
      });
  };

  // Handle Click in EXPLORATION mode
  const handleEntityClick = async (entity: SeaEntity) => {
    if (gameMode !== 'EXPLORATION' || isPaused) return;

    // TREASURE LOGIC
    if (entity.type === 'treasure') {
        if (!catalogedIds.includes(entity.id)) {
            setCatalogedIds(prev => [...prev, entity.id]);
            setCoins(c => c + 500); // Instant reward
        }
        return; // Don't open fact card for treasure
    }

    if (!catalogedIds.includes(entity.id)) {
        setCatalogedIds(prev => [...prev, entity.id]);
    }

    if (selectedEntity?.id === entity.id) return;
    
    checkMissionProgress(entity.id);
    setSelectedEntity(entity);
    setFact(null);
    setLoadingFact(true);
    
    const result = await getCreatureFact(entity);
    setFact(result);
    setLoadingFact(false);
  };

  // 1. Trigger Firing
  const handleShoot = (entityId: string) => {
      if (gameMode !== 'SURVIVAL' || ammo <= 0 || health <= 0 || isPaused) return;
      
      const now = Date.now();
      const COOLDOWN = 1500; // 1.5 seconds per shot
      if (now - lastFired < COOLDOWN) return;

      // Update state
      setLastFired(now);
      setAmmo(a => a - 1);
      setFiringAtId(entityId);
      
      // Reset trigger shortly after
      setTimeout(() => setFiringAtId(null), 100);
  };

  // 2. Handle Impact (Callback from GameCanvas)
  const handleMissileHit = (entityId: string) => {
      setKilledIds(prev => [...prev, entityId]);
      
      const entity = SEA_ENTITIES.find(e => e.id === entityId);
      if (entity) {
        if (entity.hostile) setCoins(c => c + 10);
        else setCoins(c => Math.max(0, c - 5));
      }
  };

  const handleReset = () => {
      targetDepth.current = 0;
      setDepth(0);
      setHealth(selectedSub.maxHealth); 
      setAmmo(selectedSub.ammoCapacity);
      setKilledIds([]);
      setIsPaused(false); 
      setMode('GAME'); // Back to active game
  };

  const handleExit = () => {
      setMode('MENU');
      setIsPaused(false);
      targetDepth.current = 0;
      setDepth(0);
  };

  const handleGoHome = () => {
      setMode('HOME');
      setIsPaused(false);
      targetDepth.current = 0;
      setDepth(0);
  }

  const handleSleep = () => {
      // Restore stats and save
      setHealth(selectedSub.maxHealth);
      setAmmo(selectedSub.ammoCapacity);
      setDayCount(d => d + 1);
      
      // Transition back to menu with "refreshed" state
      setMode('MENU');
  }

  const handleLaunch = (sub: Submarine, ocean: Ocean, mode: GameModeType) => {
    setSelectedSub(sub);
    setSelectedOcean(ocean);
    setGameMode(mode);
    
    // Initialize Survival Stats (carry over if not slept? No, fresh launch for now)
    setHealth(sub.maxHealth);
    setAmmo(sub.ammoCapacity);
    setKilledIds([]);
    setIsPaused(false);
    setLastFired(0);

    setMode('GAME');
  };

  const handleBuySubmarine = (sub: Submarine) => {
      if (coins >= sub.price && !ownedSubmarineIds.includes(sub.id)) {
          setCoins(c => c - sub.price);
          setOwnedSubmarineIds(prev => [...prev, sub.id]);
      }
  };

  // FLOW: INTRO -> SPLASH -> MENU
  if (mode === 'INTRO') {
    return <IntroStory onComplete={() => setMode('SPLASH')} />;
  }

  if (mode === 'SPLASH') {
    return <SplashScreen onComplete={() => setMode('MENU')} />;
  }

  if (mode === 'HOME') {
      return <HomeBase onSleep={handleSleep} onMenu={() => setMode('MENU')} dayCount={dayCount} />;
  }

  if (mode === 'MENU') {
    return (
        <MainMenu 
            onSelect={handleLaunch} 
            completedMissionsCount={missions.filter(m => m.completed).length}
            coins={coins}
            ownedSubmarineIds={ownedSubmarineIds}
            onBuySubmarine={handleBuySubmarine}
        />
    );
  }

  // Pass selectedOcean.id to filter entities for the specific ocean map
  const visibleEntities = getVisibleEntities(depth, 150, selectedOcean.id); 

  return (
    <div className={`relative w-full h-full bg-black overflow-hidden select-none ${gameMode === 'SURVIVAL' ? 'cursor-crosshair' : 'cursor-ns-resize'}`}>
      <GameCanvas 
        depth={depth} 
        entities={visibleEntities}
        submarine={selectedSub}
        lightOn={lightOn}
        onEntityClick={handleEntityClick}
        onShoot={handleShoot}
        catalogedIds={catalogedIds}
        killedIds={killedIds}
        gameMode={gameMode}
        firingAtId={firingAtId}
        onMissileHit={handleMissileHit}
        isPaused={isPaused}
        baseColor={selectedOcean.colorHex} // Pass ocean color for background
      />
      <HUD 
        gameState={{ depth, selectedEntity, fact, loadingFact, coins, lightOn, catalogedIds, gameMode, health, ammo, killedIds }}
        missions={missions}
        appMode={mode}
        onCloseFact={() => setSelectedEntity(null)}
        onReset={handleReset}
        onToggleLight={() => setLightOn(!lightOn)}
        onShoot={handleShoot}
        onPause={() => setIsPaused(true)}
        onResume={() => setIsPaused(false)}
        onExit={handleExit}
        onGoHome={handleGoHome}
        isPaused={isPaused}
        lastFired={lastFired} // Pass for UI reload
      />
    </div>
  );
};

export default App;
