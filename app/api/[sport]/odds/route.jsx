import { getGlobalOddsCache } from "@/lib/scheduler";
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

// This function will take a bookmaker object and return the arbitrage opportunity
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
      (impliedProbabilities[index] / totalImpliedProbability) *
      100
    ).toFixed(2);
  });

  return {
    hasArbitrage,
    profitPercentage,
    bestOdds,
    bestOddsSource,
    betPercentage,
    fairDecimalOdds,
    totalImpliedProbability,
  };
}

export async function GET(request, { params }) {
  try {
    console.log("1. API Route - Starting GET request");
    const sport = params.sport;

    console.log("2. Sport parameter:", sport);
    if (!sport) {
      return NextResponse.json(
        { error: "Invalid or missing 'sport' parameter" },
        { status: 400 }
      );
    }

    console.log("3. Getting cache data");
    const { data: oddsData, lastUpdate } = await getGlobalOddsCache();

    console.log("4. Received cache data:", !!oddsData);
    if (!oddsData) {
      return NextResponse.json(
        { error: "Failed to initialize cache" },
        { status: 503 }
      );
    }

    const remainingRequests = oddsData[oddsData.length - 1].remaining_requests;
    const gameData = oddsData.slice(0, -1);

    // Filter games with bookmakers and add arbitrage calculations
    const gamesWithBookmakers = gameData
      .filter((game) => game.bookmakers.length > 0)
      .map((game) => ({
        ...game,
        arbitrageOpportunity: detectArbitrageOpportunity(game.bookmakers),
      }));

    return NextResponse.json({
      odds_data: gamesWithBookmakers,
      remaining_requests: remainingRequests,
      last_update: lastUpdate,
    });
  } catch (error) {
    console.error("5. Error in API route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
