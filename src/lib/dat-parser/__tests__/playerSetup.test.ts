// @paths lib/dat-parser
import { describe, it, expect } from 'vitest';
import { parsePlayerSetupCfg, mergePlayerSetup } from '../playerSetup';
import type { CM2Club, CM2Name, CM2Staff } from '../parser';

const SAMPLE_CFG = `#NEW STUFF FOR CM 01/02

"RETIREMENT" "Alex" "Sir Alex Ferguson" "Ferguson" "Manchester United" 23 7 2002
"INT_RETIREMENT" "Tony" "" "Adams" "Arsenal"
"INJURY" "Lee" "" "Dixon" "Arsenal" "TORN_KNEE_LIG"
"INJURY" "Slaven" "" "Bilic" "" "PERMANENT_HIP_INJURY" 15
"LOAN" "Alex" "" "Manninger" "Arsenal" "Fiorentina" 30 6 2001 30 6 2002
"MANAGER_CONF" "Sergio" "" "Batista" "Argentinos Juniors" 7000
`;

function staffMember(overrides: Partial<CM2Staff>): CM2Staff {
  return {
    id: 0,
    firstName: -1,
    secondName: -1,
    commonName: -1,
    nation: 0,
    intApps: 0,
    intGoals: 0,
    clubJob: -2,
    player: -1,
    ...overrides,
  };
}

function nameTable(names: string[]): CM2Name[] {
  return names.map((name) => ({ name, id: 0, nation: 0, count: 0 }));
}

describe('parsePlayerSetupCfg', () => {
  it('parses RETIREMENT records with a full date', () => {
    const cfg = parsePlayerSetupCfg(SAMPLE_CFG);
    expect(cfg.retirements).toHaveLength(1);
    expect(cfg.retirements[0]).toEqual({
      firstName: 'Alex',
      commonName: 'Sir Alex Ferguson',
      lastName: 'Ferguson',
      clubName: 'Manchester United',
      date: { day: 23, month: 7, year: 2002 },
    });
  });

  it('parses INT_RETIREMENT records with no date', () => {
    const cfg = parsePlayerSetupCfg(SAMPLE_CFG);
    expect(cfg.intRetirements).toHaveLength(1);
    expect(cfg.intRetirements[0]).toEqual({
      firstName: 'Tony',
      commonName: '',
      lastName: 'Adams',
      clubName: 'Arsenal',
    });
  });

  it('parses INJURY records with and without a trailing severity number', () => {
    const cfg = parsePlayerSetupCfg(SAMPLE_CFG);
    expect(cfg.injuries).toHaveLength(2);
    expect(cfg.injuries[0]).toEqual({
      firstName: 'Lee',
      commonName: '',
      lastName: 'Dixon',
      clubName: 'Arsenal',
      injuryType: 'TORN_KNEE_LIG',
      severityDays: null,
    });
    expect(cfg.injuries[1]).toEqual({
      firstName: 'Slaven',
      commonName: '',
      lastName: 'Bilic',
      clubName: '',
      injuryType: 'PERMANENT_HIP_INJURY',
      severityDays: 15,
    });
  });

  it('parses LOAN records with start and end dates', () => {
    const cfg = parsePlayerSetupCfg(SAMPLE_CFG);
    expect(cfg.loans).toHaveLength(1);
    expect(cfg.loans[0]).toEqual({
      firstName: 'Alex',
      commonName: '',
      lastName: 'Manninger',
      fromClubName: 'Arsenal',
      toClubName: 'Fiorentina',
      startDate: { day: 30, month: 6, year: 2001 },
      endDate: { day: 30, month: 6, year: 2002 },
    });
  });

  it('ignores comments, blank lines, and out-of-scope record types', () => {
    const cfg = parsePlayerSetupCfg(SAMPLE_CFG);
    const total =
      cfg.retirements.length + cfg.intRetirements.length + cfg.injuries.length + cfg.loans.length;
    expect(total).toBe(5); // MANAGER_CONF line contributes nothing
  });
});

