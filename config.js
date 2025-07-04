export const SITE_TITLE = "Amateur City 10s" // Title of the site

export const API_URL = "https://proxy.aurniox.workers.dev" // Base api url

export const COLUMN_CONFIGS = {
  match: [
    { key: 'player', label: 'Player', type: 'player', width: '200px' },
    { key: 'acs', label: 'ACS', type: 'number', highlight: 'primary' },
    { key: 'kills', label: 'K', type: 'number' },
    { key: 'deaths', label: 'D', type: 'number' },
    { key: 'assists', label: 'A', type: 'number' },
    { key: 'kda_diff', label: '+/-', type: 'diff' },
    { key: 'kast', label: 'KAST', type: 'percentage' },
    { key: 'adr', label: 'ADR', type: 'number' },
    { key: 'hs_percentage', label: 'HS%', type: 'percentage' },
    { key: 'damage_delta', label: 'ΔDD', type: 'diff' },
    { key: 'first_bloods', label: 'FK', type: 'number' },
    { key: 'first_deaths', label: 'FD', type: 'number' },
    { key: 'fkfd_diff', label: '+/-', type: 'diff' }
  ],
  players: [
    { key: 'player', label: 'Player', type: 'player', width: '200px' },
    { key: 'games.percentage', label: 'Win%', type: 'percentage', highlight: 'primary' },
    { key: 'avg_acs', label: 'ACS', type: 'number' },
    { key: 'kd_ratio', label: 'K/D', type: 'ratio' },
    { key: 'avg_kast', label: 'KAST', type: 'percentage' },
    { key: 'avg_adr', label: 'ADR', type: 'number' },
    { key: 'avg_hs_percentage', label: 'HS%', type: 'percentage' },
    { key: 'total_kills', label: 'K', type: 'number' },
    { key: 'total_deaths', label: 'D', type: 'number' },
    { key: 'total_assists', label: 'A', type: 'number' },
    { key: 'total_kda_diff', label: '+/-', type: 'diff' },
    { key: 'total_first_bloods', label: 'FK', type: 'number' },
    { key: 'total_first_deaths', label: 'FD', type: 'number' },
    { key: 'total_fkfd_diff', label: 'FK/FD', type: 'diff' }
  ],
  player: [
    { key: 'player', label: 'Agent', type: 'agent', width: '180px' },
    { key: 'games_played', label: 'Games', type: 'number' },
    { key: 'games.percentage', label: 'Win%', type: 'percentage', highlight: 'primary' },
    { key: 'avg_acs', label: 'ACS', type: 'number' },
    { key: 'kd_ratio', label: 'K/D', type: 'ratio' },
    { key: 'avg_kast', label: 'KAST', type: 'percentage' },
    { key: 'avg_adr', label: 'ADR', type: 'number' },
    { key: 'avg_hs_percentage', label: 'HS%', type: 'percentage' },
    { key: 'total_kills', label: 'Kills', type: 'number' },
    { key: 'total_deaths', label: 'Deaths', type: 'number' }
  ]
};