
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, Stars, Line, Html, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { SeaEntity, Submarine, GameModeType } from '../types';
import { ZONES } from '../constants';

// Fix: Add global declaration for React Three Fiber intrinsic elements to resolve TS errors
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      pointLight: any;
      directionalLight: any;
      group: any;
      mesh: any;
      instancedMesh: any;
      sphereGeometry: any;
      meshBasicMaterial: any;
      meshStandardMaterial: any;
      capsuleGeometry: any;
      cylinderGeometry: any;
      boxGeometry: any;
      coneGeometry: any;
      circleGeometry: any;
      planeGeometry: any;
      torusGeometry: any;
      [elemName: string]: any;
    }
  }
}

interface SceneProps {
  depth: number;
  entities: SeaEntity[];
  submarine: Submarine;
  lightOn: boolean;
  onEntityClick: (entity: SeaEntity) => void;
  onShoot: (entityId: string) => void;
  catalogedIds: string[];
  killedIds: string[];
  gameMode: GameModeType;
  firingAtId: string | null; 
  onMissileHit: (id: string) => void;
  isPaused: boolean;
  baseColor?: string; // Ocean tint
}

// --- UTILS ---

const CameraController: React.FC<{ depth: number }> = ({ depth }) => {
    useFrame((state) => {
        // Smooth camera follow
        state.camera.position.y = -depth;
        state.camera.updateProjectionMatrix();
    });
    return null;
};

// Deterministic random position based on ID
const getProceduralPosition = (id: string, depth: number) => {
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = ((hash << 5) - hash) + id.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    
    const rand = (Math.abs(hash) % 1000) / 1000;
    const side = hash % 2 === 0 ? 1 : -1;
    
    // Spread X between 6 and 18 (avoid center 0-5)
    const x = side * (6 + (rand * 12));
    
    // Spread Z between -5 and 5
    const z = (rand * 10) - 5;

    return { x, z, side };
};

// --- COMPONENTS ---

