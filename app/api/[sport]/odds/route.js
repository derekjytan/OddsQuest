import { getCachedOdds } from "@/lib/odds-api";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const sport = params.sport;

  // console.log(`Fetching ${sport} odds data...`);

  try {
    const oddsData = await getCachedOdds(sport);
    // console.log("Received oddsData:", oddsData);

    if (!oddsData) {
      // console.log("No odds data returned");
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

        formattedData[gameKey] = {
          away_team: game.away_team,
          home_team: game.home_team,
          commence_time: game.commence_time,
          bookmakers: game.bookmakers,
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
