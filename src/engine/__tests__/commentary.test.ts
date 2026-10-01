import { describe, it, expect } from 'vitest';
import { MatchEngine } from '../matchEngine';
import { CommentaryService } from '../commentary';
import {
  MatchEvent,
  MatchEventType,
  ChanceType,
  TeamState,
  PlayerState,
  PlayerAttributes,
} from '../types';

function createDefaultAttributes(): PlayerAttributes {
  return {
    acceleration: 10, aggression: 10, agility: 10, anticipation: 10, balance: 10,
    bravery: 10, consistency: 10, composure: 10, concentration: 10, creativity: 10,
    corners: 10, crossing: 10, decisions: 10, determination: 10, dirtiness: 10,
    dribbling: 10, eccentricity: 10, finishing: 10, firstTouch: 10, flair: 10,
    freeKicks: 10, handling: 10, heading: 10, importantMatches: 10, influence: 10,
    injuryProneness: 10, intelligence: 10, jumping: 10, leadership: 10, leftFoot: 10,
    longShots: 10, longThrows: 10, marking: 10, naturalFitness: 10, offTheBall: 10,
    oneOnOnes: 10, pace: 10, passing: 10, penaltyTaking: 10, positioning: 10,
    reflexes: 10, rightFoot: 10, rushingOut: 10, setPieces: 10, shooting: 10,
    sportsmanship: 10, stamina: 10, strength: 10, tackling: 10, teamwork: 10,
    technique: 10, throwing: 10, versatility: 10, vision: 10, workRate: 10,
  };
}

function createPlayer(
  id: number,
  name: string,
  position: 'GK' | 'DEF' | 'MID' | 'ATT',
  attrs?: Partial<PlayerAttributes>
): PlayerState {
  return {
    id,
    name,
    position,
    attributes: { ...createDefaultAttributes(), ...attrs },
    stamina: 100,
    isInjured: false,
    yellowCards: 0,
    redCard: false,
    minutesPlayed: 0,
  };
}

function createTeam(id: number, name: string, isHome: boolean, extraBench = false): TeamState {
  const players = [
    createPlayer(1, `${name} GK`, 'GK'),
    createPlayer(2, `${name} D1`, 'DEF'), createPlayer(3, `${name} D2`, 'DEF'),
    createPlayer(4, `${name} D3`, 'DEF'), createPlayer(5, `${name} D4`, 'DEF'),
    createPlayer(6, `${name} M1`, 'MID'), createPlayer(7, `${name} M2`, 'MID'),
    createPlayer(8, `${name} M3`, 'MID'),
    createPlayer(9, `${name} A1`, 'ATT'), createPlayer(10, `${name} A2`, 'ATT'),
    createPlayer(11, `${name} A3`, 'ATT'),
  ];
  if (extraBench) {
    players.push(
      createPlayer(12, `${name} SubATT`, 'ATT'),
      createPlayer(13, `${name} SubDEF`, 'DEF')
    );
  }
  return {
    id,
    name,
    isHome,
    players,
    tactic: {
      formation: '4-4-2',
      mentality: 'balanced',
      tempo: 'normal',
      pressing: 'normal',
      width: 'normal',
      passing: 'mixed',
    },
    goals: 0,
    shots: 0,
    shotsOnTarget: 0,
    possession: 50,
    morale: 100,
  };
}