const DetailedSubmarine: React.FC<{ sub: Submarine; lightOn: boolean; isPaused: boolean }> = ({ sub, lightOn, isPaused }) => {
    const propRef = useRef<THREE.Group>(null);
    
    useFrame((state, delta) => {
        if (propRef.current && !isPaused) {
            propRef.current.rotation.z += delta * 10;
        }
    });

    return (
        <group rotation={[0, Math.PI / 2, 0]}>
            {/* Main Hull */}
            <mesh castShadow receiveShadow>
                <capsuleGeometry args={[0.8, 3.5, 4, 16]} />
                <meshStandardMaterial color={sub.color} roughness={0.3} metalness={0.6} />
            </mesh>

            {/* Ballast Tanks (Sides) */}
            <group position={[0, -0.2, 0]}>
                <mesh position={[0, 0, 0.9]}>
                    <cylinderGeometry args={[0.3, 0.3, 2.5]} />
                    <meshStandardMaterial color={sub.accentColor} roughness={0.5} metalness={0.4} />
                </mesh>
                <mesh position={[0, 0, -0.9]}>
                    <cylinderGeometry args={[0.3, 0.3, 2.5]} />
                    <meshStandardMaterial color={sub.accentColor} roughness={0.5} metalness={0.4} />
                </mesh>
            </group>

            {/* Conning Tower */}
            <group position={[-0.2, 1, 0]}>
                <mesh>
                    <cylinderGeometry args={[0.5, 0.6, 0.8]} />
                    <meshStandardMaterial color={sub.accentColor} roughness={0.4} metalness={0.5} />
                </mesh>
                {/* Periscope / Antenna */}
                <mesh position={[0, 0.6, 0]}>
                    <cylinderGeometry args={[0.1, 0.1, 0.8]} />
                    <meshStandardMaterial color="#999" metalness={0.8} />
                </mesh>
                {/* Top Hatch */}
                <mesh position={[0, 0.41, 0]} rotation={[0, 0, 0]}>
                     <torusGeometry args={[0.3, 0.05, 8, 16]} />
                     <meshStandardMaterial color="#333" />
                </mesh>
            </group>

            {/* Front Viewport (Bulbous) */}
            <mesh position={[1.4, 0.1, 0]}>
                <sphereGeometry args={[0.6, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} rotation={[0, -Math.PI/2, 0]}/>
                <meshStandardMaterial 
                    color={sub.lightColor} 
                    emissive={sub.lightColor}
                    emissiveIntensity={lightOn ? 1 : 0.2}
                    transparent opacity={0.9}
                    roughness={0}
                    metalness={0.9}
                />
            </mesh>
            {/* Window Rim */}
            <mesh position={[1.35, 0.1, 0]} rotation={[0, 0, Math.PI/2]}>
                <torusGeometry args={[0.6, 0.1, 8, 32]} />
                <meshStandardMaterial color="#333" />
            </mesh>

            {/* Rear Engine / Propeller */}
            <group position={[-1.8, 0, 0]}>
                 <mesh rotation={[0, 0, Math.PI/2]}>
                    <cylinderGeometry args={[0.2, 0.6, 0.5]} />
                    <meshStandardMaterial color="#222" />
                 </mesh>
                 <group ref={propRef} position={[-0.3, 0, 0]} rotation={[0, 0, Math.PI/2]}>
                     <mesh>
                         <boxGeometry args={[0.1, 1.2, 0.15]} />
                         <meshStandardMaterial color="#888" metalness={1} />
                     </mesh>
                     <mesh rotation={[Math.PI/2, 0, 0]}>
                         <boxGeometry args={[0.1, 1.2, 0.15]} />
                         <meshStandardMaterial color="#888" metalness={1} />
                     </mesh>
                 </group>
            </group>

            {/* Fins */}
            <mesh position={[-1.2, 0, 0]}>
                <boxGeometry args={[0.5, 0.1, 2.2]} />
                <meshStandardMaterial color={sub.accentColor} />
            </mesh>
             <mesh position={[-1.2, 0, 0]}>
                <boxGeometry args={[0.5, 2.2, 0.1]} />
                <meshStandardMaterial color={sub.accentColor} />
            </mesh>

        </group>
    );
};

const Bubbles = ({ depth, isPaused }: { depth: number, isPaused: boolean }) => {
  const count = 150;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    return new Array(count).fill(0).map(() => ({
        x: (Math.random() - 0.5) * 50,
        yOffset: Math.random() * 60,
        z: (Math.random() - 0.5) * 20,
        speed: 0.5 + Math.random() * 1.5,
        scale: 0.2 + Math.random() * 0.5
    }));
  }, []);

  useFrame((state) => {
    if(!meshRef.current || isPaused) return;
    const t = state.clock.elapsedTime;
    
    particles.forEach((p, i) => {
        const currentWorldY = -depth;
        const flow = (t * p.speed + p.yOffset) % 60;
        const y = currentWorldY + flow - 30;
        
        dummy.position.set(p.x, y, p.z);
        const s = p.scale + Math.sin(t * 2 + i) * 0.1;
        dummy.scale.set(s, s, s);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.5, 8, 8]} />
      <meshBasicMaterial color="#AFEEEE" transparent opacity={0.4} />
    </instancedMesh>
  );
};

const Explosion: React.FC<{ position: THREE.Vector3; onComplete: () => void, isPaused: boolean }> = ({ position, onComplete, isPaused }) => {
    const group = useRef<THREE.Group>(null);
    
    useFrame((state, delta) => {
        if (group.current && !isPaused) {
            group.current.scale.multiplyScalar(1.1);
            group.current.children.forEach((child: any) => {
                if (child.material) child.material.opacity -= delta * 2;
            });
            if (group.current.children[0].material.opacity <= 0) {
                onComplete();
            }
        }
    });

    return (
        <group ref={group} position={position}>
            <mesh>
                <sphereGeometry args={[1, 16, 16]} />
                <meshBasicMaterial color="orange" transparent opacity={1} />
            </mesh>
            <mesh scale={[0.8, 0.8, 0.8]}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshBasicMaterial color="yellow" transparent opacity={1} />
            </mesh>
             <mesh scale={[1.2, 1.2, 1.2]}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshBasicMaterial color="red" transparent opacity={0.5} wireframe />
            </mesh>
        </group>
    );
};