describe('mergePlayerSetup', () => {
  const firstNames = nameTable(['Tony', 'Lee', 'Alex']);
  const secondNames = nameTable(['Adams', 'Dixon', 'Manninger']);
  const commonNames: CM2Name[] = [];

  const arsenal: CM2Club = {
    id: 676,
    name: 'Arsenal',
    shortName: 'Arsenal',
    nation: 7,
    division: 1,
    lastDivision: 1,
    lastPosition: 2,
    cash: 0,
    stadium: 1,
    reputation: 180,
    manager: 1,
    assistantManager: -1,
    squad: [],
  };
  const fiorentina: CM2Club = { ...arsenal, id: 900, name: 'Fiorentina', shortName: 'Fiorentina' };
  const clubs = [arsenal, fiorentina];

  const tonyAdams = staffMember({ id: 101, firstName: 0, secondName: 0, clubJob: arsenal.id });
  const leeDixon = staffMember({ id: 102, firstName: 1, secondName: 1, clubJob: arsenal.id });
  const alexManninger = staffMember({ id: 103, firstName: 2, secondName: 2, clubJob: arsenal.id });
  const staff = [tonyAdams, leeDixon, alexManninger];

  it('matches an INT_RETIREMENT record to the right staff id and club id', () => {
    const cfg = parsePlayerSetupCfg(SAMPLE_CFG);
    const merged = mergePlayerSetup(cfg, staff, clubs, firstNames, secondNames, commonNames);

    expect(merged.intRetirements).toHaveLength(1);
    expect(merged.intRetirements[0].staffId).toBe(tonyAdams.id);
    expect(merged.intRetirements[0].clubId).toBe(arsenal.id);
  });

  it('matches an INJURY record to the right staff id', () => {
    const cfg = parsePlayerSetupCfg(SAMPLE_CFG);
    const merged = mergePlayerSetup(cfg, staff, clubs, firstNames, secondNames, commonNames);

    expect(merged.injuries).toHaveLength(1);
    expect(merged.injuries[0].staffId).toBe(leeDixon.id);
    expect(merged.injuries[0].injuryType).toBe('TORN_KNEE_LIG');

    // Slaven Bilic isn't in the synthetic staff list, so it's unmatched.
    expect(merged.unmatchedCounts.injuries).toBe(1);
  });

  it('matches a LOAN record and resolves both the from- and to-club ids', () => {
    const cfg = parsePlayerSetupCfg(SAMPLE_CFG);
    const merged = mergePlayerSetup(cfg, staff, clubs, firstNames, secondNames, commonNames);

    expect(merged.loans).toHaveLength(1);
    expect(merged.loans[0].staffId).toBe(alexManninger.id);
    expect(merged.loans[0].fromClubId).toBe(arsenal.id);
    expect(merged.loans[0].toClubId).toBe(fiorentina.id);
  });

  it('leaves a RETIREMENT record unmatched when no staff record has that name', () => {
    const cfg = parsePlayerSetupCfg(SAMPLE_CFG);
    const merged = mergePlayerSetup(cfg, staff, clubs, firstNames, secondNames, commonNames);

    // "Sir Alex Ferguson" isn't among the players in this synthetic staff list.
    expect(merged.retirements).toHaveLength(0);
    expect(merged.unmatchedCounts.retirements).toBe(1);
  });

  it('disambiguates same-named staff at different clubs using the club hint', () => {
    const decoyDixon = staffMember({ id: 200, firstName: 1, secondName: 1, clubJob: fiorentina.id });
    const cfg = parsePlayerSetupCfg(SAMPLE_CFG);
    const merged = mergePlayerSetup(
      cfg,
      [...staff, decoyDixon],
      clubs,
      firstNames,
      secondNames,
      commonNames
    );

    expect(merged.injuries).toHaveLength(1);
    expect(merged.injuries[0].staffId).toBe(leeDixon.id);
  });
});
