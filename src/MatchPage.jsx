import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { API_URL } from '../config';
import Scoreboard from './Scoreboard'; // Import your existing Scoreboard component
import './MatchPage.css'; // We'll create this for styling

// Helper function to format time in ms to (m)m:ss
function formatDuration(milliseconds) {
    if (milliseconds < 0 || isNaN(milliseconds)) {
        return 'N/A';
    }

    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds}`;
}

function getSideShort(attackers) {
    return attackers ? 'atk' : 'def'
}

function MatchPage() {
    const { matchId } = useParams();
    const [matchData, setMatchData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchMatchData() {
            try {
                const response = await fetch(`${API_URL}/api/match/${matchId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data.error) {
                    throw new Error(`API error! "${data.error}"`);
                }
                setMatchData(data.data.detailed);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }

        fetchMatchData();
    }, [matchId]);

    if (loading) {
        return <div className='loading'>Loading Match Data...</div>;
    }

    if (error) {
        return <div className='error'>Error loading match data: {error}</div>;
    }

    if (!matchData) {
        return <div className='error'>No match data available.</div>;
    }

    const team1 = matchData.teams[0];
    const team2 = matchData.teams[1];
    const team1Attackers = team1.pick === "Attackers";

    return (
        <div className="match-page-container">
            <div className="mp-match-header">
                <div className='mp-match-header-top'>
                    <div className='mp-map-time-group'>
                        <h1 className="mp-map-name">{matchData.map}</h1>
                        <p className='mp-match-time'>{formatDuration(matchData.game_duration)}</p>
                    </div>
                    <div className='mp-match-start'>
                        <span>Placeholder text</span>
                    </div>
                </div>
                <div className="mp-match-info">
                    <div className="mp-team-details">
                        <p className="mp-team-name">{team1.team_id}</p>
                        <div className='mp-round-scores'>
                            <span className={`mp-rounds-${getSideShort(team1Attackers)}`}>{team1.rounds_won[getSideShort(team1Attackers)]}</span>
                            <span className='mp-rounds-separator'>/</span>
                            <span className={`mp-rounds-${getSideShort(!team1Attackers)}`}>{team1.rounds_won[getSideShort(!team1Attackers)]}</span>
                            {team1.rounds_won.overtime >= 0 ? (
                                <>
                                    <span className='mp-rounds-separator'>/</span>
                                    <span className="mp-rounds-ot">{team1.rounds_won.overtime}</span>
                                </>
                            ) : null}
                        </div>
                    </div>
                    <div className="mp-match-score">
                        <span className={`mp-team-score ${team1.won ? "mp-winner-score" : "mp-loser-score"}`}>{team1.rounds_won.total}</span>
                        <span className="mp-score-separator">-</span>
                        <span className={`mp-team-score ${team2.won ? "mp-winner-score" : "mp-loser-score"}`}>{team2.rounds_won.total}</span>
                    </div>
                    <div className="mp-team-details">
                        <p className="mp-team-name">{team2.team_id}</p>
                        <div className='mp-round-scores'>
                            <span className={`mp-rounds-${getSideShort(team1Attackers)}`}>{team2.rounds_won[getSideShort(!team1Attackers)]}</span>
                            <span className='mp-rounds-separator'>/</span>
                            <span className={`mp-rounds-${getSideShort(!team1Attackers)}`}>{team2.rounds_won[getSideShort(team1Attackers)]}</span>
                            {team2.rounds_won.overtime >= 0 ? (
                                <>
                                    <span className='mp-rounds-separator'>/</span>
                                    <span className="mp-rounds-ot">{team2.rounds_won.overtime}</span>
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>

            <p className='mp-stats-subheading'>STATS</p>
            <div className="mp-scoreboards-container">
                <Scoreboard type="match" />
            </div>
        </div>
    );
}

export default MatchPage;