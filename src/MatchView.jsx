import { useNavigate } from 'react-router';
import { mapIcons } from './assets/maps/mapIcons';
import './MatchView.css';

function MatchView({ games }) {
  const navigate = useNavigate();

  if (!games || games.length === 0) {
    return <div className='loading'>Games not found</div>;
  }

  function loadMatch(match_id) {
    console.log(`Loading match with ID: ${match_id}`);
    navigate(`/match/${match_id}`);
  }

  return (
    <>
      {games.map((game, idx) => (
        <GameCard key={game.match_id}
        game={game}
        onGameClick={loadMatch}/>
      ))}
    </>
  )
}

function GameCard({ game, onGameClick }) {
  const { match_id, teams, map, game_start, game_server} = game;
  // Create a team name based on the pick
  const team1 = teams[0];
  const team2 = teams[1];

  const image = mapIcons[map] || `https://placehold.co/150x100/404E67/FFFFFF?text=${map}+Map`; // Fallback to placeholder if map not found

  // Format the start time from Unix milliseconds
  const formatStartTime = (startingTime) => {
    const date = new Date(startingTime); // Create Date object
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  return (
    <div className='game-card' onClick={() => onGameClick(match_id)}>
      <div className='game-overview'>
        <TeamDisplay teamName={`${team1.team_id} - ${team1.pick}`} players={team1.players} alignment={"left"}/>
        <div className='middle-section'> 
          <p className='game-server'>{game_server}</p>
          <GameScore score1={team1.rounds_won} score2={team2.rounds_won} team1won={team1.has_won}/>
          <p className='game-start-time'>{formatStartTime(game_start)}</p>
        </div>
        <TeamDisplay teamName={`${team2.team_id} - ${team2.pick}`} players={team2.players} alignment={"right"}/>
      </div>
      <MapDisplay map={map} image={image}/>
    </div>
  )
}

function TeamDisplay ({ teamName, players, alignment }) {
  return (
    <div className={`team-display-${alignment}`}>
      <div className='team-name'>
        <p>{teamName}</p>
      </div>
      <div className='team-players'>
        {players.map((player, index) => (
          <p key={index}>{player.name}</p>
        ))}
      </div>
    </div>
  );
}


function GameScore({ score1, score2, team1won}) {
  const team1class = team1won ? 'score-winner' : 'score-loser';
  const team2class = team1won ? 'score-loser' : 'score-winner';
  return (
    <div className='game-score'>
      <span className={team1class}>{score1}</span>
      <span className='score-separator'>-</span>
      <span className={team2class}>{score2}</span>
    </div>
  );
}


function MapDisplay({ map, image }) {
  return (
    <div className='map-display'>
      <img src={image} alt={`${map} map`} className='map-image' />
      <p className='map-name'>{map}</p>
    </div>
  );
}

export default MatchView;