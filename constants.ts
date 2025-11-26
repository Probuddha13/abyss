
import { SeaEntity, Submarine, Ocean } from './types';

export const MAX_DEPTH = 11000; // Mariana Trench

export const OCEANS: Ocean[] = [
  { id: 'pacific', name: 'Pacific Ocean', description: 'The deepest ocean. Home to the Ring of Fire and the Mariana Trench.', colorHex: '#002F6C' }, // Deep Navy
  { id: 'atlantic', name: 'Atlantic Ocean', description: 'Famous for historical shipwrecks like the Titanic and turbulent waters.', colorHex: '#1A5F7A' }, // Teal/Greenish
  { id: 'indian', name: 'Indian Ocean', description: 'Warm, tropical waters teeming with vibrant coral reefs.', colorHex: '#008B8B' }, // Cyan/Turquoise
];

export const SUBMARINES: Submarine[] = [
  {
    id: 'classic',
    name: 'The Canary',
    description: 'The classic yellow submersible. Reliable, highly visible, and perfect for tourism.',
    color: '#FFC107',
    accentColor: '#37474F',
    lightColor: '#00FFFF',
    maxHealth: 100,
    ammoCapacity: 20,
    price: 0
  },
  {
    id: 'stealth',
    name: 'Shadow Ray',
    description: 'A military-grade stealth vessel designed for deep reconnaissance missions.',
    color: '#1F2937',
    accentColor: '#111827',
    lightColor: '#EF4444',
    maxHealth: 80,
    ammoCapacity: 50,
    price: 500
  },
  {
    id: 'research',
    name: 'Deep Science',
    description: 'High-tech research vessel equipped with advanced sensors and white plating.',
    color: '#E0E7FF',
    accentColor: '#3B82F6',
    lightColor: '#60A5FA',
    maxHealth: 120,
    ammoCapacity: 10,
    price: 1000
  }
];

export const ZONES = [
  { name: 'Epipelagic Zone (Sunlight)', depth: 0, color: '#66CDAA' },
  { name: 'Mesopelagic Zone (Twilight)', depth: 200, color: '#0077BE' },
  { name: 'Bathypelagic Zone (Midnight)', depth: 1000, color: '#00008B' },
  { name: 'Abyssopelagic Zone (Abyss)', depth: 4000, color: '#191970' },
  { name: 'Hadalpelagic Zone (The Trenches)', depth: 6000, color: '#000000' },
];

export const MISSION_TEMPLATES = [
  { description: 'Locate a Giant Squid', targetId: 'squid', reward: 100 },
  { description: 'Scan the RMS Titanic', targetId: 'titanic', reward: 500 },
  { description: 'Find a Clownfish', targetId: 'clownfish', reward: 20 },
  { description: 'Analyze a Goblin Shark', targetId: 'goblin', reward: 150 },
  { description: 'Discover the Mariana Snailfish', targetId: 'snailfish', reward: 300 },
  { description: 'Find a Plastic Bag (Clean it up!)', targetId: 'plastic', reward: 50 },
  { description: 'Spot an Anglerfish', targetId: 'angler', reward: 120 },
  { description: 'Scan a Sperm Whale', targetId: 'sperm-whale', reward: 200 },
  { description: 'Find the Trieste Bathyscaphe', targetId: 'trieste', reward: 1000 },
  { description: 'Analyze Giant Tube Worms', targetId: 'tube-worms', reward: 150 },
  { description: 'Recover Pirate Gold', targetId: 'treasure', reward: 500 },
];

// Helper to generate consistent, high-quality images based on entity name
const getImg = (name: string) => `https://image.pollinations.ai/prompt/hyper-realistic%203D%20render%20of%20${encodeURIComponent(name)}%20underwater%20cinematic%20lighting%208k%20detailed%20texture%20isolated%20on%20black%20background?width=512&height=512&nologo=true&seed=${name.length}`;

