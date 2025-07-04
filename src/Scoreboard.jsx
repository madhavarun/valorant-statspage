import { COLUMN_CONFIGS, API_URL } from '../config';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import {agentIcons} from './assets/agents/agentIcons'
import './Scoreboard.css';

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
      return <div className='error'>Invalid parameter: {type}</div>
    }

    let source;
    switch (type) {
      case 'match':
        source = `${API_URL}/api/match/${matchId}`
        break;
      case 'player':
        source = `${API_URL}/api/player/${playerId}`;
        break;
      case 'players':
        source = `${API_URL}/api/players`
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
        if (fetchData.error) {
          throw new Error(`API error! "${fetchData.error}"`);
        }
        // Set data if valid data is recieved
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
  let processedPlayers = []
  
  if (type === 'players') {
    // If players data is not fetched yet, wait
    if (!Array.isArray(data)) {
      return <div className='loading'>Loading data...</div>
    }

    // Extract season data and flatten it
    processedPlayers = data.map(player => {
      const seasonData = player.seasons?.[season] ?? null;
      if (!seasonData) {
        return;
      }
      return {
        _id: player._id,
        name: player.current_name,
        ...seasonData,
        kd_ratio: seasonData.total_deaths > 0 ? seasonData.total_kills / seasonData.total_deaths : seasonData.total_kills || 0
      };
    }).filter(Boolean);
  } else if (type === 'player') {
    const playerData = data.seasons?.[season] || null;
    if (!data.current_name) {
      return <div className='error'>Error fetching stats, try reloading the page</div>
    }
    if (!playerData) {
      return <div className='error'>Player {data.current_name} has not played this season!</div>
    }

    title = `${data.current_name}'s Stats`
    Object.entries(playerData.agents).forEach(([agentName, agentData]) => {
      processedPlayers.push({
        name: data.current_name,
        puuid: agentName, // To use as a key
        agent: agentName,
        ...agentData,
        games_played: (agentData.games?.won || 0) + (agentData.games?.lost || 0),
        win_rate: agentData.games?.percentage || 0,
        kd_ratio: agentData.total_deaths > 0 ? agentData.total_kills / agentData.total_deaths : agentData.total_kills || 0
      });
    });
  } else if (type === 'match') {
    if (!data.data) {
      return <div className='loading'>Loading data...</div>
    }
    return (
      <div className='scoreboard-container'>
        <div className='scoreboard-header'>
          <h2>{title}</h2>
        </div>
        
        <ScoreboardTable players={data.data.detailed.teams[0].players} teamName="Team 1" columns={columns} />
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

function ScoreboardTable({ players, teamName = null, columns}) {
  const gridCols = columns.map(col => col.width || '1fr').join(' ');
  
  return (
    <div className='team-scoreboard'>
      {teamName && (
        <div className='team-header'>
          <h3>{teamName}</h3>
        </div>
      )}
      
      <div className='scoreboard-table' style={{ '--grid-cols': gridCols }}>
        <div className='table-header'>
          {columns.map((column, index) => (
            <div 
              key={column.key} 
              className={`header-cell ${column.type === 'player' ? 'player-col' : 'stat-col'}`}
            >
              {column.label}
            </div>
          ))}
        </div>
        
        {players.map((player) => (
          <PlayerRow key={player._id ?? player.puuid} player={player} columns={columns} />
        ))}
      </div>
    </div>
  );
}

function PlayerRow({ player, columns }) {
  const renderCell = (column, player) => {
    if (column.type === 'player') {
      return (
        <div className='player-info'>
          <div className='player-agent'>
            <img 
              src={agentIcons[player.agent]}
              alt={player.agent || 'Player'}
              className='agent-icon'
            />
          </div>
          <div className='player-details'>
            <Link to={`/player/${player._id ?? player.puuid}`}>
              <div className='player-name'>{player.name}</div>
            </Link>
          </div>
        </div>
      );
    }

    if (column.type === 'agent') {
      return (
        <div className='player-info'>
          <div className='player-agent'>
            <img 
              src={agentIcons[player.agent]}
              alt={player.agent || 'Agent'}
              className='agent-icon'
            />
          </div>
          <div className='player-details'>
            <div className='player-name'>{player.agent}</div>
            <div className='player-rank'>{player.playerName}</div>
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
        // Handle ratio formatting (e.g., 1.25 K/D)
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
    <div className='player-row'>
      {columns.map((column) => (
        <div key={column.key} className={column.type === 'player' ? '' : 'stat-cell-container'}>
          {renderCell(column, player)}
        </div>
      ))}
    </div>
  );
}

export default Scoreboard;