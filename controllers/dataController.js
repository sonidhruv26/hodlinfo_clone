const axios = require("axios");
const db = require("../config/db");

const fetchData = async () => {
  try {
    const response = await axios.get("https://api.wazirx.com/api/v2/tickers");
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

const updateTicker = (ticker) => {
  const sql = `
    INSERT INTO tickers (name, last, buy, sell, volume, base_unit)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    last = VALUES(last),
    buy = VALUES(buy),
    sell = VALUES(sell),
    volume = VALUES(volume)
  `;
  db.query(
    sql,
    [
      ticker.name,
      ticker.last,
      ticker.buy,
      ticker.sell,
      ticker.volume,
      ticker.base_unit,
    ],
    (err) => {
      if (err) {
        console.error("Error updating ticker:", err.message);
      }
    }
  );
};

const updatePriceDiff = async (time) => {
  const sql = "SELECT * FROM tickers";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching tickers:", err.message);
      return;
    }
    result.forEach((ticker) => {
      const priceDiff = (
        ((ticker.last - ticker.buy) / ticker.buy) *
        100
      ).toFixed(2);
      const updateSql = `UPDATE tickers SET priceDiff${time} = ? WHERE name = ?`;
      db.query(updateSql, [priceDiff, ticker.name], (err) => {
        if (err) {
          console.error(
            `Error updating price difference for ${ticker.name} at ${time}:`,
            err.message
          );
        }
      });
    });
  });
};

// Update tickers every 30 seconds
setInterval(async () => {
  const tickers = await fetchData();
  tickers.forEach(updateTicker);
}, 30000);

// Update price differences at different intervals
setInterval(() => updatePriceDiff("5Min"), 300000); // Every 5 minutes
setInterval(() => updatePriceDiff("1Hr"), 3600000); // Every 1 hour
setInterval(() => updatePriceDiff("1Day"), 86400000); // Every 1 day
setInterval(() => updatePriceDiff("7Days"), 604800000); // Every 7 days

module.exports = { fetchData, updatePriceDiff };