export const SEA_ENTITIES: SeaEntity[] = [
  // --- 0m to 200m (Sunlight Zone) ---
  { id: 'salmon', name: 'Atlantic Salmon', emoji: '🐟', image: getImg('Atlantic Salmon fish'), depth: 3, color: '#C0C0C0', scale: 1, type: 'creature', oceans: ['atlantic', 'pacific'] },
  { id: 'kelp', name: 'Giant Kelp', emoji: '🌿', image: getImg('Giant Kelp Forest realistic'), depth: 5, color: '#228B22', scale: 4, type: 'plant', oceans: ['pacific'] },
  { id: 'polar-bear', name: 'Polar Bear', emoji: '🐻‍❄️', image: getImg('Polar Bear swimming underwater realistic'), depth: 10, color: '#F0F8FF', scale: 3, type: 'creature', hostile: true, oceans: ['atlantic'] },
  { id: 'clownfish', name: 'Clownfish', emoji: '🐠', image: getImg('Clownfish realistic'), depth: 15, color: '#FF7F50', scale: 0.8, type: 'creature', oceans: ['indian', 'pacific'] },
  { id: 'pirate-ship', name: 'Sunken Pirate Ship', emoji: '🏴‍☠️', image: getImg('Sunken Pirate Ship Wreck 3d'), depth: 25, color: '#8B4513', scale: 10, type: 'landmark', oceans: ['atlantic', 'indian'] },
  { id: 'brain-coral', name: 'Brain Coral', emoji: '🪸', image: getImg('Brain Coral reef'), depth: 18, color: '#FF69B4', scale: 1.5, type: 'plant', oceans: ['indian'] },
  { id: 'manatee', name: 'Manatee', emoji: '🦭', image: getImg('Manatee dugong'), depth: 20, color: '#808080', scale: 3.5, type: 'creature', oceans: ['atlantic'] },
  { id: 'striped-bass', name: 'Striped Bass', emoji: '🐟', image: getImg('Striped Bass fish'), depth: 30, color: '#778899', scale: 1.2, type: 'creature', oceans: ['atlantic'] },
  { id: 'treasure-1', name: 'Lost Gold Chest', emoji: '💰', image: getImg('Underwater Gold Treasure Chest glowing'), depth: 45, color: '#FFD700', scale: 1.5, type: 'treasure' },
  { id: 'sea-anemone', name: 'Sea Anemone', emoji: '🏵️', image: getImg('Sea Anemone'), depth: 40, color: '#E9967A', scale: 1, type: 'plant' },
  { id: 'penguin', name: 'Emperor Penguin', emoji: '🐧', image: getImg('Emperor Penguin swimming underwater'), depth: 50, color: '#000000', scale: 1.5, type: 'creature', oceans: ['atlantic'] }, // Antarctica is essentially accessible via Southern Atlantic logic here
  { id: 'shark-reef', name: 'Reef Shark', emoji: '🦈', image: getImg('Reef Shark'), depth: 70, color: '#708090', scale: 2.5, type: 'creature', hostile: true, oceans: ['pacific', 'indian'] },
  { id: 'orca', name: 'Killer Whale', emoji: '🐋', image: getImg('Killer Whale Orca'), depth: 100, color: '#FFFFFF', scale: 6, type: 'creature', hostile: true },
  { id: 'turtle', name: 'Green Sea Turtle', emoji: '🐢', image: getImg('Green Sea Turtle'), depth: 120, color: '#228B22', scale: 2, type: 'creature' },
  { id: 'lionfish', name: 'Lionfish', emoji: '🐠', image: getImg('Lionfish'), depth: 140, color: '#FF4500', scale: 1, type: 'creature', hostile: true, oceans: ['indian', 'pacific'] },
  { id: 'sunfish', name: 'Ocean Sunfish', emoji: '🐟', image: getImg('Ocean Sunfish Mola Mola'), depth: 180, color: '#A9A9A9', scale: 4, type: 'creature' },

  // --- 200m to 1000m (Twilight Zone) ---
  { id: 'wolf-eel', name: 'Wolf Eel', emoji: '🐍', image: getImg('Wolf Eel'), depth: 210, color: '#8B4513', scale: 2, type: 'creature', hostile: true, oceans: ['pacific'] },
  { id: 'oarfish', name: 'Giant Oarfish', emoji: '🐉', image: getImg('Giant Oarfish'), depth: 250, color: '#C0C0C0', scale: 7, type: 'creature', oceans: ['pacific', 'indian'] },
  { id: 'great-white', name: 'Great White Shark', emoji: '🦈', image: getImg('Great White Shark'), depth: 300, color: '#A9A9A9', scale: 5, type: 'creature', hostile: true },
  { id: 'temple', name: 'Ancient Temple', emoji: '🏛️', image: getImg('Underwater Greek Temple Ruins 3d'), depth: 320, color: '#A9A9A9', scale: 8, type: 'landmark', oceans: ['indian'] },
  { id: 'angel-shark', name: 'Angel Shark', emoji: '🦈', image: getImg('Angel Shark'), depth: 350, color: '#D2B48C', scale: 3, type: 'creature', hostile: true },
  { id: 'tuna', name: 'Bigeye Tuna', emoji: '🐟', image: getImg('Bigeye Tuna'), depth: 400, color: '#000080', scale: 2.5, type: 'creature' },
  { id: 'crab', name: 'Japanese Spider Crab', emoji: '🦀', image: getImg('Japanese Spider Crab'), depth: 450, color: '#CD5C5C', scale: 3.5, type: 'creature', oceans: ['pacific'] },
  { id: 'treasure-2', name: 'Ancient Vase', emoji: '🏺', image: getImg('Ancient Underwater Vase'), depth: 480, color: '#CD853F', scale: 1.2, type: 'treasure' },
  { id: 'swordfish', name: 'Swordfish', emoji: '⚔️', image: getImg('Swordfish'), depth: 550, color: '#708090', scale: 3.5, type: 'creature', hostile: true },
  { id: 'nautilus', name: 'Chambered Nautilus', emoji: '🐚', image: getImg('Chambered Nautilus'), depth: 600, color: '#F5DEB3', scale: 1, type: 'creature', oceans: ['indian', 'pacific'] },
  { id: 'squid', name: 'Giant Squid', emoji: '🦑', image: getImg('Giant Squid'), depth: 700, color: '#8B0000', scale: 9, type: 'creature', hostile: true },
  { id: 'viperfish', name: 'Pacific Viperfish', emoji: '🦷', image: getImg('Pacific Viperfish'), depth: 900, color: '#4B0082', scale: 1, type: 'creature', hostile: true, oceans: ['pacific'] },

  // --- 1000m to 4000m (Midnight Zone) ---
  { id: 'angler', name: 'Anglerfish', emoji: '🔦', image: getImg('Deep Sea Anglerfish monster'), depth: 1000, color: '#2F4F4F', scale: 1.5, type: 'creature', hostile: true },
  { id: 'gulper', name: 'Gulper Eel', emoji: '🐍', image: getImg('Gulper Eel'), depth: 1100, color: '#000000', scale: 1.5, type: 'creature', hostile: true },
  { id: 'blobfish', name: 'Blobfish', emoji: '🍮', image: getImg('Blobfish underwater 3d'), depth: 1200, color: '#FFC0CB', scale: 1, type: 'creature', oceans: ['pacific'] },
  { id: 'goblin', name: 'Goblin Shark', emoji: '🦈', image: getImg('Goblin Shark'), depth: 1300, color: '#FFB6C1', scale: 3.5, type: 'creature', hostile: true, oceans: ['pacific', 'indian'] },
  { id: 'vampire', name: 'Vampire Squid', emoji: '🧛', image: getImg('Vampire Squid glowing'), depth: 1500, color: '#800000', scale: 2, type: 'creature', hostile: true },
  { id: 'lost-city', name: 'Lost City Ruins', emoji: '🏙️', image: getImg('Atlantis Underwater City Ruins 3d'), depth: 1800, color: '#2F4F4F', scale: 15, type: 'landmark', oceans: ['atlantic'] },
  { id: 'colossal', name: 'Colossal Squid', emoji: '🦑', image: getImg('Colossal Squid monster'), depth: 2200, color: '#DC143C', scale: 12, type: 'creature', hostile: true, oceans: ['atlantic'] },
  { id: 'sperm-whale', name: 'Sperm Whale', emoji: '🐳', image: getImg('Sperm Whale'), depth: 2250, color: '#708090', scale: 14, type: 'creature' },
  { id: 'tube-worms', name: 'Giant Tube Worms', emoji: '🎋', image: getImg('Giant Tube Worms'), depth: 2500, color: '#FF0000', scale: 2.5, type: 'plant', oceans: ['pacific'] },
  { id: 'dumbo', name: 'Dumbo Octopus', emoji: '🐙', image: getImg('Dumbo Octopus'), depth: 3000, color: '#E6E6FA', scale: 1.5, type: 'creature' },
  { id: 'treasure-3', name: 'Gemstone Cluster', emoji: '💎', image: getImg('Glowing Underwater Gemstones crystal'), depth: 3500, color: '#00FFFF', scale: 1.5, type: 'treasure' },
  { id: 'titanic', name: 'RMS Titanic', emoji: '🚢', image: getImg('Titanic Wreck Underwater 3d'), depth: 3800, color: '#696969', scale: 20, type: 'landmark', oceans: ['atlantic'] },

  // --- 4000m+ (Abyss & Hadal) ---
  { id: 'fangtooth', name: 'Fangtooth', emoji: '🦷', image: getImg('Fangtooth Fish'), depth: 4200, color: '#483D8B', scale: 0.8, type: 'creature', hostile: true },
  { id: 'comb-jelly', name: 'Comb Jelly', emoji: '🎐', image: getImg('Deep Sea Comb Jelly bioluminescent'), depth: 5500, color: '#FF00FF', scale: 1, type: 'creature' },
  { id: 'treasure-4', name: 'Alien Artifact', emoji: '💠', image: getImg('Glowing Alien Artifact Underwater sci-fi'), depth: 7000, color: '#39FF14', scale: 2, type: 'treasure', oceans: ['pacific'] },
  { id: 'snailfish', name: 'Mariana Snailfish', emoji: '🐌', image: getImg('Mariana Snailfish'), depth: 8000, color: '#FFF0F5', scale: 0.8, type: 'creature', oceans: ['pacific'] },
  { id: 'plastic', name: 'Plastic Bag', emoji: '🛍️', image: getImg('Plastic Bag floating underwater'), depth: 10898, color: '#FFFFFF', scale: 1, type: 'landmark' },
  { id: 'trieste', name: 'Trieste Bathyscaphe', emoji: '⚓', image: getImg('Trieste Bathyscaphe'), depth: 10911, color: '#2F4F4F', scale: 5, type: 'landmark', oceans: ['pacific'] },
];
