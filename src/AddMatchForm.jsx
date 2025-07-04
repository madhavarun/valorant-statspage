import { useState } from "react";
import { API_URL } from "../config";

function AddMatchForm() {
  const [matchId, setMatchId] = useState("");
  const [team1Attacking, setTeam1Attacking] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/api/addmatch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey
      },
      body: JSON.stringify({ matchId, team1Attacking })
    });

    const data = await res.json();
    setResponse(data);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
      <h3>Add Match</h3>
      <div>
        <label>Match ID:</label>
        <input
          type="text"
          value={matchId}
          onChange={(e) => setMatchId(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Team 1 Attackers:</label>
        <input
          type="checkbox"
          checked={team1Attacking}
          onChange={(e) => setTeam1Attacking(e.target.checked)}
        />
      </div>
      <div>
        <label>API Key:</label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          required
        />
      </div>
      <button type="submit">Submit</button>

      {response && (
        <pre style={{ marginTop: "1rem", color: response.success ? "green" : "red" }}>
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </form>
  );
}

export default AddMatchForm;