/**
 * Errors (decisions doc #1).
 */

export type SaveCorruptionErrorCode =
  | 'envelope-shape'
  | 'schema-not-numeric'
  | 'schema-too-new'
  | 'missing-migration'
  | 'payload-shape'
  | 'import-shape';

export class SaveCorruptionError extends Error {
  public readonly code: SaveCorruptionErrorCode;

  constructor(message: string, code: SaveCorruptionErrorCode) {
    super(message);
    this.name = 'SaveCorruptionError';
    this.code = code;
  }
}
