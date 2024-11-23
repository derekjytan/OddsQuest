import { getOdds } from "./odds-api";
import cron from "node-cron";

let globalOddsCache = null;
let lastUpdatedTime = null;
let isInitialized = false;

// Function to fetch and update the cache
async function fetchAndUpdateCache() {
    try {
        // console.log("Fetching new odds data...", new Date().toISOString());
        const oddsData = await getOdds("upcoming");
        // console.log("Odds data fetched successfully");

        // If there are odds, update the cache
        if (oddsData) {
            globalOddsCache = oddsData;
            lastUpdatedTime = new Date();
            // console.log("Cache updated successfully");
        }
    } catch (error) {
        console.error("Error fetching and updating cache:", error);
    }
}

// Initialize the scheduler
export async function initializeScheduler() {
    if (isInitialized) {
        // console.log("Scheduler already initialized");
        return;
    }

    // console.log("Initializing scheduler...");
    // Immediately fetch and update the cache on startup
    await fetchAndUpdateCache();
    // Schedule to run every 30 minutes
    cron.schedule("*/30 * * * *", fetchAndUpdateCache);
    isInitialized = true;
    // console.log("Scheduler initialization complete");
}

// Getter method to export the cached data for other files to use
export async function getGlobalOddsCache() {
    if (!globalOddsCache) {
        // console.log("Cache not initialized, initializing now...");
        await initializeScheduler();
    }
    return {
        data: globalOddsCache,
        lastUpdate: lastUpdatedTime
    };
}