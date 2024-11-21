require("dotenv").config();
const fetch = require("node-fetch");

class Cache {
  constructor() {
    this.cache = {};
    // 15 minute cache to reduce API calls
    this.cacheDuration = 15 * 60 * 1000;
  }

  async getCachedOdds(sport) {
    const currentTime = new Date();

    if (sport in this.cache) {
      const [data, timestamp] = this.cache[sport];

      if (currentTime - timestamp < this.cacheDuration) {
        console.log(`Returning cached data for ${sport}`);
        return data;
      }
    }

    console.log("Fetching new data...");
    const newData = await getOdds(sport);
    if (newData) {
      this.cache[sport] = [newData, currentTime];
    }
    return newData;
  }
}

async function getOdds(sport) {
  const url = "https://api.the-odds-api.com/v4/sports/" + sport + "/odds";
  const params = new URLSearchParams({
    apiKey: process.env.ODDS_API,
    regions: "us",
    markets: "h2h",
    oddsFormat: "decimal",
  });

  try {
    const response = await fetch(`${url}?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const formattedData = [];

    for (const game of data) {
      const gameData = {
        home_team: game["home_team"],
        away_team: game["away_team"],
        commence_time: new Date(game["commence_time"])
          .toISOString()
          .replace("T", " ")
          .replace(/\.\d+Z$/, ""),
        bookmakers: [],
      };

      for (const bookmaker of game["bookmakers"]) {
        const bookmakerData = {
          name: bookmaker["title"],
          last_update: new Date(bookmaker["last_update"])
            .toISOString()
            .replace("T", " ")
            .replace(/\.\d+Z$/, ""),
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

const oddsCache = new Cache();

function getCachedOdds(sport) {
  return oddsCache.getCachedOdds(sport);
}

module.exports = { getCachedOdds };
