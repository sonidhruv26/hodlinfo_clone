const axios = require("axios");
const db = require("../config/db");
const { updateTicker, updatePriceDiff } = require("../models/tickerModel");

const fetchData = async () => {
  try {
    const response = await axios.get("https://api.wazirx.com/api/v2/tickers", {
      timeout: 10000,
    }); // 10 seconds timeout
    return Object.values(response.data)
      .slice(0, 10)
      .map((ticker) => ({
        name: ticker.name,
        last: ticker.last,
        buy: ticker.buy,
        sell: ticker.sell,
        volume: ticker.volume,
        base_unit: ticker.base_unit,
      }));
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return [];
  }
};

const updateDatabase = async () => {
  try {
    const tickers = await fetchData();
    tickers.forEach((ticker) => {
      updateTicker(ticker);
    });
  } catch (error) {
    console.error("Error updating database:", error.message);
  }
};

const updatePriceDifferences = () => {
  try {
    ["5Min", "1Hr", "1Day", "7Days"].forEach((time) => {
      updatePriceDiff(time);
    });
  } catch (error) {
    console.error("Error updating price differences:", error.message);
  }
};

setInterval(updateDatabase, 30000); // Every 30 seconds
setInterval(() => updatePriceDiff("5Min"), 300000); // Every 5 minutes
setInterval(() => updatePriceDiff("1Hr"), 3600000); // Every 1 hour
setInterval(() => updatePriceDiff("1Day"), 86400000); // Every 1 day
setInterval(() => updatePriceDiff("7Days"), 604800000); // Every 7 days

module.exports = { fetchData, updateDatabase, updatePriceDifferences };
