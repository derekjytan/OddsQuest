import { getOdds } from "./odds-api";
import cron from "node-cron";

let globalOddsCache = {};
let lastUpdatedTime = null;
let isInitialized = false;

// Function to fetch and update the cache
async function fetchAndUpdateCache() {
    try {
        const oddsData = await getOdds("upcoming");

        if (oddsData) {
            const parsedData = JSON.parse(oddsData);
            const groupBySport = parsedData.reduce((groupedGames, game) => {
                if (game.remaining_requests) return groupedGames;

                const sportKey = game.sport_key;
                if (!groupedGames[sportKey]) groupedGames[sportKey] = [];
                groupedGames[sportKey].push(game);
                return groupedGames;
            }, {});
            
            globalOddsCache = groupBySport;
            lastUpdatedTime = new Date();
        }
    } catch (error) {
        console.error("Error fetching and updating cache:", error);
    }
}

// Initialize the scheduler
export async function initializeScheduler() {
    if (isInitialized) return;
    await fetchAndUpdateCache();

    // Schedule to run every 30 minutes
    cron.schedule("*/30 * * * *", fetchAndUpdateCache);
    isInitialized = true;
}

// Getter method to export the cached data for other files to use
export async function getGlobalOddsCache() {
    if (!globalOddsCache); await initializeScheduler();
    return {
        data: globalOddsCache,
        lastUpdate: lastUpdatedTime
    };
}