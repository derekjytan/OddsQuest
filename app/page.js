"use client";
import { useEffect, useState } from "react";

// Function to get label and color based on fair odds
function getFairOddsQuality(fairOdds) {
  if (fairOdds >= 0.98) return { label: "Great", color: "text-green-600" };
  if (fairOdds >= 0.95) return { label: "Average", color: "text-yellow-600" };
  return { label: "Poor", color: "text-red-600" };
}

// Function to format the date and time
function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
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
        // Store the odds data in the state 
        setOddsData(data);
        // Initialize stakes object with empty values for each game
        const initialStakes = {};
        Object.keys(data.odds_data).forEach(gameKey => {
          initialStakes[gameKey] = {
            totalStake: '',
            bets: {}
          };
        });
        setStakes(initialStakes);
      })
      .catch((err) => setError(err.message));
  }, []);

  // Handle the total stake changes 
  const handleTotalStakeChange = (gameKey, value) => {
    const game = oddsData.odds_data[gameKey];
    const percentages = game.arbitrageOpportunity.betPercentage;
    
    if (value === '') {
      setStakes(prev => ({
        ...prev,
        [gameKey]: { totalStake: '', bets: {} }
      }));
      return;
    }

    const totalStake = parseFloat(value);
    if (isNaN(totalStake)) return;

    // Calculate individual bets based on percentage
    const bets = {};
    Object.keys(percentages).forEach(team => {
      bets[team] = ((totalStake * percentages[team]) / 100).toFixed(2);
    });
    
    setStakes(prev => ({
      ...prev,
      [gameKey]: {
        totalStake: value,
        bets: bets
      }
    }));
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
            
            {/* Profit Metrics */}
            <div className="mb-4 space-y-2">
              <p>Total Market Probability: {(game.arbitrageOpportunity.totalImpliedProbability * 100).toFixed(2)}%</p>
              <div className={game.arbitrageOpportunity.profitPercentage > 0 ? "text-green-600" : "text-red-600"}>
                <p>Potential Return: {game.arbitrageOpportunity.profitPercentage}%</p>
                {stakes[gameKey]?.totalStake && (
                  <p>
                    Profit: ${(stakes[gameKey].totalStake * (game.arbitrageOpportunity.profitPercentage / 100)).toFixed(2)}
                  </p>
                )}
              </div>
            </div>

            {/* Stake Input */}
            <div className="mb-4">
              <label className="flex items-center gap-2">
                Total Stake: $
                <input
                  type="number"
                  min="0"
                  className="border rounded px-2 py-1"
                  placeholder="Enter stake"
                  value={stakes[gameKey]?.totalStake || ''}
                  onChange={(e) => handleTotalStakeChange(gameKey, e.target.value)}
                />
              </label>
            </div>

            {/* Odds Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-2">Outcome</th>
                    <th className="pb-2">Odds</th>
                    <th className="pb-2">Implied Prob</th>
                    <th className="pb-2">Bet Amount</th>
                    <th className="pb-2">Return</th>
                    <th className="pb-2">Via</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(game.arbitrageOpportunity.bestOdds).map(([team, odds]) => {
                    const impliedProb = (1/odds * 100).toFixed(2);
                    const betAmount = stakes[gameKey]?.totalStake ? 
                      (stakes[gameKey].totalStake * game.arbitrageOpportunity.betPercentage[team] / 100).toFixed(2) : 
                      '0.00';
                    const potentialReturn = stakes[gameKey]?.totalStake ? 
                      (betAmount * odds).toFixed(2) : 
                      '0.00';
                    
                    return (
                      <tr key={team} className="border-b">
                        <td className="py-2">{team}</td>
                        <td>{odds.toFixed(2)}</td>
                        <td>{impliedProb}%</td>
                        <td>${betAmount}</td>
                        <td>${potentialReturn}</td>
                        <td>{game.arbitrageOpportunity.bestOddsSource[team]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
