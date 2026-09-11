// @paths lib/engine
/**
 * Deterministic PRNG (Mulberry32) for match engine.
 * Replaces Math.random() to ensure reproducible simulations and multiplayer sync.
 */

export class RNG {
  private state: number;

  constructor(seed: number) {
    this.state = seed;
  }

  /** Mulberry32 algorithm — fast, deterministic, good distribution */
  next(): number {
    this.state |= 0;
    this.state = (this.state + 0x6d2b79f5) | 0;
    let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Random float in [min, max) */
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  /** Random integer in [min, max] */
  int(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }

  /** True with probability p */
  chance(p: number): boolean {
    return this.next() < p;
  }
}

/** Create a seed from a string (for reproducible seeds from match IDs) */
export function seedFromString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}
