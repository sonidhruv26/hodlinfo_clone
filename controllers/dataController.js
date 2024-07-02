const axios = require("axios");
const db = require("../config/db");
const { updateTicker, updatePriceDiff } = require("../models/tickerModel");

const fetchData = async () => {
  try {
    const response = await axios.get("https://api.wazirx.com/api/v2/tickers", {timeout: 10000}); // 10 seconds timeout
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
    console.error("Error fetching data:", error);
    return [];
  }
};

const updateDatabase = async () => {
  const tickers = await fetchData();
  tickers.forEach((ticker) => {
    updateTicker(ticker);
  });
};

const updatePriceDifferences = () => {
  ["5Min", "1Hr", "1Day", "7Days"].forEach((time) => {
    updatePriceDiff(time);
  });
};

setInterval(updateDatabase, 60000);
setInterval(() => updatePriceDiff("5Min"), 300000);
setInterval(() => updatePriceDiff("1Hr"), 3600000);
setInterval(() => updatePriceDiff("1Day"), 86400000);
setInterval(() => updatePriceDiff("7Days"), 604800000);

module.exports = { fetchData, updateDatabase, updatePriceDifferences };