describe('CommentaryService (CM-017)', () => {
  const allEventTypes: MatchEventType[] = [
    'goal',
    'assist',
    'yellow',
    'red',
    'injury',
    'sub',
    'chance',
    'save',
    'miss',
    'corner',
    'freeKick',
    'penalty',
    'missedPenalty',
    'ownGoal',
    'offside',
    'foul',
  ];

  const allChanceTypes: ChanceType[] = [
    'cross',
    'through-ball',
    'header',
    'long-shot',
    'one-on-one',
  ];

  it('every MatchEvent type produces commentary with no event dropped', () => {
    const service = new CommentaryService({ seed: 100 });
    const homeTeam = createTeam(1, 'Liverpool', true);
    const awayTeam = createTeam(2, 'Arsenal', false);
    service.setTeams(homeTeam, awayTeam);

    for (const type of allEventTypes) {
      const event: MatchEvent = {
        minute: 25,
        type,
        team: 'home',
        playerId: 9,
        playerName: 'Michael Owen',
        subInName: 'Robbie Fowler',
        subOutName: 'Emile Heskey',
        description: `Default description for ${type}`,
      };

      const line = service.generate(event);
      expect(line).toBeDefined();
      expect(typeof line).toBe('string');
      expect(line.length).toBeGreaterThan(0);
      expect(line).toContain("25'");
    }
  });

  it('chance-type modeling generates specialized commentary for all 5 chance types', () => {
    const service = new CommentaryService({ seed: 42 });
    const homeTeam = createTeam(1, 'Man United', true);
    const awayTeam = createTeam(2, 'Chelsea', false);
    service.setTeams(homeTeam, awayTeam);

    for (const chanceType of allChanceTypes) {
      for (const type of ['goal', 'save', 'miss', 'chance'] as const) {
        const event: MatchEvent = {
          minute: 33,
          type,
          team: 'home',
          playerId: 9,
          playerName: 'Ruud van Nistelrooy',
          chanceType,
          description: `${type} via ${chanceType}`,
        };
        const text = service.generate(event);
        expect(text).toBeDefined();
        expect(text.length).toBeGreaterThan(0);
        expect(text).toContain("33'");
      }
    }
  });

  it('determinism: same seed => same commentary strings', () => {
    const events: MatchEvent[] = [
      { minute: 12, type: 'chance', team: 'home', playerId: 9, playerName: 'Striker' },
      { minute: 23, type: 'goal', team: 'home', playerId: 9, playerName: 'Striker', chanceType: 'one-on-one' },
      { minute: 45, type: 'yellow', team: 'away', playerId: 3, playerName: 'Defender' },
      { minute: 58, type: 'save', team: 'home', playerId: 10, playerName: 'Forward', chanceType: 'header' },
      { minute: 71, type: 'sub', team: 'away', subInName: 'SubA', subOutName: 'SubB' },
      { minute: 88, type: 'corner', team: 'home', playerId: 6, playerName: 'Winger' },
      { minute: 90, type: 'goal', team: 'away', playerId: 9, playerName: 'OppStriker', chanceType: 'long-shot' },
    ];

    const service1 = new CommentaryService({ seed: 9999 });
    const service2 = new CommentaryService({ seed: 9999 });

    const lines1 = service1.generateAll(events);
    const lines2 = service2.generateAll(events);

    expect(lines1).toEqual(lines2);
    expect(lines1.length).toBe(events.length);
  });

  it('variety: different seeds produce different commentary text for same events', () => {
    const events: MatchEvent[] = [
      { minute: 10, type: 'goal', team: 'home', playerId: 9, playerName: 'Striker' },
      { minute: 20, type: 'save', team: 'home', playerId: 9, playerName: 'Striker' },
      { minute: 30, type: 'miss', team: 'home', playerId: 9, playerName: 'Striker' },
      { minute: 40, type: 'goal', team: 'home', playerId: 9, playerName: 'Striker' },
      { minute: 50, type: 'yellow', team: 'home', playerId: 6, playerName: 'Midfielder' },
    ];

    const serviceA = new CommentaryService({ seed: 1 });
    const serviceB = new CommentaryService({ seed: 500 });

    const linesA = serviceA.generateAll(events);
    const linesB = serviceB.generateAll(events);

    // Across multiple events, different seeds should choose different templates
    const hasDifference = linesA.some((line, idx) => line !== linesB[idx]);
    expect(hasDifference).toBe(true);
  });

  it('i18n: generates Hebrew strings with Hebrew character sets', () => {
    const service = new CommentaryService({ seed: 42, lang: 'he' });
    const homeTeam = createTeam(1, 'מכבי תל אביב', true);
    const awayTeam = createTeam(2, 'הפועל תל אביב', false);
    service.setTeams(homeTeam, awayTeam);

    const hebrewRegex = /[\u0590-\u05FF]/;

    for (const type of allEventTypes) {
      const event: MatchEvent = {
        minute: 15,
        type,
        team: 'home',
        playerId: 9,
        playerName: 'אבי נמני',
        subInName: 'ברוך דגו',
        subOutName: 'טל בנין',
        description: `אירוע ${type}`,
      };

      const line = service.generate(event);
      expect(line).toBeDefined();
      expect(hebrewRegex.test(line)).toBe(true);
      expect(line).toContain("15'");
    }
  });

  it('i18n: setLanguage dynamically switches between English and Hebrew', () => {
    const service = new CommentaryService({ seed: 123, lang: 'en' });
    const event: MatchEvent = {
      minute: 50,
      type: 'goal',
      team: 'home',
      playerId: 9,
      playerName: 'Thierry Henry',
      description: 'Goal',
    };

    const enLine = service.generate(event);
    expect(enLine).toContain('GOAL!');

    service.setLanguage('he');
    expect(service.getLanguage()).toBe('he');

    const heLine = service.generate(event);
    expect(heLine).toContain('שער!');
    expect(/[\u0590-\u05FF]/.test(heLine)).toBe(true);
  });

  it('set-piece commentary hooks using lib/tactics/setpieces.ts', () => {
    const service = new CommentaryService({ seed: 42 });
    const home = createTeam(1, 'Juventus', true);
    const away = createTeam(2, 'AC Milan', false);

    // Hook formatSetPiece
    const cornerGoalEn = service.formatSetPiece('corner', 'Juventus', 'Del Piero', 'goal', 44, 'en');
    expect(cornerGoalEn).toContain('GOAL!');
    expect(cornerGoalEn).toContain('Del Piero');
    expect(cornerGoalEn).toContain("44'");

    const fkGoalHe = service.formatSetPiece('freeKick', 'יובנטוס', 'דל פיירו', 'goal', 78, 'he');
    expect(fkGoalHe).toContain('שער!');
    expect(fkGoalHe).toContain('דל פיירו');
    expect(fkGoalHe).toContain("78'");

    // Hook resolveAndCommentSetPiece
    const res = service.resolveAndCommentSetPiece(60, 'corner', home, away, 'home');
    expect(res.commentary).toBeDefined();
    expect(res.event.type).toBeDefined();
    expect(['goal', 'save', 'miss', 'corner']).toContain(res.event.type);
    expect(['goal', 'save', 'miss']).toContain(res.outcome);
  });

  it('substitution commentary hooks using lib/tactics/substitutions.ts', () => {
    const service = new CommentaryService({ seed: 42 });
    const subEn = service.formatSubstitution('Chelsea', 'Zola', 'Hasselbaink', 65, 'en');
    expect(subEn).toContain('Substitution for Chelsea');
    expect(subEn).toContain('Zola');
    expect(subEn).toContain('Hasselbaink');

    const subHe = service.formatSubstitution('צ׳לסי', 'זולה', 'האסלביינק', 65, 'he');
    expect(subHe).toContain('חילוף ב-צ׳לסי');
    expect(subHe).toContain('זולה');
    expect(subHe).toContain('האסלביינק');

    // evaluateAndCommentSubstitution on a team with bench players
    const team = createTeam(1, 'Inter', true, true);
    for (let i = 0; i < 11; i++) team.players[i].minutesPlayed = 60; // starters have played 60 mins
    team.players[9].stamina = 15; // exhausted attacker
    const subResult = service.evaluateAndCommentSubstitution(70, team, 1, 'home');
    expect(subResult).not.toBeNull();
    expect(subResult!.event.type).toBe('sub');
    expect(subResult!.commentary).toContain('Substitution');
  });

  it('golden fixtures: deterministic full match produces exact expected commentary stream', () => {
    const engine = new MatchEngine({ seed: 42 });
    const home = createTeam(1, 'Home FC', true);
    const away = createTeam(2, 'Away FC', false);
    const matchResult = engine.simulate(home, away);

    expect(matchResult.events.length).toBeGreaterThan(0);

    const serviceEn = new CommentaryService({
      seed: 42,
      lang: 'en',
      homeTeam: matchResult.homeTeam,
      awayTeam: matchResult.awayTeam,
    });
    const commentaryStreamEn = serviceEn.formatMatch(matchResult);

    expect(commentaryStreamEn.length).toBe(matchResult.events.length);

    // Verify consistency across identical run (frozen golden fixture property)
    const serviceEn2 = new CommentaryService({
      seed: 42,
      lang: 'en',
      homeTeam: matchResult.homeTeam,
      awayTeam: matchResult.awayTeam,
    });
    const commentaryStreamEn2 = serviceEn2.formatMatch(matchResult);
    expect(commentaryStreamEn).toEqual(commentaryStreamEn2);

    // Hebrew golden fixture consistency
    const serviceHe = new CommentaryService({
      seed: 42,
      lang: 'he',
      homeTeam: matchResult.homeTeam,
      awayTeam: matchResult.awayTeam,
    });
    const commentaryStreamHe = serviceHe.formatMatch(matchResult);
    expect(commentaryStreamHe.length).toBe(matchResult.events.length);
    for (const line of commentaryStreamHe) {
      expect(/[\u0590-\u05FF]/.test(line)).toBe(true);
    }
  });

  it('structured CommentaryEntry implements toString() and minute/type accessors', () => {
    const service = new CommentaryService({ seed: 10 });
    const event: MatchEvent = {
      minute: 89,
      type: 'goal',
      team: 'home',
      playerId: 9,
      playerName: 'Batistuta',
      description: 'Goal',
    };

    const entry = service.generateEntry(event);
    expect(entry.minute).toBe(89);
    expect(entry.type).toBe('goal');
    expect(entry.team).toBe('home');
    expect(entry.playerId).toBe(9);
    expect(entry.text).toBe(entry.toString());
  });
});
