"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [oddsData, setOddsData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // console.log("Fetching NBA odds data...");
    fetch("/api/basketball_nba/odds")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        setOddsData(data);
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!oddsData)
    return <div className="flex justify-center p-4">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 font-mono">
      {Object.entries(oddsData.odds_data).map(([gameKey, game]) => (
        <div key={gameKey} className="mb-8 border p-4 rounded">
          <h2 className="text-lg font-bold mb-2">
            Game: {game.away_team} @ {game.home_team}
          </h2>
          <p className="mb-2">Commence Time: {game.commence_time}</p>

          <div className="mb-4">
            <h3 className="font-bold">Odds:</h3>
            {game.bookmakers.map((bookmaker) => (
              <div key={bookmaker.name} className="ml-4 mb-2">
                <h4 className="font-bold">{bookmaker.name}:</h4>
                <p className="ml-4">Last Update: {bookmaker.last_update}</p>
                {Object.entries(bookmaker.odds).map(([team, odds]) => (
                  <p key={team} className="ml-4">
                    {team}: {odds}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {game.missing_bookmakers.length > 0 && (
            <div>
              <h3 className="font-bold">Missing bookmakers for this game:</h3>
              <ul className="ml-4">
                {game.missing_bookmakers.map((bookie) => (
                  <li key={bookie}>- {bookie}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}

      <div className="mt-4 font-bold">
        Remaining API requests: {oddsData.remaining_requests}
      </div>
    </div>
  );
}
