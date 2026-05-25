// ═══════════════════════════════════════════════════════
//  FIFA WC 2026 Dashboard Data
//  Extracted from model outputs
// ═══════════════════════════════════════════════════════

export const TEAMS = [
  { name: 'Spain',       conf: 'UEFA',     prob: 0.8220, pts: 1862.4, rating: 86.95, mv: 917,  wr: 0.763, form: 8.76 },
  { name: 'France',      conf: 'UEFA',     prob: 0.8205, pts: 1898.1, rating: 85.66, mv: 883,  wr: 0.749, form: 8.75 },
  { name: 'Brazil',      conf: 'CONMEBOL', prob: 0.7956, pts: 1883.3, rating: 86.35, mv: 811,  wr: 0.766, form: 8.93 },
  { name: 'England',     conf: 'UEFA',     prob: 0.7741, pts: 1891.5, rating: 85.84, mv: 967,  wr: 0.775, form: 8.48 },
  { name: 'Argentina',   conf: 'CONMEBOL', prob: 0.7607, pts: 1872.8, rating: 86.22, mv: 982,  wr: 0.758, form: 8.35 },
  { name: 'Mexico',      conf: 'CONCACAF', prob: 0.6688, pts: 1566.3, rating: 76.30, mv: 403,  wr: 0.528, form: 5.27 },
  { name: 'USA',         conf: 'CONCACAF', prob: 0.6476, pts: 1610.4, rating: 77.30, mv: 412,  wr: 0.501, form: 5.53 },
  { name: 'Ecuador',     conf: 'CONMEBOL', prob: 0.6162, pts: 1665.2, rating: 78.58, mv: 421,  wr: 0.498, form: 5.88 },
  { name: 'Croatia',     conf: 'UEFA',     prob: 0.6064, pts: 1722.7, rating: 83.41, mv: 645,  wr: 0.626, form: 6.49 },
  { name: 'Morocco',     conf: 'CAF',      prob: 0.5873, pts: 1671.6, rating: 78.57, mv: 488,  wr: 0.522, form: 6.03 },
  { name: 'Netherlands', conf: 'UEFA',     prob: 0.5821, pts: 1729.8, rating: 81.78, mv: 616,  wr: 0.653, form: 7.10 },
  { name: 'Italy',       conf: 'UEFA',     prob: 0.5785, pts: 1710.6, rating: 81.74, mv: 590,  wr: 0.635, form: 7.30 },
  { name: 'Uruguay',     conf: 'CONMEBOL', prob: 0.5715, pts: 1790.7, rating: 82.30, mv: 675,  wr: 0.655, form: 7.88 },
  { name: 'Germany',     conf: 'UEFA',     prob: 0.5683, pts: 1757.0, rating: 81.56, mv: 653,  wr: 0.634, form: 6.79 },
  { name: 'Japan',       conf: 'AFC',      prob: 0.5405, pts: 1603.9, rating: 78.02, mv: 342,  wr: 0.476, form: 5.17 },
  { name: 'Portugal',    conf: 'UEFA',     prob: 0.5047, pts: 1751.9, rating: 82.08, mv: 688,  wr: 0.659, form: 7.23 },
  { name: 'Senegal',     conf: 'CAF',      prob: 0.4966, pts: 1661.4, rating: 76.91, mv: 453,  wr: 0.509, form: 5.30 },
  { name: 'Denmark',     conf: 'UEFA',     prob: 0.5157, pts: 1603.4, rating: 77.80, mv: 407,  wr: 0.540, form: 5.53 },
];

export const CONF_DATA = [
  { n: 'UEFA',    teams: 18, avgProb: 50.6, maxProb: 82.2, col: '#5ec4ff' },
  { n: 'CONMEBOL',teams: 7,  avgProb: 51.9, maxProb: 79.6, col: '#6effc4' },
  { n: 'CONCACAF',teams: 6,  avgProb: 42.4, maxProb: 66.9, col: '#d97fe0' },
  { n: 'AFC',     teams: 7,  avgProb: 27.6, maxProb: 54.1, col: '#ff9f9f' },
  { n: 'CAF',     teams: 8,  avgProb: 28.5, maxProb: 58.7, col: '#ffcc7f' },
  { n: 'OFC',     teams: 1,  avgProb: 12.8, maxProb: 12.8, col: '#a0b8b0' },
];

export const MODELS = [
  { n: 'Random Forest', auc: 0.6711, acc: 0.635, col: '#6effc4', w: 95 },
  { n: 'Ensemble',      auc: 0.6748, acc: 0.630, col: '#F5C842', w: 97 },
  { n: 'LightGBM',      auc: 0.6539, acc: 0.640, col: '#5ec4ff', w: 88 },
  { n: 'XGBoost',       auc: 0.6534, acc: 0.595, col: '#ff9f40', w: 87 },
  { n: 'Grad. Boost',   auc: 0.6376, acc: 0.610, col: '#d97fe0', w: 82 },
];

