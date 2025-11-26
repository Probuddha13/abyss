
import React, { useState } from 'react';
import { Submarine, Ocean, GameModeType } from '../types';
import { SUBMARINES, OCEANS } from '../constants';
import { BookOpen, Map, Anchor, Skull, Coins, Lock, Check } from 'lucide-react';

interface MainMenuProps {
  onSelect: (sub: Submarine, ocean: Ocean, mode: GameModeType) => void;
  completedMissionsCount: number;
  coins: number;
  ownedSubmarineIds: string[];
  onBuySubmarine: (sub: Submarine) => void;
}

type Tab = 'VESSEL' | 'EXPEDITION' | 'BRIEFING';

export const MainMenu: React.FC<MainMenuProps> = ({ onSelect, completedMissionsCount, coins, ownedSubmarineIds, onBuySubmarine }) => {
  const [activeTab, setActiveTab] = useState<Tab>('BRIEFING');
  const [selectedSub, setSelectedSub] = useState<Submarine>(SUBMARINES[0]);
  const [selectedOcean, setSelectedOcean] = useState<Ocean>(OCEANS[0]);
  const [selectedMode, setSelectedMode] = useState<GameModeType>('EXPLORATION');

  const handleLaunch = () => {
    // Only launch if the selected submarine is owned
    if (ownedSubmarineIds.includes(selectedSub.id)) {
        onSelect(selectedSub, selectedOcean, selectedMode);
    } else {
        // Force move to VESSEL tab if trying to launch with unowned sub
        setActiveTab('VESSEL');
    }
  };

  return (
    <div className="absolute inset-0 bg-slate-950 z-40 flex flex-col text-white overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b border-white/10 bg-slate-900/50 backdrop-blur-md flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-cyan-400 font-serif tracking-wider">DALY OPERATIONS</h1>
            <p className="text-slate-400 text-xs uppercase tracking-[0.2em]">Deep Sea Command Center</p>
        </div>
        
        <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
                <div className="text-slate-400 text-[10px] uppercase tracking-widest">Account Balance</div>
                <div className="flex items-center gap-2 text-yellow-400 font-mono text-xl font-bold">
                    <Coins className="w-5 h-5" /> {coins}
                </div>
            </div>

            <button 
                onClick={handleLaunch}
                disabled={!ownedSubmarineIds.includes(selectedSub.id)}
                className={`px-8 py-3 rounded font-bold uppercase tracking-widest transition-all shadow-lg ${ownedSubmarineIds.includes(selectedSub.id) ? 'bg-cyan-600 hover:bg-cyan-500 text-white hover:scale-105 shadow-cyan-500/30' : 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-50'}`}
            >
                {ownedSubmarineIds.includes(selectedSub.id) ? 'Launch Mission' : 'Vessel Required'}
            </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar Tabs */}
        <div className="w-24 md:w-64 bg-slate-900 border-r border-white/5 flex flex-col">
            <button 
                onClick={() => setActiveTab('BRIEFING')}
                className={`flex items-center gap-4 p-6 transition-colors ${activeTab === 'BRIEFING' ? 'bg-cyan-950/50 text-cyan-300 border-l-4 border-cyan-500' : 'text-slate-400 hover:bg-white/5'}`}
            >
                <BookOpen className="w-6 h-6" />
                <span className="hidden md:block font-bold tracking-wider">BRIEFING</span>
            </button>
            <button 
                onClick={() => setActiveTab('EXPEDITION')}
                className={`flex items-center gap-4 p-6 transition-colors ${activeTab === 'EXPEDITION' ? 'bg-cyan-950/50 text-cyan-300 border-l-4 border-cyan-500' : 'text-slate-400 hover:bg-white/5'}`}
            >
                <Map className="w-6 h-6" />
                <span className="hidden md:block font-bold tracking-wider">EXPEDITION</span>
            </button>
            <button 
                onClick={() => setActiveTab('VESSEL')}
                className={`flex items-center gap-4 p-6 transition-colors ${activeTab === 'VESSEL' ? 'bg-cyan-950/50 text-cyan-300 border-l-4 border-cyan-500' : 'text-slate-400 hover:bg-white/5'}`}
            >
                <Anchor className="w-6 h-6" />
                <span className="hidden md:block font-bold tracking-wider">VESSEL</span>
            </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
            
            {/* BRIEFING TAB (Modes & Stats) */}
            {activeTab === 'BRIEFING' && (
                <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-2xl font-bold mb-6 text-slate-200 border-b border-white/10 pb-2">Mission Status</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <div className="bg-slate-800/50 p-6 rounded-xl border border-white/10">
                            <div className="text-4xl font-bold text-yellow-400 mb-2">{completedMissionsCount}</div>
                            <div className="text-slate-400 uppercase text-xs tracking-widest">Missions Completed</div>
                        </div>
                        <div className="bg-slate-800/50 p-6 rounded-xl border border-white/10">
                            <div className="text-4xl font-bold text-cyan-400 mb-2">READY</div>
                            <div className="text-slate-400 uppercase text-xs tracking-widest">System Status</div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold mb-6 text-slate-200 border-b border-white/10 pb-2">Select Game Mode</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button
                            onClick={() => setSelectedMode('EXPLORATION')}
                            className={`relative p-6 rounded-xl border-2 text-left transition-all ${selectedMode === 'EXPLORATION' ? 'border-cyan-500 bg-cyan-950/30' : 'border-slate-700 bg-slate-800/30 hover:border-slate-500'}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <BookOpen className={`w-8 h-8 ${selectedMode === 'EXPLORATION' ? 'text-cyan-400' : 'text-slate-500'}`} />
                                {selectedMode === 'EXPLORATION' && <div className="bg-cyan-500 text-black text-xs font-bold px-2 py-1 rounded">ACTIVE</div>}
                            </div>
                            <h3 className="text-xl font-bold mb-2">Exploration Mode</h3>
                            <p className="text-sm text-slate-400">Discover creatures, learn facts, and explore the deep sea at your own pace. Invulnerable.</p>
                        </button>

                        <button
                            onClick={() => setSelectedMode('SURVIVAL')}
                            className={`relative p-6 rounded-xl border-2 text-left transition-all ${selectedMode === 'SURVIVAL' ? 'border-red-500 bg-red-950/30' : 'border-slate-700 bg-slate-800/30 hover:border-slate-500'}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <Skull className={`w-8 h-8 ${selectedMode === 'SURVIVAL' ? 'text-red-400' : 'text-slate-500'}`} />
                                {selectedMode === 'SURVIVAL' && <div className="bg-red-500 text-black text-xs font-bold px-2 py-1 rounded">ACTIVE</div>}
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-red-200">Survival Mode</h3>
                            <p className="text-sm text-slate-400">Hostile creatures attack. Use your weapons to survive. Limited ammo and hull integrity.</p>
                        </button>
                    </div>
                </div>
            )}

            {/* EXPEDITION TAB (Oceans) */}
            {activeTab === 'EXPEDITION' && (
                <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <h2 className="text-2xl font-bold mb-6 text-slate-200 border-b border-white/10 pb-2">Target Coordinates</h2>
                     <div className="grid grid-cols-1 gap-4">
                        {OCEANS.map(ocean => (
                            <button
                                key={ocean.id}
                                onClick={() => setSelectedOcean(ocean)}
                                className={`group flex items-center p-4 rounded-xl border transition-all ${selectedOcean.id === ocean.id ? 'border-cyan-500 bg-cyan-950/40' : 'border-slate-700 bg-slate-800/40 hover:bg-slate-800'}`}
                            >
                                <div 
                                    className="w-16 h-16 rounded-lg mr-6 shadow-lg" 
                                    style={{ backgroundColor: ocean.colorHex }} 
                                />
                                <div className="text-left">
                                    <h3 className={`text-lg font-bold mb-1 ${selectedOcean.id === ocean.id ? 'text-cyan-300' : 'text-white'}`}>{ocean.name}</h3>
                                    <p className="text-sm text-slate-400">{ocean.description}</p>
                                </div>
                                {selectedOcean.id === ocean.id && (
                                    <div className="ml-auto">
                                        <div className="w-6 h-6 text-cyan-500 animate-pulse border-2 border-cyan-500 rounded-full" />
                                    </div>
                                )}
                            </button>
                        ))}
                     </div>
                </div>
            )}

            {/* VESSEL TAB (SHOP) */}
            {activeTab === 'VESSEL' && (
                <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-2xl font-bold mb-6 text-slate-200 border-b border-white/10 pb-2">Submersible Hangar</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {SUBMARINES.map((sub) => {
                            const isOwned = ownedSubmarineIds.includes(sub.id);
                            const canAfford = coins >= sub.price;
                            const isSelected = selectedSub.id === sub.id;

                            return (
                                <div
                                    key={sub.id}
                                    onClick={() => isOwned && setSelectedSub(sub)}
                                    className={`relative border rounded-2xl p-6 text-left transition-all duration-300 ${isSelected ? 'border-cyan-400 bg-slate-800 shadow-[0_0_30px_rgba(6,182,212,0.2)] scale-105' : 'border-slate-700 bg-slate-800/50'} ${!isOwned ? 'opacity-90' : 'cursor-pointer hover:scale-105'}`}
                                >
                                    {!isOwned && (
                                        <div className="absolute top-2 right-2 text-slate-500">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                    )}
                                    
                                    <div 
                                        className="w-16 h-16 rounded-full mb-6 shadow-lg flex items-center justify-center"
                                        style={{ backgroundColor: sub.color }}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-black/20" />
                                    </div>

                                    <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-300 transition-colors">
                                    {sub.name}
                                    </h3>
                                    <p className="text-slate-400 text-xs leading-relaxed mb-4 min-h-[40px]">
                                    {sub.description}
                                    </p>

                                    <div className="space-y-2 mb-6">
                                        <div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold">
                                            <span>Hull Integrity</span>
                                            <span>{sub.maxHealth} HP</span>
                                        </div>
                                        <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500" style={{ width: `${(sub.maxHealth/150)*100}%` }}></div>
                                        </div>
                                        <div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold">
                                            <span>Ammo Capacity</span>
                                            <span>{sub.ammoCapacity} Rounds</span>
                                        </div>
                                        <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-yellow-500" style={{ width: `${(sub.ammoCapacity/50)*100}%` }}></div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    {isOwned ? (
                                        <div className={`w-full py-2 rounded text-center font-bold text-xs uppercase tracking-widest border ${isSelected ? 'bg-cyan-500 text-black border-cyan-500' : 'text-cyan-500 border-cyan-500/30'}`}>
                                            {isSelected ? 'Selected' : 'Select'}
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => onBuySubmarine(sub)}
                                            disabled={!canAfford}
                                            className={`w-full py-2 rounded flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest transition-colors ${canAfford ? 'bg-yellow-500 hover:bg-yellow-400 text-black' : 'bg-slate-700 text-slate-400 cursor-not-allowed'}`}
                                        >
                                            {sub.price > 0 ? (
                                                <>
                                                    <Coins className="w-3 h-3" /> Buy {sub.price}
                                                </>
                                            ) : 'Free'}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};