const Missile: React.FC<{ 
    startPos: THREE.Vector3; 
    targetId: string; 
    entityPositions: React.MutableRefObject<Record<string, THREE.Vector3>>;
    onHit: (hitPos: THREE.Vector3) => void;
    isPaused: boolean;
}> = ({ startPos, targetId, entityPositions, onHit, isPaused }) => {
    const ref = useRef<THREE.Group>(null);
    const speed = 25; // Fast but visible
    
    useFrame((state, delta) => {
        if (!ref.current || isPaused) return;
        
        // Homing Logic: Always look up the current position of the target
        const currentTargetPos = entityPositions.current[targetId];
        
        // If target doesn't exist anymore (removed/killed), explode at last known location
        if (!currentTargetPos) {
             onHit(ref.current.position); 
             return;
        }

        const dir = new THREE.Vector3().subVectors(currentTargetPos, ref.current.position).normalize();
        const dist = ref.current.position.distanceTo(currentTargetPos);
        
        if (dist < 1.5) { // Hit radius
            onHit(currentTargetPos);
        } else {
            ref.current.position.add(dir.multiplyScalar(speed * delta));
            ref.current.lookAt(currentTargetPos);
        }
    });

    return (
        <group ref={ref} position={startPos}>
            {/* Missile Body */}
            <mesh rotation={[Math.PI/2, 0, 0]}>
                <capsuleGeometry args={[0.2, 1.5, 4, 8]} />
                <meshStandardMaterial color="#FF4400" emissive="#FF0000" emissiveIntensity={2} />
            </mesh>
            {/* Engine Glow */}
            <pointLight color="orange" intensity={3} distance={8} decay={2} position={[0, 0, 1]} />
            {/* Trail Effect (Simple) */}
            <mesh position={[0, 0, 1.5]} rotation={[Math.PI/2, 0, 0]}>
                <coneGeometry args={[0.3, 2, 8]} />
                <meshBasicMaterial color="yellow" transparent opacity={0.6} />
            </mesh>
        </group>
    );
};

