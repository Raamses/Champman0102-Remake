// @paths lib/engine
import { describe, it, expect } from 'vitest';
import { MatchEngine } from '../matchEngine';
import { substituteAI } from '../../lib/tactics/substitutions';
import { selectSetPieceTaker } from '../../lib/tactics/setpieces';
import type { PlayerState, TeamState } from '../types';
import { createAttributes } from './golden.helpers';

function createPlayer(id: number, position: 'GK' | 'DEF' | 'MID' | 'ATT', setPieces = 10, isInjured = false): PlayerState {
  return {
    id, name: `Player ${id}`, position,
    attributes: createAttributes({ setPieces }),
    stamina: 100, isInjured, yellowCards: 0, redCard: false, minutesPlayed: 0, onPitch: true
  };
}

function createTeam(id: number, name: string, isHome: boolean, idOffset = 0): TeamState {
  const team: TeamState = {
    id, name, isHome,
    tactic: { formation: '4-4-2', mentality: 'balanced', tempo: 'normal', pressing: 'normal', width: 'normal', passing: 'mixed' },
    players: Array.from({length: 14}, (_, i) => createPlayer(idOffset + i + 1, i === 0 ? 'GK' : 'MID', 10)),
    goals: 0, shots: 0, shotsOnTarget: 0, possession: 50, morale: 100
  };
  team.players.forEach((p, i) => p.onPitch = i < 11);
  return team;
}

describe('CM-025 Pinned Quirks', () => {
  it('Quirk 1: Set-piece taker excludes GK and ranks on setPieces attribute', () => {
    const players = [
      createPlayer(1, 'GK', 20),
      createPlayer(2, 'DEF', 12),
      createPlayer(3, 'MID', 15),
      createPlayer(4, 'ATT', 10),
    ];
    const taker = selectSetPieceTaker(players);
    expect(taker).toBeDefined();
    expect(taker!.id).toBe(3);
  });

  it('Quirk 2: substituteAI only replaces GK with bench GK', () => {
    const gk = createPlayer(1, 'GK');
    gk.stamina = 10;
    gk.minutesPlayed = 60;
    
    const def = createPlayer(2, 'DEF');
    def.stamina = 100;
    
    const team: Pick<TeamState, 'players' | 'goals'> = { players: [gk, def], goals: 0 };
    
    const benchATT = createPlayer(12, 'ATT');
    benchATT.onPitch = false;
    team.players.push(benchATT);
    
    expect(substituteAI(team, 0, 70)).toBeNull();
    
    const benchGK = createPlayer(13, 'GK');
    benchGK.onPitch = false;
    team.players.push(benchGK);
    
    const sub = substituteAI(team, 0, 70);
    expect(sub).not.toBeNull();
    expect(sub!.subOutIdx).toBe(0);
    expect(sub!.subInIdx).toBe(3);
  });

  it('Quirk 3: Injury flag is true while injured, cleared when recovered', () => {
    const engine = new MatchEngine({ seed: 42 });
    const home = createTeam(1, 'Home', true);
    const away = createTeam(2, 'Away', false, 100);
    
    engine.startMatch(home, away);
    while (!engine.isFinished) engine.stepMinute();
    
    for (const e of engine.result().events) {
      if (e.type === 'injury') {
        const team = e.team === 'home' ? home : away;
        const p = team.players.find(x => x.id === e.playerId)!;
        expect(p.isInjured).toBe(!(e as any).recovered);
      }
    }
  });

  it('Quirk 4: Sub event playerId is the outgoing player', () => {
    const engine = new MatchEngine({ seed: 42 });
    const home = createTeam(1, 'Home', true);
    const away = createTeam(2, 'Away', false, 100);
    
    home.players[2].stamina = 30; // Force a substitution to test Quirk 4
    
    engine.startMatch(home, away);
    while (!engine.isFinished) engine.stepMinute();
    
    const subs = engine.result().events.filter(e => e.type === 'sub');
    expect(subs.length).toBeGreaterThan(0);
    for (const sub of subs) {
      const e = sub as any;
      expect(e.playerId).toBe(e.subOutId);
      expect(e.playerName).toBe(e.subOutName);
    }
  });
});
