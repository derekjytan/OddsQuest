import { getCachedOdds } from "@/lib/odds-api";
import { NextResponse } from "next/server";

function calculateSingleBookmakerArbitrage(odds) {
  const impliedProbabilities = odds.map((odd) => 1 / odd);
  const totalImpliedProbability = impliedProbabilities.reduce(
    (a, b) => a + b,
    0
  );
  const arbitragePercentage = (1 - totalImpliedProbability) * 100;
  const fairDecimalOdds = (1 / totalImpliedProbability).toFixed(3);

  // Calculate percentages without assuming stake
  const betPercentage = impliedProbabilities.map((prob) =>
    ((prob / totalImpliedProbability) * 100).toFixed(2)
  );

  return {
    arbitragePercentage,
    fairDecimalOdds,
    betPercentage,
    betPercentageByTeam: {},
  };
}

function detectArbitrageOpportunity(bookmakers) {
  // Find best odds for each team across all bookmakers
  let bestOdds = {};
  let bestOddsSource = {};

  bookmakers.forEach((bookmaker) => {
    Object.entries(bookmaker.odds).forEach(([team, odd]) => {
      if (!bestOdds[team] || odd > bestOdds[team]) {
        bestOdds[team] = odd;
        bestOddsSource[team] = bookmaker.name;
      }
    });
  });

  // Calculate arbitrage opportunity
  const impliedProbabilities = Object.values(bestOdds).map((odd) => 1 / odd);
  const totalImpliedProbability = impliedProbabilities.reduce(
    (a, b) => a + b,
    0
  );

  const hasArbitrage = totalImpliedProbability < 1;
  const profitPercentage = ((1 - totalImpliedProbability) * 100).toFixed(2);
  const fairDecimalOdds = (1 / totalImpliedProbability).toFixed(3);

  // Calculate bet percentages
  const betPercentage = {};
  Object.keys(bestOdds).forEach((team, index) => {
    betPercentage[team] = (
      (impliedProbabilities[index] / totalImpliedProbability) * 100
    ).toFixed(2);
  });
  
  return {
    hasArbitrage,
    profitPercentage,
    bestOdds,
    bestOddsSource,
    betPercentage,
    fairDecimalOdds,
  };
}

export async function GET(request, { params }) {
  const sport = params.sport;

  try {
    const oddsData = await getCachedOdds(sport);
    if (!oddsData) {
      return NextResponse.json(
        { error: "Failed to retrieve odds data" },
        { status: 500 }
      );
    }

    try {
      const data = JSON.parse(oddsData);
      const remainingRequests = data[data.length - 1].remaining_requests;
      const gameData = data.slice(0, -1);

      // Track all bookmakers for missing bookmaker detection
      const allBookmakers = new Set();
      gameData.forEach((game) => {
        game.bookmakers.forEach((bookmaker) => {
          allBookmakers.add(bookmaker.name);
        });
      });

      const formattedData = {};
      gameData.forEach((game, index) => {
        const gameKey = `Game ${index + 1}`;
        const currentBookmakers = new Set(
          game.bookmakers.map((bookmaker) => bookmaker.name)
        );

        // Calculate individual bookmaker arbitrage
        const bookmakers = game.bookmakers.map((bookmaker) => {
          const odds = Object.values(bookmaker.odds);
          const arbitrageData = calculateSingleBookmakerArbitrage(odds);

          return {
            ...bookmaker,
            arbitrage: {
              ...arbitrageData,
              betPercentageByTeam: Object.keys(bookmaker.odds).reduce(
                (acc, team, index) => {
                  acc[team] = arbitrageData.betPercentage[index];
                  return acc;
                },
                {}
              ),
            },
          };
        });

        // Calculate cross-bookmaker arbitrage
        const arbitrageOpportunity = detectArbitrageOpportunity(
          game.bookmakers
        );

        formattedData[gameKey] = {
          away_team: game.away_team,
          home_team: game.home_team,
          commence_time: game.commence_time,
          bookmakers,
          arbitrageOpportunity,
          missing_bookmakers: Array.from(allBookmakers).filter(
            (bookmaker) => !currentBookmakers.has(bookmaker)
          ),
        };
      });

      return NextResponse.json({
        odds_data: formattedData,
        remaining_requests: remainingRequests,
      });
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, "Data:", oddsData);
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing odds:", error);
    return NextResponse.json(
      { error: "Failed to retrieve odds data" },
      { status: 500 }
    );
  }
}
