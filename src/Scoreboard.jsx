import { COLUMN_CONFIGS, API_URL } from '../config';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { agentIcons } from './assets/agents/agentIcons';
import './Scoreboard.css';

/**
 * Finds the most played agent for a given player based on the total 'games' played (won + lost).
 *
 * @param {object} playerData - The player's season data object (e.g., player.seasons.s1) containing an 'agents' property.
 * @returns {object|null} An object containing { agentName, totalGamesPlayed } for the most played agent, or null if no agents are found.
 */
function getMostPlayedAgent(playerData) {
  // Ensure playerData and playerData.agents exist and are objects
  if (!playerData || !playerData.agents || typeof playerData.agents !== 'object') {
    return null;
  }

  let mostPlayedAgent = null;
  let maxTotalGames = -1;

  // Iterate over the keys (agent names) in the playerData.agents object
  for (const agentName in playerData.agents) {
    if (Object.hasOwnProperty.call(playerData.agents, agentName)) {
      const agentData = playerData.agents[agentName];

      if (
        agentData &&
        typeof agentData.games === 'object' &&
        typeof agentData.games.won === 'number' &&
        typeof agentData.games.lost === 'number'
      ) {
        const totalGamesForAgent = agentData.games.won + agentData.games.lost;

        if (totalGamesForAgent > maxTotalGames) {
          maxTotalGames = totalGamesForAgent;
          mostPlayedAgent = {
            agentName: agentName,
            totalGamesPlayed: totalGamesForAgent
          };
        }
      }
    }
  }

  return mostPlayedAgent;
}

function Scoreboard({
  type = 'match',
  title = 'Scoreboard',
  season = 's1'
}) {
  const { matchId, playerId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!(type in COLUMN_CONFIGS)) {
      setError(`Invalid parameter: ${type}`);
      return;
    }

    let source;
    switch (type) {
      case 'match':
        source = `${API_URL}/api/match/${matchId}`;
        break;
      case 'player':
        source = `${API_URL}/api/player/${playerId}`;
        break;
      case 'players':
        source = `${API_URL}/api/players`;
        break;
      default:
        source = null;
        break;
    }
    async function fetchData() {
      if (!source) {
        setError('No data source provided');
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(source);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const fetchedData = await response.json();
        if (fetchedData.error) {
          throw new Error(`API error! "${fetchedData.error}"`);
        }
        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [matchId, playerId, type]);

  if (loading) {
    return <div className='loading'>Loading data...</div>;
  }

  if (error) {
    return <div className='error'>Error loading data: {error}</div>;
  }

  if (!data) {
    return <div className='error'>No data available</div>;
  }

  const columns = COLUMN_CONFIGS[type] || COLUMN_CONFIGS.match;
  let processedPlayers = [];

  if (type === 'players') {
    if (!Array.isArray(data)) {
      return <div className='loading'>Loading data...</div>;
    }
    processedPlayers = data.map(player => {
      const seasonData = player.seasons?.[season] ?? null;
      // Ensure players who havent played aren't displayed
      if (!seasonData || seasonData.games.won + seasonData.games.lost === 0) {
        return null;
      }
      return {
        _id: player._id,
        name: player.current_name,
        agent: getMostPlayedAgent(seasonData).agentName,
        ...seasonData,
        kd_ratio: seasonData.total_deaths > 0 ? seasonData.total_kills / seasonData.total_deaths : seasonData.total_kills || 0
      };
    }).filter(Boolean);
  } else if (type === 'player') {
    const playerData = data.seasons?.[season] || null;
    if (!data.current_name) {
      return <div className='error'>Error fetching stats, try reloading the page</div>;
    }
    if (!playerData) {
      return <div className='error'>Player {data.current_name} has not played this season!</div>;
    }

    title = `${data.current_name}'s Stats`;
    Object.entries(playerData.agents).forEach(([agentName, agentData]) => {
      processedPlayers.push({
        name: data.current_name,
        puuid: agentName,
        agent: agentName,
        ...agentData,
        games_played: (agentData.games?.won || 0) + (agentData.games?.lost || 0),
        win_rate: agentData.games?.percentage || 0,
        kd_ratio: agentData.total_deaths > 0 ? agentData.total_kills / agentData.total_deaths : agentData.total_kills || 0
      });
    });

    processedPlayers.sort((a, b) => b.games_played - a.games_played);
  } else if (type === 'match') {
    if (!data.data || !data.data.detailed) {
      return <div className='loading'>Loading data...</div>;
    }
    return (
      <div className='scoreboard-container'>
        {/* The component no longer renders its own title for matches, this is handled by MatchPage */}
        <ScoreboardTable players={data.data.detailed.teams[0].players} teamName="Team 1" columns={columns} />
        <div className='scoreboard-team-separator'></div>
        <ScoreboardTable players={data.data.detailed.teams[1].players} teamName="Team 2" columns={columns} />
      </div>
    );
  }

  return (
    <div className='scoreboard-container'>
      <div className='scoreboard-header'>
        <h2>{title}</h2>
      </div>
      <ScoreboardTable players={processedPlayers} columns={columns} />
    </div>
  );
}

function ScoreboardTable({ players, columns }) {
  players.sort((a, b) => a.acs ? b.acs - a.acs : b.avg_acs - a.avg_acs);
  return (
    <div className='team-scoreboard'>
      <table className='scoreboard-table'>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={column.type === 'player' ? 'player-col' : 'stat-col'}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <PlayerRow key={player._id ?? player.puuid} player={player} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PlayerRow({ player, columns }) {
  const renderCell = (column, player) => {
    if (column.type === 'player' || column.type === 'agent') {
        const isPlayerType = column.type === 'player';
        const agentName = player.agent || (isPlayerType ? 'Player' : 'Agent');
        const displayName = isPlayerType ? player.name : player.agent;
        const linkId = player._id ?? player.puuid;

        return (
            <div className='player-info'>
                <div className='player-agent'>
                    <img
                        src={agentIcons[player.agent]}
                        alt={agentName}
                        className='agent-icon'
                    />
                </div>
                <div className='player-details'>
                    <Link to={`/player/${linkId}`}>
                        <div className='player-name'>{displayName}</div>
                    </Link>
                </div>
            </div>
        );
    }


    // Handle nested keys (e.g., 'games.percentage')
    let value = player;
    const keyPath = column.key.split('.');
    for (const key of keyPath) {
      value = value?.[key];
      if (value === undefined || value === null) break;
    }

    if (value === undefined || value === null) {
      return column.placeholder || '-';
    }

    let displayValue = value;
    let className = 'stat-cell';

    if (column.highlight) {
      className += ` ${column.highlight}`;
    }

    switch (column.type) {
      case 'percentage':
        displayValue = `${Math.round(value)}%`;
        break;
      case 'diff':
        className += value >= 0 ? ' positive' : ' negative';
        displayValue = value >= 0 ? `+${value}` : value;
        break;
      case 'ratio':
        displayValue = typeof value === 'number' ? value.toFixed(2) : value;
        break;
      case 'number':
        displayValue = typeof value === 'number' ? Math.round(value) : value;
        break;
      default:
        displayValue = value;
    }

    return <div className={className}>{displayValue}</div>;
  };

  return (
    <tr className='player-row'>
      {columns.map((column) => (
        <td key={column.key} className={column.type === 'player' ? '' : 'stat-cell-container'}>
          {renderCell(column, player)}
        </td>
      ))}
    </tr>
  );
}

export default Scoreboard;