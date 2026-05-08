export const INITIAL_CLUBS = [
  { id: 'london-red', name: 'London Red', shortName: 'LNR', budget: 100000000, reputation: 85, colors: ['#ff0000', '#ffffff'] },
  { id: 'manchester-blue', name: 'Manchester Blue', shortName: 'MNB', budget: 250000000, reputation: 90, colors: ['#6cabdd', '#ffffff'] },
  { id: 'liverpool-red', name: 'Liverpool Red', shortName: 'LIV', budget: 120000000, reputation: 88, colors: ['#c8102e', '#f6eb61'] },
  { id: 'madrid-white', name: 'Madrid White', shortName: 'MDW', budget: 200000000, reputation: 95, colors: ['#ffffff', '#0000ff'] },
  { id: 'barcelona-blue-red', name: 'Barcelona Blue Red', shortName: 'BAR', budget: 80000000, reputation: 92, colors: ['#004d98', '#a50044'] },
  { id: 'milan-red-black', name: 'Milan Red Black', shortName: 'MIL', budget: 70000000, reputation: 80, colors: ['#fb090b', '#000000'] },
  { id: 'munich-red', name: 'Munich Red', shortName: 'MUN', budget: 150000000, reputation: 87, colors: ['#dc052d', '#ffffff'] },
  { id: 'paris-blue', name: 'Paris Blue', shortName: 'PAR', budget: 300000000, reputation: 84, colors: ['#004170', '#da291c'] },
];

export const POSITIONS = ['GK', 'DEF', 'MID', 'ATT'] as const;
