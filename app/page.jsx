"use client";
import { useEffect, useState } from "react";
import { Header } from "@/app/components/Header"
import { Sidebar } from "@/app/components/Sidebar"
import { ArbitrageCard } from "@/app/components/ArbitrageCard"
// import { QuickFilters } from "@/components/QuickFilters"

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
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-8">
          {/* <QuickFilters /> */}
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
