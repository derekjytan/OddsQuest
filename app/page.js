"use client";
import { useEffect, useState } from "react";

function getFairOddsQuality(fairOdds) {
  if (fairOdds >= 0.98) return { label: "Great", color: "text-green-600" };
  if (fairOdds >= 0.95) return { label: "Average", color: "text-yellow-600" };
  return { label: "Poor", color: "text-red-600" };
}

function getArbitrageQuality(profitPercentage) {
  const profit = parseFloat(profitPercentage);
  if (profit > 0) return { label: "Profitable!", color: "text-green-600" };
  if (profit > -2)
    return { label: "Close to Arbitrage", color: "text-yellow-600" };
  return { label: "No Arbitrage", color: "text-red-600" };
}

function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export default function Home() {
  const [oddsData, setOddsData] = useState(null);
  const [error, setError] = useState(null);
  const [stakes, setStakes] = useState({});
  const sport = "upcoming"

  useEffect(() => {
    fetch(`/api/${sport}/odds`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        setOddsData(data);
        // Initialize stakes object with empty values for each game
        const initialStakes = {};
        Object.keys(data.odds_data).forEach(gameKey => {
          initialStakes[gameKey] = {
            amount: '',
            team: null
          };
        });
        setStakes(initialStakes);
      })
      .catch((err) => setError(err.message));
  }, []);

  const handleStakeChange = (gameKey, team, value) => {
    const game = oddsData.odds_data[gameKey];
    const percentages = game.arbitrageOpportunity.betPercentage;
    
    if (value === '') {
      setStakes(prev => ({
        ...prev,
        [gameKey]: { amount: '', team: null }
      }));
      return;
    }

    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return;

    const totalStake = (numericValue * 100) / percentages[team];
    const newStakes = { amount: numericValue, team };
    
    setStakes(prev => ({
      ...prev,
      [gameKey]: newStakes
    }));
  };

  const calculateOtherStake = (gameKey, team, currentStake) => {
    if (!currentStake) return '';
    const game = oddsData.odds_data[gameKey];
    const percentages = game.arbitrageOpportunity.betPercentage;
    const totalStake = (currentStake * 100) / percentages[stakes[gameKey].team];
    return ((totalStake * percentages[team]) / 100).toFixed(2);
  };

  if (error)
    return (
      <div className="flex justify-center p-4 text-red-500">Error: {error}</div>
    );
  if (!oddsData)
    return <div className="flex justify-center p-4">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 font-mono">
      {Object.entries(oddsData.odds_data).map(([gameKey, game]) => (
        <div key={gameKey} className="mb-8 border p-4 rounded">
          <h2 className="text-lg font-bold mb-2">
            Game: {game.away_team} @ {game.home_team}
          </h2>
          <p className="mb-2">
            Game Time: {formatDateTime(game.commence_time)}
          </p>

          {/* Cross-Bookmaker Arbitrage Section */}
          <div className="mb-4 p-4 bg-gray-100 rounded">
            <h3 className="font-bold mb-2">Cross-Bookmaker Arbitrage:</h3>
            <div
              className={`p-3 rounded ${
                game.arbitrageOpportunity.hasArbitrage
                  ? "bg-green-100"
                  : "bg-gray-50"
              }`}
            >
              <p
                className={
                  getArbitrageQuality(
                    game.arbitrageOpportunity.profitPercentage
                  ).color
                }
              >
                Status:{" "}
                {
                  getArbitrageQuality(
                    game.arbitrageOpportunity.profitPercentage
                  ).label
                }
              </p>
              <p>
                Potential Profit: {game.arbitrageOpportunity.profitPercentage}%
              </p>
              <p>Fair Odds: {game.arbitrageOpportunity.fairDecimalOdds}</p>

              <div className="mt-2">
                <p className="font-bold">Best Odds Available:</p>
                {Object.entries(game.arbitrageOpportunity.bestOdds).map(
                  ([team, odds]) => (
                    <div
                      key={team}
                      className="flex justify-between items-center mt-1"
                    >
                      <span>
                        {team}: {odds}
                      </span>
                      <span className="text-sm text-gray-600">
                        via {game.arbitrageOpportunity.bestOddsSource[team]}
                        <span className="ml-2">
                          Bet: {game.arbitrageOpportunity.betPercentage[team]}%
                        </span>
                        <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Enter stake"
                        className="w-50 px-2 py-1 border rounded ml-2"
                        value={stakes[gameKey]?.team === team ? stakes[gameKey].amount : calculateOtherStake(gameKey, team, stakes[gameKey]?.amount)}
                        onChange={(e) => handleStakeChange(gameKey, team, e.target.value)}
                      />
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Individual Bookmaker Section */}
          <div className="mb-4">
            <h3 className="font-bold">Individual Bookmaker Odds:</h3>
            {game.bookmakers.map((bookmaker) => (
              <div
                key={bookmaker.name}
                className="ml-4 mb-4 p-3 bg-gray-50 rounded"
              >
                <h4 className="font-bold">{bookmaker.name}:</h4>
                <p className="ml-4 text-sm">
                  Last Update: {formatDateTime(bookmaker.last_update)}
                </p>

                <div className="ml-4 mt-2">
                  {Object.entries(bookmaker.odds).map(([team, odd]) => (
                    <div
                      key={team}
                      className="flex justify-between items-center"
                    >
                      <span>
                        {team}: {odd}
                      </span>
                      <span className="text-gray-600">
                        Bet: {bookmaker.arbitrage.betPercentageByTeam[team]}%
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-2 ml-4">
                  <p
                    className={`font-bold ${
                      bookmaker.arbitrage.arbitragePercentage > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    Vig: {bookmaker.arbitrage.arbitragePercentage.toFixed(2)}%
                  </p>
                  <p className="font-bold flex items-center gap-2">
                    Fair Odds: {bookmaker.arbitrage.fairDecimalOdds}
                    <span
                      className={`${
                        getFairOddsQuality(
                          parseFloat(bookmaker.arbitrage.fairDecimalOdds)
                        ).color
                      } text-sm`}
                    >
                      (
                      {
                        getFairOddsQuality(
                          parseFloat(bookmaker.arbitrage.fairDecimalOdds)
                        ).label
                      }
                      )
                    </span>
                  </p>
                </div>
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