export const CV_DATA = {
  XGBoost:  [0.6087, 0.6225, 0.6743, 0.6884, 0.6947],
  LightGBM: [0.6036, 0.6143, 0.6575, 0.6725, 0.6847],
  RF:       [0.6422, 0.6376, 0.6837, 0.7385, 0.7580],
};

export const HIST = [13, 29, 35, 15, 29, 29, 29, 27, 36, 8];
export const HIST_LABELS = ['0–10', '10–20', '20–30', '30–40', '40–50', '50–60', '60–70', '70–80', '80–90', '90+'];

export const FEATURES = [
  { n: 'Strength Index',    pct: 100 },
  { n: 'Squad Quality',     pct: 92  },
  { n: 'Market Value',      pct: 85  },
  { n: 'Avg Player Rating', pct: 80  },
  { n: 'FIFA Points',       pct: 76  },
  { n: 'Attack Potency',    pct: 70  },
  { n: 'Form Consistency',  pct: 64  },
  { n: 'Win Rate (Last Yr)',pct: 59  },
  { n: 'Recent Form Score', pct: 53  },
  { n: 'Star Power',        pct: 47  },
];

export const LINEUPS = {
  'Spain': {
    formation: '4-3-3',
    players: [
      { pos: 'GK',  name: 'David Raya',    x: 50, y: 88 },
      { pos: 'RB',  name: 'Carvajal',      x: 84, y: 70 },
      { pos: 'RCB', name: 'Le Normand',    x: 62, y: 73 },
      { pos: 'LCB', name: 'Laporte',       x: 38, y: 73 },
      { pos: 'LB',  name: 'Grimaldo',      x: 16, y: 70 },
      { pos: 'RCM', name: 'Pedri',         x: 68, y: 50 },
      { pos: 'DM',  name: 'Rodri',         x: 50, y: 56 },
      { pos: 'LCM', name: 'Fabián Ruiz',   x: 32, y: 50 },
      { pos: 'RW',  name: 'Lamine Yamal',  x: 78, y: 26 },
      { pos: 'ST',  name: 'Álvaro Morata', x: 50, y: 18 },
      { pos: 'LW',  name: 'Nico Williams', x: 22, y: 26 },
    ],
  },
  'France': {
    formation: '4-2-3-1',
    players: [
      { pos: 'GK',  name: 'Maignan',        x: 50, y: 88 },
      { pos: 'RB',  name: 'Koundé',         x: 84, y: 70 },
      { pos: 'RCB', name: 'Upamecano',      x: 62, y: 73 },
      { pos: 'LCB', name: 'Saliba',         x: 38, y: 73 },
      { pos: 'LB',  name: 'Hernández',      x: 16, y: 70 },
      { pos: 'RDM', name: 'Tchouaméni',     x: 64, y: 58 },
      { pos: 'LDM', name: "N'Golo Kanté",   x: 36, y: 58 },
      { pos: 'RAM', name: 'O. Dembélé',     x: 76, y: 40 },
      { pos: 'AM',  name: 'Griezmann',      x: 50, y: 42 },
      { pos: 'LAM', name: 'B. Barcola',     x: 24, y: 40 },
      { pos: 'ST',  name: 'K. Mbappé',      x: 50, y: 18 },
    ],
  },
  'Brazil': {
    formation: '4-2-3-1',
    players: [
      { pos: 'GK',  name: 'Alisson Becker',    x: 50, y: 88 },
      { pos: 'RB',  name: 'Danilo',            x: 84, y: 70 },
      { pos: 'RCB', name: 'Marquinhos',        x: 62, y: 73 },
      { pos: 'LCB', name: 'Gabriel Magalhães', x: 38, y: 73 },
      { pos: 'LB',  name: 'Guilherme Arana',   x: 16, y: 70 },
      { pos: 'RDM', name: 'Bruno Guimarães',   x: 64, y: 58 },
      { pos: 'LDM', name: 'João Gomes',        x: 36, y: 58 },
      { pos: 'RAM', name: 'Raphinha',          x: 76, y: 40 },
      { pos: 'AM',  name: 'Lucas Paquetá',     x: 50, y: 42 },
      { pos: 'LAM', name: 'Vinícius Júnior',   x: 24, y: 40 },
      { pos: 'ST',  name: 'Rodrygo Silva',     x: 50, y: 18 },
    ],
  },
  'England': {
    formation: '4-3-3',
    players: [
      { pos: 'GK',  name: 'Jordan Pickford',  x: 50, y: 88 },
      { pos: 'RB',  name: 'Kyle Walker',      x: 84, y: 70 },
      { pos: 'RCB', name: 'John Stones',      x: 62, y: 73 },
      { pos: 'LCB', name: 'Marc Guéhi',       x: 38, y: 73 },
      { pos: 'LB',  name: 'Luke Shaw',        x: 16, y: 70 },
      { pos: 'RCM', name: 'Jude Bellingham',  x: 68, y: 50 },
      { pos: 'DM',  name: 'Declan Rice',      x: 50, y: 56 },
      { pos: 'LCM', name: 'Kobbie Mainoo',    x: 32, y: 50 },
      { pos: 'RW',  name: 'Bukayo Saka',      x: 78, y: 26 },
      { pos: 'ST',  name: 'Harry Kane',       x: 50, y: 18 },
      { pos: 'LW',  name: 'Phil Foden',       x: 22, y: 26 },
    ],
  },
  'Argentina': {
    formation: '4-4-2',
    players: [
      { pos: 'GK',  name: 'Emi Martínez',        x: 50, y: 88 },
      { pos: 'RB',  name: 'Nahuel Molina',        x: 84, y: 70 },
      { pos: 'RCB', name: 'Cuti Romero',          x: 62, y: 73 },
      { pos: 'LCB', name: 'N. Otamendi',          x: 38, y: 73 },
      { pos: 'LB',  name: 'N. Tagliafico',        x: 16, y: 70 },
      { pos: 'RM',  name: 'Rodrigo De Paul',      x: 80, y: 50 },
      { pos: 'RCM', name: 'Enzo Fernández',       x: 60, y: 52 },
      { pos: 'LCM', name: 'Alexis Mac Allister',  x: 40, y: 52 },
      { pos: 'LM',  name: 'Nico González',        x: 20, y: 50 },
      { pos: 'RS',  name: 'Lionel Messi',         x: 62, y: 22 },
      { pos: 'LS',  name: 'Lautaro Martínez',     x: 38, y: 22 },
    ],
  },
  'Germany': {
    formation: '4-2-3-1',
    players: [
      { pos: 'GK',  name: 'M. ter Stegen',    x: 50, y: 88 },
      { pos: 'RB',  name: 'Joshua Kimmich',   x: 84, y: 70 },
      { pos: 'RCB', name: 'Jonathan Tah',     x: 62, y: 73 },
      { pos: 'LCB', name: 'A. Rüdiger',       x: 38, y: 73 },
      { pos: 'LB',  name: 'David Raum',       x: 16, y: 70 },
      { pos: 'RDM', name: 'Robert Andrich',   x: 64, y: 58 },
      { pos: 'LDM', name: 'Pascal Groß',      x: 36, y: 58 },
      { pos: 'RAM', name: 'Leroy Sané',       x: 76, y: 40 },
      { pos: 'AM',  name: 'Ilkay Gündogan',   x: 50, y: 42 },
      { pos: 'LAM', name: 'Florian Wirtz',    x: 24, y: 40 },
      { pos: 'ST',  name: 'Kai Havertz',      x: 50, y: 18 },
    ],
  },
};

