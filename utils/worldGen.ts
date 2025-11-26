
import { SEA_ENTITIES } from '../constants';
import { SeaEntity } from '../types';

// Default range increased to support wider view of the "timeline"
export function getVisibleEntities(currentDepth: number, range: number = 150, oceanId: string = 'pacific'): SeaEntity[] {
  return SEA_ENTITIES.filter(e => {
    // Check Depth
    const inRange = Math.abs(e.depth - currentDepth) < range;
    // Check Ocean (if undefined, it appears everywhere)
    const inOcean = !e.oceans || e.oceans.includes(oceanId);
    
    return inRange && inOcean;
  });
}
