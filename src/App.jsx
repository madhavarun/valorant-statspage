import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { useEffect, useState } from 'react'
import { API_URL } from '../config';
import Navbar from './Navbar'
import MatchView from './MatchView';
import Scoreboard from './Scoreboard';
import ManageMatchForm from './ManageMatchForm';
import MatchPage from './MatchPage';
import './App.css';

function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGames() {
      try {
        const response = await fetch(`${API_URL}/api/matches/basic`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error('Error fetching games:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchGames();
  }, []);

  if (error) {
    return <div className='error'>Error: {error}</div>;
  }
  
  if (loading) {
    return <div className='loading'>Loading games...</div>;
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/match/:matchId" element={<MatchPage />} />
        <Route
          path="/player/:playerId"
          element={
            <div className='player-stats'>
              <Scoreboard type="player" season="s1" title="Player Stats" />
            </div>
          }
        />
        <Route
          path="/players"
          element={
            <div className='player-stats'>
              <Scoreboard type="players" season="s1" title="Overall player stats for season" />
            </div>
          }
        />
        <Route path="/addmatch" element={<ManageMatchForm />} />
        <Route path="/" element={<MatchView games={games} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App