const SpriteCreature: React.FC<{ 
    entity: SeaEntity; 
    initialPos: { x: number, z: number };
    onClick: () => void; 
    onShoot: () => void; 
    side: number; 
    isCataloged: boolean;
    gameMode: GameModeType;
    isDying: boolean;
    updatePosition: (id: string, pos: THREE.Vector3) => void;
    isPaused: boolean;
}> = ({ entity, initialPos, onClick, onShoot, side, isCataloged, gameMode, isDying, updatePosition, isPaused }) => {
  const group = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  
  // Load Texture manually to ensure we have it for the mesh
  useEffect(() => {
    if (entity.image) {
        new THREE.TextureLoader().load(entity.image, (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            setTexture(tex);
        });
    }
  }, [entity.image]);
  
  // Initialize Position
  useEffect(() => {
      if (group.current) {
          group.current.position.x = initialPos.x;
          group.current.position.z = initialPos.z;
      }
  }, [initialPos]);

  // Animation Loop
  useFrame((state, delta) => {
    if (group.current && !isPaused) {
      const t = state.clock.elapsedTime;

      // 1. Update world position for missile targeting
      const worldPos = new THREE.Vector3();
      group.current.getWorldPosition(worldPos);
      updatePosition(entity.id, worldPos);

      // 2. Death Animation
      if (isDying) {
          group.current.rotation.z += delta * 10; // Spin fast
          group.current.scale.multiplyScalar(0.9); // Shrink
          return;
      }
      
      // 3. Standard Movement
      group.current.position.y = Math.sin(t + entity.depth * 0.1) * 0.3;
      group.current.rotation.z = Math.sin(t * 2) * 0.05;

      // 3b. 3D Tilt Effect based on Camera
      if (meshRef.current) {
          // Subtle look-at camera to simulate 3D sprite
          meshRef.current.lookAt(state.camera.position);
      }

      // 4. Survival Chasing
      if (gameMode === 'SURVIVAL' && entity.hostile) {
          // Lerp X towards 0 (Player)
          group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, 0, delta * 0.5);
          group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, 0, delta * 0.5);
          
          // Aggro pulsation
          const breath = 1 + Math.sin(t * 10) * 0.1;
          group.current.scale.setScalar(entity.scale * breath);
      } else {
          group.current.scale.setScalar(entity.scale * (hovered ? 1.2 : 1));
      }
    }
  });

  const isLeft = side === -1;
  const isHostile = gameMode === 'SURVIVAL' && entity.hostile;

  return (
    <group>
        <group 
            ref={group}
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            onPointerOver={() => { document.body.style.cursor = gameMode === 'SURVIVAL' ? 'crosshair' : 'pointer'; setHover(true); }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; setHover(false); }}
        >
            {/* 3D Plane Mesh for "Real" 3D feel using the texture */}
            {texture && (
                <mesh ref={meshRef} scale={[isLeft ? 1 : -1, 1, 1]}>
                    <planeGeometry args={[3, 3]} />
                    <meshStandardMaterial 
                        map={texture} 
                        transparent 
                        alphaTest={0.5} 
                        roughness={0.4} 
                        metalness={0.1}
                        side={THREE.DoubleSide}
                        emissive={isHostile ? "#FF0000" : "#000000"}
                        emissiveIntensity={isHostile ? 0.5 : 0}
                    />
                </mesh>
            )}

            {/* CRITICAL: HTML Hitbox for HUD Crosshair detection */}
            {/* This Invisible Div allows document.elementFromPoint to find the target */}
            <Html position={[0, 0, 0]} center zIndexRange={[100, 0]}>
               <div 
                 data-entity-id={entity.id}
                 onClick={(e) => { e.stopPropagation(); onClick(); }}
                 style={{ 
                     width: `${100 * entity.scale}px`, 
                     height: `${100 * entity.scale}px`,
                     // border: '1px solid red', // Uncomment to debug hitboxes
                     pointerEvents: 'auto', 
                 }}
               />
            </Html>

            {/* Hostile Marker */}
            {isHostile && !isDying && (
                <mesh position={[0, 0, -0.5]}>
                    <circleGeometry args={[1.5, 32]} />
                    <meshBasicMaterial color="#FF0000" transparent opacity={0.3} />
                </mesh>
            )}

            {/* Label - Keep HTML for readability */}
            {!isDying && (
                <Html position={[0, -1.8, 0]} center zIndexRange={[50, 0]}>
                    <div className={`flex flex-col items-center transition-opacity duration-300 ${hovered || isCataloged || isHostile || gameMode === 'EXPLORATION' ? 'opacity-100' : 'opacity-60'}`}>
                        <span className={`font-bold font-sans text-xs whitespace-nowrap px-2 py-1 rounded backdrop-blur-sm border transition-colors 
                            ${isHostile ? 'bg-red-900/60 border-red-500 text-red-200 animate-pulse' : 'bg-black/60 border-white/10 text-white/70'}`}>
                            {isHostile ? `TARGET: ${entity.name}` : entity.name}
                        </span>
                        <span className="text-cyan-300 text-[10px] font-mono mt-1 opacity-80">
                            {entity.depth}m
                        </span>
                    </div>
                </Html>
            )}
        </group>
    </group>
  );
};

