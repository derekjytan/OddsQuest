import { AArrowDown } from "lucide-react";
import { getOdds, getSports } from "./odds-api";
import cron from "node-cron";

let globalOddsCache = null;
let lastUpdatedTime = null;
let isInitialized = false;

async function fetchAndUpdateCache() {
  try {
    console.log("1. Starting fetchAndUpdateCache");

    // First get available sports
    const sports = await getSports();
    if (!sports) {
      throw new Error("Failed to fetch sports list");
    }

    // Get odds for each active sport
    const allOdds = [];
    let successfulFetches = false;
    const processedSports = new Set(); // Track processed sports

    for (const sport of sports) {
      // Skip if already processed
      if (processedSports.has(sport.key)) continue;

      const sportOdds = await getOdds(sport.key);
      if (sportOdds) {
        allOdds.push(...sportOdds.slice(0, -1));
        successfulFetches = true;
        processedSports.add(sport.key);

        // Add delay between requests to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    if (!successfulFetches) {
      throw new Error("Failed to fetch odds for any sports");
    }

    // Add remaining requests from last successful fetch
    const lastSport = Array.from(processedSports).pop();
    if (lastSport) {
      const lastOddsResponse = await getOdds(lastSport);
      if (lastOddsResponse) {
        allOdds.push(lastOddsResponse[lastOddsResponse.length - 1]);
      }
    }

    globalOddsCache = allOdds;
    lastUpdatedTime = new Date();
    console.log("4. Successfully updated cache");
  } catch (error) {
    console.error("5. Error in fetchAndUpdateCache:", error);
    throw error;
  }
}

export async function initializeScheduler() {
  if (isInitialized) return;

  try {
    await fetchAndUpdateCache();
    cron.schedule("*/30 * * * *", fetchAndUpdateCache);
    isInitialized = true;
  } catch (error) {
    console.error("Failed to initialize scheduler:", error);
    throw error;
  }
}

export async function getGlobalOddsCache() {
  try {
    console.log("1. Starting getGlobalOddsCache");
    if (!globalOddsCache) {
      console.log("2. Cache empty, initializing");
      await initializeScheduler();
    }
    console.log("3. Returning cache data");
    return {
      data: globalOddsCache,
      lastUpdate: lastUpdatedTime,
    };
  } catch (error) {
    console.error("4. Error in getGlobalOddsCache:", error);
    throw error;
  }
}
