// @paths lib/persistence
import { describe, it, expect } from 'vitest';
import { createEnvelope } from '../envelope';
import { parseSaveFile, serializeSaveFile } from '../exportImport';

describe('serializeSaveFile / parseSaveFile', () => {
  it('round-trips an envelope through JSON', () => {
    const envelope = createEnvelope(1, { managerName: 'Ram', clubId: 1 });
    const json = serializeSaveFile(envelope, 'Before the derby');

    const parsed = parseSaveFile<typeof envelope.payload>(json);

    expect(parsed.envelope).toEqual(envelope);
    expect(parsed.label).toBe('Before the derby');
    expect(typeof parsed.exportedAt).toBe('number');
  });

  it('rejects JSON that is not a save file envelope', () => {
    expect(() => parseSaveFile('{"not":"a save"}')).toThrow(/valid Injury Time save file/);
    expect(() => parseSaveFile('null')).toThrow(/valid Injury Time save file/);
    expect(() => parseSaveFile('42')).toThrow(/valid Injury Time save file/);
  });

  it('rejects malformed JSON', () => {
    expect(() => parseSaveFile('not json')).toThrow();
  });
});