const DepthRuler: React.FC<{ currentDepth: number }> = ({ currentDepth }) => {
  const visibleRange = 100;
  const start = Math.floor((currentDepth - visibleRange) / 50) * 50;
  const end = Math.floor((currentDepth + visibleRange) / 50) * 50;
  
  const ticks = [];
  for (let d = start; d <= end; d += 50) {
    if (d < 0) continue;
    ticks.push(
      <group key={d} position={[0, -d, -2]}>
         <Line 
           points={[[-4, 0, 0], [4, 0, 0]]} 
           color="white" 
           lineWidth={1} 
           transparent 
           opacity={0.15} 
         />
         <Text
           position={[0, 0.2, 0]}
           fontSize={0.6}
           color="white"
           fillOpacity={0.3}
           anchorX="center"
           anchorY="bottom"
         >
           {d} m
         </Text>
      </group>
    );
  }

  return (
    <group>
      <group position={[0, -currentDepth, -2]}>
        <Line 
          points={[[0, currentDepth - 150, 0], [0, currentDepth + 150, 0]]} 
          color="white" 
          lineWidth={1} 
          transparent 
          opacity={0.1} 
          dashed 
          dashSize={1} 
          gapSize={1} 
        />
      </group>
      {ticks}
    </group>
  );
};

const BackgroundManager: React.FC<{ depth: number; baseColor: string }> = ({ depth, baseColor }) => {
  useFrame((state) => {
    let targetColor = new THREE.Color(ZONES[0].color);
    for (let i = 0; i < ZONES.length; i++) {
      const currentZone = ZONES[i];
      const nextZone = ZONES[i + 1];
      if (depth >= currentZone.depth && (!nextZone || depth < nextZone.depth)) {
        if (nextZone) {
          const range = nextZone.depth - currentZone.depth;
          const progress = (depth - currentZone.depth) / range;
          targetColor.set(currentZone.color).lerp(new THREE.Color(nextZone.color), progress);
        } else {
          targetColor.set(currentZone.color);
        }
        break;
      }
    }
    
    // Tint with the specific Ocean color (e.g., more green for Atlantic)
    targetColor.lerp(new THREE.Color(baseColor), 0.3);
    
    state.scene.background = targetColor;

    const depthProgress = Math.min(depth / 4000, 1);
    const near = THREE.MathUtils.lerp(30, 15, depthProgress);
    const far = THREE.MathUtils.lerp(100, 50, depthProgress);
    state.scene.fog = new THREE.Fog(targetColor, near, far);
  });
  return null;
};

