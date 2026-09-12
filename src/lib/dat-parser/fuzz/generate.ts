// @paths lib/dat-parser/fuzz
/**
 * CM-T09: seeded .dat corruption-matrix generator.
 *
 * Deterministic malformed-input factory for the fuzz suite. Given a valid
 * buffer (real corpus or synthetic), a seed and a corruption mode, returns a
 * corrupted ArrayBuffer. Same (seed, mode, params) → byte-identical output,
 * so every fuzz failure is reproducible from the seed alone.
 *
 * Corruption modes (CM-T09 card):
 *  - `truncate`  — cut to 0, 1, half, or structSize-1 bytes
 *  - `byte-flip` — flip 1..k random bytes (seeded positions)
 *  - `oversize`  — append seeded garbage past the real end
 *  - `field-order` — swap two adjacent word-sized regions in the first record
 *  - `empty`     — zero-length buffer
 *
 * Pure TS, no parser imports — operates on raw bytes only.
 */

/** Seeded PRNG: xmur3 hash → mulberry32 stream. Deterministic across machines. */
function seededRandom(seed: number): () => number {
  let h = seed >>> 0;
  const next = () => {
    h = (h + 0x6d2b79f5) >>> 0;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  // Warm up with a few draws so low seeds don't produce trivial streams.
  for (let i = 0; i < 4; i++) next();
  return next;
}

export type CorruptionMode =
  | 'truncate-0'
  | 'truncate-1'
  | 'truncate-half'
  | 'truncate-struct-minus-1'
  | 'byte-flip-single'
  | 'byte-flip-multi'
  | 'oversize'
  | 'field-order-swap'
  | 'empty';

export const ALL_MODES: readonly CorruptionMode[] = [
  'truncate-0',
  'truncate-1',
  'truncate-half',
  'truncate-struct-minus-1',
  'byte-flip-single',
  'byte-flip-multi',
  'oversize',
  'field-order-swap',
  'empty',
];

export interface CorruptionCase {
  mode: CorruptionMode;
  seed: number;
  /** Struct size in bytes, used by truncate-struct-minus-1 and field-order-swap. */
  structSize?: number;
}

/**
 * Generate a corrupted copy of `input` for the given case.
 * Never mutates `input`; never throws on valid input.
 */
export function corruptBuffer(input: ArrayBuffer, c: CorruptionCase): ArrayBuffer {
  const src = new Uint8Array(input);
  const rand = seededRandom(c.seed);

  switch (c.mode) {
    case 'empty':
    case 'truncate-0':
      return new ArrayBuffer(0);

    case 'truncate-1': {
      const out = new Uint8Array(1);
      out[0] = src[0] ?? 0;
      return out.buffer;
    }

    case 'truncate-half': {
      const half = Math.floor(src.length / 2);
      const out = new Uint8Array(half);
      out.set(src.subarray(0, half));
      return out.buffer;
    }

    case 'truncate-struct-minus-1': {
      const size = c.structSize ?? 1;
      const cut = Math.max(0, src.length - (size - 1));
      const out = new Uint8Array(cut);
      out.set(src.subarray(0, cut));
      return out.buffer;
    }

    case 'byte-flip-single': {
      const out = new Uint8Array(src);
      if (out.length > 0) {
        const pos = Math.floor(rand() * out.length);
        out[pos] ^= 0xff;
      }
      return out.buffer;
    }

    case 'byte-flip-multi': {
      const out = new Uint8Array(src);
      const flips = Math.min(8, Math.max(2, Math.floor(out.length / 1024)));
      for (let i = 0; i < flips && out.length > 0; i++) {
        const pos = Math.floor(rand() * out.length);
        out[pos] ^= 1 + Math.floor(rand() * 255);
      }
      return out.buffer;
    }

    case 'oversize': {
      const extra = 64 + Math.floor(rand() * 4096);
      const out = new Uint8Array(src.length + extra);
      out.set(src, 0);
      for (let i = src.length; i < out.length; i++) {
        out[i] = Math.floor(rand() * 256);
      }
      return out.buffer;
    }

    case 'field-order-swap': {
      const size = c.structSize ?? 4;
      const out = new Uint8Array(src);
      // Swap two adjacent word-aligned regions inside the first record.
      const word = 4;
      const a = Math.floor(rand() * Math.max(1, Math.floor(size / word) - 1)) * word;
      const b = a + word;
      for (let i = 0; i < word && b + i < out.length; i++) {
        const tmp = out[a + i];
        out[a + i] = out[b + i];
        out[b + i] = tmp;
      }
      return out.buffer;
    }
  }
}

/**
 * Full per-file matrix: every corruption mode × the given seeds.
 * structSize is optional; when omitted, truncate-struct-minus-1 and
 * field-order-swap fall back to safe defaults.
 */
export function buildMatrix(
  seeds: readonly number[],
  structSize?: number
): CorruptionCase[] {
  const cases: CorruptionCase[] = [];
  for (const mode of ALL_MODES) {
    for (const seed of seeds) {
      cases.push({ mode, seed, structSize });
    }
  }
  return cases;
}