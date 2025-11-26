
export enum BlockType {
  WATER = 0,
  CREATURE = 1,
  PLANT = 2,
  SUBMARINE = 99
}

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Submarine {
  id: string;
  name: string;
  description: string;
  color: string;      // Hull color hex
  accentColor: string; // Detail/Propeller color
  lightColor: string; // Window/Glow color
  maxHealth: number;  // For survival mode
  ammoCapacity: number;
  price: number;      // Cost in coins
}

export interface SeaEntity {
  id: string;
  name: string;
  emoji: string; // Fallback
  image: string; // Real photo URL
  depth: number; 
  color: string;
  scale: number;
  type: 'creature' | 'plant' | 'landmark' | 'treasure';
  hostile?: boolean; // For survival mode
  oceans?: string[]; // IDs of oceans where this entity appears (undefined = all)
}

export interface Mission {
  id: string;
  description: string;
  targetId: string; 
  reward: number;
  completed: boolean;
}

export interface Ocean {
  id: string;
  name: string;
  description: string;
  colorHex: string;
}

export type GameModeType = 'EXPLORATION' | 'SURVIVAL';

export interface GameState {
  depth: number; 
  selectedEntity: SeaEntity | null;
  fact: string | null;
  loadingFact: boolean;
  coins: number;
  lightOn: boolean;
  catalogedIds: string[]; // Track discovered creatures
  
  // Survival Mode Specifics
  gameMode: GameModeType;
  health: number;
  ammo: number;
  killedIds: string[]; // Track defeated enemies
}

export type AppMode = 'SPLASH' | 'INTRO' | 'MENU' | 'GAME' | 'GAME_OVER' | 'GAME_WON' | 'HOME';
