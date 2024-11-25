"use client";
import { useEffect, useState } from "react";
import { ArbitrageCard } from "@/app/components/ArbitrageCard"
import { useParams } from 'next/navigation'

export default function SportPage() {
  const [oddsData, setOddsData] = useState(null);
  const [error, setError] = useState(null);
  const [stakes, setStakes] = useState({});
  const params = useParams();
  const sport = params.sport;

  useEffect(() => {
    fetch(`/api/${sport}/odds`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        // Filter the odds data to only include games for the selected sport
        const filteredData = {
          ...data,
          odds_data: data.odds_data.filter(game => game.sport_key.includes(sport))
        };
        setOddsData(filteredData);
        
        // Initialize stakes object with empty values for each game
        const initialStakes = {};
        filteredData.odds_data.forEach((game, index) => {
          initialStakes[index] = {
            totalStake: '',
            bets: {}
          };
        });
        setStakes(initialStakes);
      })
      .catch((err) => setError(err.message));
  }, [sport]);

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
    <div className="flex min-h-screen">
      <div className="flex-1">
        <main className="p-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(oddsData?.odds_data || {}).map(([gameKey, game]) => (
              <ArbitrageCard
                key={gameKey}
                game={game}
                stakes={stakes[gameKey]}
                onStakeChange={(value) => handleTotalStakeChange(gameKey, value)}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}