// Confederation color map
export const CONF_COLORS = {
  UEFA:    '#5ec4ff',
  CONMEBOL:'#6effc4',
  CONCACAF:'#d97fe0',
  AFC:     '#ff9f9f',
  CAF:     '#ffcc7f',
  OFC:     '#a0b8b0',
};

// Generic lineup generator for unlisted teams
export function getLineup(teamName) {
  if (LINEUPS[teamName]) return LINEUPS[teamName];
  const forms = ['4-3-3', '4-2-3-1', '4-4-2', '3-5-2'];
  const index = Math.abs(teamName.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)) % forms.length;
  const formation = forms[index];
  const genericPlayers433 = [
    { pos: 'GK',  name: 'Goalkeeper',    x: 50, y: 88 },
    { pos: 'RB',  name: 'Right Back',    x: 84, y: 70 },
    { pos: 'RCB', name: 'Right CB',      x: 62, y: 73 },
    { pos: 'LCB', name: 'Left CB',       x: 38, y: 73 },
    { pos: 'LB',  name: 'Left Back',     x: 16, y: 70 },
    { pos: 'RCM', name: 'Right CM',      x: 68, y: 50 },
    { pos: 'DM',  name: 'Def. Mid',      x: 50, y: 56 },
    { pos: 'LCM', name: 'Left CM',       x: 32, y: 50 },
    { pos: 'RW',  name: 'Right Wing',    x: 78, y: 26 },
    { pos: 'ST',  name: 'Striker',       x: 50, y: 18 },
    { pos: 'LW',  name: 'Left Wing',     x: 22, y: 26 },
  ];
  const genericPlayers4231 = [
    { pos: 'GK',  name: 'Goalkeeper',  x: 50, y: 88 },
    { pos: 'RB',  name: 'Right Back',  x: 84, y: 70 },
    { pos: 'RCB', name: 'Right CB',    x: 62, y: 73 },
    { pos: 'LCB', name: 'Left CB',     x: 38, y: 73 },
    { pos: 'LB',  name: 'Left Back',   x: 16, y: 70 },
    { pos: 'RDM', name: 'Right DM',    x: 64, y: 58 },
    { pos: 'LDM', name: 'Left DM',     x: 36, y: 58 },
    { pos: 'RAM', name: 'Right AM',    x: 76, y: 40 },
    { pos: 'AM',  name: 'Att. Mid',    x: 50, y: 42 },
    { pos: 'LAM', name: 'Left AM',     x: 24, y: 40 },
    { pos: 'ST',  name: 'Striker',     x: 50, y: 18 },
  ];
  const players = formation === '4-3-3' ? genericPlayers433 : genericPlayers4231;
  return { formation, players };
}
