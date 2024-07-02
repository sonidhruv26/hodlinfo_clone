const db = require('../config/db');

const updateTicker = (ticker) => {
  const sql = `UPDATE tickers SET last = ?, buy = ?, sell = ?, volume = ? WHERE name = ?`;
  db.query(sql, [ticker.last, ticker.buy, ticker.sell, ticker.volume, ticker.name], (err, result) => {
    if (err) throw err;
    console.log(`Ticker updated for ${ticker.name}`);
  });
};

const updatePriceDiff = (time) => {
  const sql = `SELECT * FROM tickers`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    result.forEach((ticker) => {
      const priceDiff = (((ticker.last - ticker.buy) / ticker.buy) * 100).toFixed(2);
      const updateSql = `UPDATE tickers SET priceDiff${time} = ? WHERE name = ?`;
      db.query(updateSql, [priceDiff, ticker.name], (err, result) => {
        if (err) throw err;
        console.log(`Price difference updated for ${ticker.name} at ${time}`);
      });
    });
  });
};

module.exports = { updateTicker, updatePriceDiff };
