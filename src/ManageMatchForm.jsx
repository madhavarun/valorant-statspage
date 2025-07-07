import { useState } from "react";
import { API_URL } from "../config";

import './ManageMatchForm.css';

function ManageMatchForm() {
  const [action, setAction] = useState("add"); // "add" or "remove"
  const [matchId, setMatchId] = useState("");
  const [team1Attacking, setTeam1Attacking] = useState(true); // default to attackers
  const [authKey, setAuthKey] = useState("");
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = action === "add" ? "/api/addmatch" : "/api/removematch";

    const payload =
      action === "add"
        ? { matchId, team1Attacking }
        : { matchId };

    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": authKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setResponse(data);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
      <h3>Manage Match</h3>

      {/* Action Dropdown */}
      <div>
        <label htmlFor="action">Action:</label>
        <select
          id="action"
          value={action}
          onChange={(e) => setAction(e.target.value)}
        >
          <option value="add">Add Match</option>
          <option value="remove">Remove Match</option>
        </select>
      </div>

      {/* Match ID */}
      <div>
        <label htmlFor="matchId">Match ID:</label>
        <input
          id="matchId"
          type="text"
          value={matchId}
          onChange={(e) => setMatchId(e.target.value)}
          required
        />
      </div>

      {/* Team 1 Role (only for Add Match) */}
      {action === "add" && (
        <div>
          <label htmlFor="team1Role">Team 1 Role:</label>
          <select
            id="team1Role"
            value={team1Attacking ? "attackers" : "defenders"}
            onChange={(e) => setTeam1Attacking(e.target.value === "attackers")}
          >
            <option value="attackers">Attackers</option>
            <option value="defenders">Defenders</option>
          </select>
        </div>
      )}

      {/* Auth Key */}
      <div>
        <label htmlFor="authKey">Auth Key:</label>
        <input
          id="authKey"
          type="password"
          value={authKey}
          onChange={(e) => setAuthKey(e.target.value)}
          required
        />
      </div>

      <button type="submit">Submit</button>

      {response && (
        <pre className={response.success ? "success" : "error"}>
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </form>
  );
}

export default ManageMatchForm;