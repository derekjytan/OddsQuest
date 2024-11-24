import "dotenv/config";

// Get the odds from the API for a given sport
async function getOdds(sport) {
  const url = "https://api.the-odds-api.com/v4/sports/" + sport + "/odds";
  const params = new URLSearchParams({
    apiKey: process.env.ODDS_API_KEY,
    regions: "us",
    markets: "h2h",
    oddsFormat: "decimal",
    includeBetLimits: "true",
  });

  try {
    console.log("Fetching from URL:", `${url}?${params}`);
    const response = await fetch(`${url}?${params}`);

    if (!response.ok) {
      console.error(
        "API Response not OK:",
        response.status,
        response.statusText
      );
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // console.log("Received API data:", data);
    const formattedData = [];

    for (const game of data) {
      const gameData = {
        id: game["id"],
        sports_key: game["sport_key"],
        sports_title: game["sport_title"],
        home_team: game["home_team"],
        away_team: game["away_team"],
        commence_time: game["commence_time"],
        bookmakers: [],
      };

      for (const bookmaker of game["bookmakers"]) {
        const bookmakerData = {
          name: bookmaker["title"],
          last_update: bookmaker["last_update"],
          odds: {},
        };

        if (bookmaker["markets"] && bookmaker["markets"][0]) {
          for (const outcome of bookmaker["markets"][0]["outcomes"]) {
            bookmakerData["odds"][outcome["name"]] = outcome["price"];
          }
        }

        gameData["bookmakers"].push(bookmakerData);
      }

      formattedData.push(gameData);
    }

    const remainingRequests =
      response.headers.get("x-requests-remaining") || "Unknown";
    formattedData.push({ remaining_requests: remainingRequests });

    return JSON.stringify(formattedData, 2);
  } catch (error) {
    if (error.name === "FetchError") {
      if (error.response?.status === 401) {
        console.log("Error: Invalid API key");
      } else if (error.response?.status === 429) {
        console.log("Error: API request limit exceeded");
      } else {
        console.log(`HTTP Error: ${error}`);
      }
    } else if (error.name === "TypeError") {
      console.log("Error: Unable to connect to the API");
    } else if (error.name === "SyntaxError") {
      console.log("Error: Unable to parse API response");
    } else {
      console.log(`An unexpected error occurred: ${error}`);
    }
    return null;
  }
}

export { getOdds };
