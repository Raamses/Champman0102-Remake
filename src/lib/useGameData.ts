import { useMemo } from 'react';
import { INITIAL_CLUBS } from '../constants';
import { Player } from '../types';

// Module-level cache to persist generated squads across the entire session
const SQUAD_CACHE: Record<string, Player[]> = {};

const generateStats = (pos: string) => {
  const rb = (min = 30, max = 95) => Math.floor(Math.random() * (max - min)) + min;
  return {
    acceleration: rb(50, 95),
    aggression: rb(30, pos === 'DEF' ? 95 : 70),
    agility: rb(50, 95),
    anticipation: rb(50, 95),
    balance: rb(40, 90),
    bravery: rb(30, pos === 'DEF' ? 95 : 70),
    composure: rb(50, 95),
    concentration: rb(50, 95),
    creativity: rb(30, pos === 'MID' ? 95 : 70),
    crossing: rb(20, pos === 'MID' ? 90 : 60),
    decisions: rb(50, 95),
    determination: rb(50, 95),
    dribbling: rb(30, pos === 'ATT' || pos === 'MID' ? 95 : 60),
    finishing: rb(20, pos === 'ATT' ? 95 : 50),
    flair: rb(30, pos === 'ATT' || pos === 'MID' ? 95 : 60),
    freeKicks: rb(30, 80),
    heading: rb(30, pos === 'DEF' || pos === 'ATT' ? 95 : 70),
    influence: rb(30, 80),
    jumping: rb(40, 95),
    longShots: rb(30, pos === 'ATT' || pos === 'MID' ? 90 : 60),
    marking: rb(20, pos === 'DEF' ? 95 : 50),
    offTheBall: rb(30, pos === 'ATT' ? 95 : 70),
    pace: rb(50, 95),
    passing: rb(40, pos === 'MID' ? 95 : 80),
    penalties: rb(30, 85),
    positioning: rb(40, pos === 'DEF' ? 95 : 70),
    stamina: rb(50, 95),
    strength: rb(50, 95),
    tackling: rb(20, pos === 'DEF' ? 95 : 50),
    teamwork: rb(50, 95),
    technique: rb(50, 95),
    workRate: rb(50, 95),
  };
};

const PLAYERS: Player[] = [
  { id: 'p1', name: 'Alisson Becker', age: 31, clubId: 'liverpool-red', position: 'GK', value: 45000000, rating: 89, stats: generateStats('GK'), isTransferListed: false, nationality: 'Brazil', potential: 90, maxPotential: 92, developmentTrend: 'stable', condition: 95 },
  { id: 'p2', name: 'Erling Haaland', age: 23, clubId: 'manchester-blue', position: 'ATT', value: 180000000, rating: 91, stats: generateStats('ATT'), isTransferListed: false, nationality: 'Norway', potential: 94, maxPotential: 96, developmentTrend: 'rising', condition: 98 },
  { id: 'p3', name: 'Jude Bellingham', age: 20, clubId: 'madrid-white', position: 'MID', value: 150000000, rating: 87, stats: generateStats('MID'), isTransferListed: false, nationality: 'England', potential: 92, maxPotential: 95, developmentTrend: 'rising', condition: 97 },
  { id: 'p4', name: 'Kevin De Bruyne', age: 32, clubId: 'manchester-blue', position: 'MID', value: 60000000, rating: 91, stats: generateStats('MID'), isTransferListed: false, nationality: 'Belgium', potential: 91, maxPotential: 91, developmentTrend: 'stable', condition: 92 },
  { id: 'p5', name: 'Virgil van Dijk', age: 32, clubId: 'liverpool-red', position: 'DEF', value: 35000000, rating: 89, stats: generateStats('DEF'), isTransferListed: false, nationality: 'Netherlands', potential: 89, maxPotential: 90, developmentTrend: 'stable', condition: 94 },
];

export function useGameData(clubId?: string) {
  const club = INITIAL_CLUBS.find(c => c.id === clubId);
  
  const players = useMemo(() => {
    // 1. Get predefined players
    const basePlayers = clubId ? PLAYERS.filter(p => p.clubId === clubId) : [...PLAYERS];
    
    if (clubId) {
      // 2. Check if we already generated a squad for this club
      if (SQUAD_CACHE[clubId]) {
        return SQUAD_CACHE[clubId];
      }

      // 3. If squad is empty (not predefined), generate it once
      if (basePlayers.length === 0) {
        const generatedSquad: Player[] = [];
        const positions: Array<'GK' | 'DEF' | 'MID' | 'ATT'> = ['GK', 'DEF', 'DEF', 'DEF', 'DEF', 'MID', 'MID', 'MID', 'MID', 'ATT', 'ATT'];
        const nationalities = ['England', 'France', 'Spain', 'Germany', 'Italy', 'Brazil', 'Argentina', 'Portugal'];
        
        positions.forEach((pos, i) => {
          const nat = nationalities[Math.floor(Math.random() * nationalities.length)];
          generatedSquad.push({
            id: `gen-${clubId}-${i}`,
            name: `Player ${i + 1}`,
            age: 18 + Math.floor(Math.random() * 15),
            clubId,
            position: pos,
            nationality: nat,
            value: 1000000 + Math.floor(Math.random() * 20000000),
            rating: 60 + Math.floor(Math.random() * 30),
            potential: 65 + Math.floor(Math.random() * 30),
            maxPotential: 70 + Math.floor(Math.random() * 25),
            developmentTrend: Math.random() > 0.7 ? 'rising' : Math.random() > 0.4 ? 'stable' : 'declining',
            condition: 80 + Math.floor(Math.random() * 20),
            stats: generateStats(pos),
            isTransferListed: false
          });
        });
        
        SQUAD_CACHE[clubId] = generatedSquad;
        return generatedSquad;
      }
    }
    
    return basePlayers;
  }, [clubId]);

  return { club, players };
}