export const GameCanvas: React.FC<SceneProps> = ({ depth, entities, submarine, lightOn, onEntityClick, onShoot, catalogedIds, killedIds, gameMode, firingAtId, onMissileHit, isPaused, baseColor = "#000000" }) => {
  const playerY = -depth;

  // Track actual positions for missile guidance
  const entityPositions = useRef<Record<string, THREE.Vector3>>({});
  const handlePosUpdate = (id: string, pos: THREE.Vector3) => {
      entityPositions.current[id] = pos;
  };

  // Local state to handle "dying" phase (playing animation before removal)
  const [dyingIds, setDyingIds] = useState<string[]>([]);
  const [missiles, setMissiles] = useState<{id: string, targetId: string, start: THREE.Vector3}[]>([]);
  const [explosions, setExplosions] = useState<{id: string, pos: THREE.Vector3}[]>([]);

  // Trigger Missile Launch
  useEffect(() => {
      if (firingAtId) {
          const startPos = new THREE.Vector3(0, playerY, 5); // From Submarine
          setMissiles(prev => [
              ...prev, 
              { id: Date.now().toString(), targetId: firingAtId, start: startPos }
          ]);
      }
  }, [firingAtId, playerY]);

  const handleImpact = (missileId: string, targetId: string, hitPos: THREE.Vector3) => {
      // Remove Missile
      setMissiles(prev => prev.filter(m => m.id !== missileId));
      
      // Trigger Explosion
      setExplosions(prev => [...prev, { id: Date.now().toString(), pos: hitPos }]);
      
      // Trigger Dying Animation
      setDyingIds(prev => [...prev, targetId]);
      
      // Notify Logic (Score/Kill)
      onMissileHit(targetId);
  };

  // Remove Explosion after animation
  const handleExplosionDone = (id: string) => {
      setExplosions(prev => prev.filter(e => e.id !== id));
  };

  // Render if (Not Killed) OR (In Dying List).
  const renderList = entities.filter(e => !killedIds.includes(e.id) || dyingIds.includes(e.id));

  // Clean up dying IDs after delay
  useEffect(() => {
      if (dyingIds.length > 0 && !isPaused) {
          const t = setTimeout(() => {
              setDyingIds(prev => prev.filter(id => !killedIds.includes(id))); 
          }, 1000);
          return () => clearTimeout(t);
      }
  }, [dyingIds, killedIds, isPaused]);


  return (
    <Canvas camera={{ position: [0, 0, 30], fov: 45 }} dpr={[1, 2]}>
      <CameraController depth={depth} />
      <BackgroundManager depth={depth} baseColor={baseColor} />
      
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 5]} intensity={lightOn ? 1 : 0.2} />
      
      <pointLight 
        position={[0, playerY, 8]} 
        intensity={lightOn ? 0.8 : 0} 
        color={submarine.lightColor} 
        distance={40} 
        decay={1.5} 
      />

      <Bubbles depth={depth} isPaused={isPaused} />
      {depth < 200 && <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={0.5} />}

      <DepthRuler currentDepth={depth} />

      {/* PLAYER SUBMARINE - DETAILED MODEL */}
      <group position={[0, playerY, 5]}>
        <Float speed={isPaused ? 0 : 2} rotationIntensity={0.1} floatIntensity={0.2}>
            <DetailedSubmarine sub={submarine} lightOn={lightOn} isPaused={isPaused} />
        </Float>
      </group>

      {/* ENTITIES - SPREAD OUT */}
      {renderList.map((entity) => {
        const { x, z, side } = getProceduralPosition(entity.id, entity.depth);
        const isCataloged = catalogedIds.includes(entity.id);
        const isDying = dyingIds.includes(entity.id);

        return (
          <group key={entity.id} position={[0, -entity.depth, 0]}>
            <SpriteCreature 
                entity={entity} 
                initialPos={{x, z}}
                onClick={() => onEntityClick(entity)}
                onShoot={() => onShoot(entity.id)}
                side={side} 
                isCataloged={isCataloged}
                gameMode={gameMode}
                isDying={isDying}
                updatePosition={handlePosUpdate}
                isPaused={isPaused}
            />
            
            {/* Connection line - Dynamic start point */}
            {(!entity.hostile || gameMode !== 'SURVIVAL') && !isDying && (
                 <Line 
                    points={[
                        [x, 0, z], // Start at creature
                        [side === 1 ? -2 : 2, 0, -2] // End at ruler
                    ]}
                    color="white"
                    lineWidth={1}
                    transparent
                    opacity={0.1}
                />
            )}
          </group>
        );
      })}

      {/* ACTIVE MISSILES */}
      {missiles.map(m => (
          <Missile 
            key={m.id}
            startPos={m.start}
            targetId={m.targetId}
            entityPositions={entityPositions}
            onHit={(hitPos) => handleImpact(m.id, m.targetId, hitPos)}
            isPaused={isPaused}
          />
      ))}

      {/* EXPLOSIONS */}
      {explosions.map(e => (
          <Explosion 
            key={e.id} 
            position={e.pos} 
            onComplete={() => handleExplosionDone(e.id)} 
            isPaused={isPaused}
          />
      ))}

    </Canvas>
  );
};
