import { getCachedOdds } from "@/lib/odds-api";
import { NextResponse } from "next/server";

function calculateArbitrage(odds) {
  // Original vig calculation
  const impliedProbabilities = odds.map((odd) => 1 / odd);
  const totalImpliedProbability = impliedProbabilities.reduce(
    (a, b) => a + b,
    0
  );
  const arbitragePercentage = (1 - totalImpliedProbability) * 100;

  // Calculate fair decimal odds
  const fairDecimalOdds = 1 / impliedProbabilities.reduce((a, b) => a + b);

  const totalStake = 100;
  const betAmounts = impliedProbabilities.map(
    (prob) => (prob / totalImpliedProbability) * totalStake
  );

  return {
    arbitragePercentage,
    fairDecimalOdds: fairDecimalOdds.toFixed(3), // This will show the decimal odds like "1.986"
    betAmounts,
    betAmountsByTeam: {},
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

        // Calculate arbitrage for each bookmaker
        const bookmakers = game.bookmakers.map((bookmaker) => {
          const odds = Object.values(bookmaker.odds);
          const arbitrageData = calculateArbitrage(odds);

          return {
            ...bookmaker,
            arbitrage: {
              ...arbitrageData,
              betAmountsByTeam: Object.keys(bookmaker.odds).reduce(
                (acc, team, index) => {
                  acc[team] = arbitrageData.betAmounts[index];
                  return acc;
                },
                {}
              ),
            },
          };
        });

        formattedData[gameKey] = {
          away_team: game.away_team,
          home_team: game.home_team,
          commence_time: game.commence_time,
          bookmakers,
          missing_bookmakers: Array.from(allBookmakers).filter(
            (bookmaker) => !currentBookmakers.has(bookmaker)
          ),
        };
      });

      const response = {
        odds_data: formattedData,
        remaining_requests: remainingRequests,
      };

      return NextResponse.json(response);
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
