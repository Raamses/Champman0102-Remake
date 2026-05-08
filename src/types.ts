export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  clubId?: string;
  avatarUrl?: string;
}

export interface Club {
  id: string;
  name: string;
  shortName: string;
  budget: number;
  reputation: number;
  colors: string[]; // [primary, secondary]
}

export interface Player {
  id: string;
  name: string;
  age: number;
  clubId: string;
  position: 'GK' | 'DEF' | 'MID' | 'ATT';
  value: number;
  rating: number; // Overall rating
  stats: {
    acceleration: number;
    aggression: number;
    agility: number;
    anticipation: number;
    balance: number;
    bravery: number;
    composure: number;
    concentration: number;
    creativity: number;
    crossing: number;
    decisions: number;
    determination: number;
    dribbling: number;
    finishing: number;
    flair: number;
    freeKicks: number;
    heading: number;
    influence: number;
    jumping: number;
    longShots: number;
    marking: number;
    offTheBall: number;
    pace: number;
    passing: number;
    penalties: number;
    positioning: number;
    stamina: number;
    strength: number;
    tackling: number;
    teamwork: number;
    technique: number;
    workRate: number;
  };
  isTransferListed: boolean;
  nationality: string;
  potential: number; // Current ceiling
  maxPotential: number; // Absolute ceiling
  developmentTrend: 'rising' | 'stable' | 'declining';
  condition: number; // 0-100
}

export interface TransferBid {
  id: string;
  playerId: string;
  playerName: string;
  fromClubId: string;
  fromClubName: string;
  toClubId: string;
  fee: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: number;
}

export interface LeagueTableItem {
  clubId: string;
  clubName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  points: number;
}
