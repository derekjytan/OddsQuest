import "dotenv/config";

// Get the sport form the api
async function getSports() {
  const url = "https://api.the-odds-api.com/v4/sports";
  const params = new URLSearchParams({
    apiKey: process.env.ODDS_API_KEY,
  });

  try {
    const response = await fetch(`${url}?${params}`);
    if (!response.ok) {
      console.log("Sports API Response Error:", {
        status: response.status,
        statusText: response.statusText,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const sports = await response.json();
    // Only return active sports
    return sports.filter((sport) => sport.active);
  } catch (error) {
    console.error("Error in getSport:", error);
    return [];
  }
}

// Get the odds from the API for a given sport
async function getOdds(sport) {
  console.log("1. Starting getOdds for sport:", sport);
  const url = "https://api.the-odds-api.com/v4/sports/" + sport + "/odds";
  const params = new URLSearchParams({
    apiKey: process.env.ODDS_API_KEY,
    regions: "us",
    markets: "h2h",
    oddsFormat: "decimal",
    includeBetLimits: "true",
  });

  try {
    console.log("2. Making API request to:", url);
    const response = await fetch(`${url}?${params}`);

    if (!response.ok) {
      console.error("3. API Response Error:", {
        status: response.status,
        statusText: response.statusText,
        sport: sport,
      });

      // Skip 422 errors without throwing
      if (response.status === 422) {
        console.log(`Skipping ${sport} - market not available`);
        return null;
      }

      return null;
    }

    const data = await response.json();
    console.log("4. Received API data length:", data.length);

    const formattedData = [];

    for (const game of data) {
      const gameData = {
        id: game["id"],
        sport_key: game["sport_key"],
        sport_title: game["sport_title"],
        home_team: game["home_team"],
        away_team: game["away_team"],
        commence_time: game["commence_time"],
        bookmakers: game["bookmakers"].map((bookmaker) => ({
          name: bookmaker["title"],
          last_update: bookmaker["last_update"],
          odds:
            bookmaker["markets"]?.[0]?.["outcomes"].reduce((acc, outcome) => {
              acc[outcome["name"]] = outcome["price"];
              return acc;
            }, {}) || {},
        })),
      };

      formattedData.push(gameData);
    }

    const remainingRequests =
      response.headers.get("x-requests-remaining") || "Unknown";
    formattedData.push({ remaining_requests: remainingRequests });

    return formattedData;
  } catch (error) {
    console.error("5. Error in getOdds:", error);
    return null;
  }
}

export { getOdds, getSports };
