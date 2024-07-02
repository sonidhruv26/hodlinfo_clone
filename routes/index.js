const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { fetchData } = require("../controllers/dataController");

const getAveragePrice = (baseUnit) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT AVG(last) as averagePrice FROM tickers WHERE base_unit = ?`;
    db.query(sql, [baseUnit], (err, result) => {
      if (err) reject(err);
      resolve(result[0]);
    });
  });
};

const getPriceDiff = (baseUnit, time) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT AVG(priceDiff${time}) as priceDiff FROM tickers WHERE base_unit = ?`;
    db.query(sql, [baseUnit], (err, result) => {
      if (err) reject(err);
      resolve(result[0]);
    });
  });
};

router.get("/", async (req, res) => {
  const currency = req.query.currency?.toLowerCase() || "inr";
  const crypto = req.query.crypto?.toLowerCase() || "btc";

  try {
    const sql = `SELECT * FROM tickers`;
    db.query(sql, async (err, result) => {
      if (err) throw err;
      const data = result.map((ticker) => ({
        name: ticker.name,
        last: ticker.last,
        buy: ticker.buy,
        sell: ticker.sell,
        difference: (((ticker.sell - ticker.buy) / ticker.buy) * 100).toFixed(
          2
        ),
        savings: (ticker.last - ticker.buy).toFixed(2),
        volume: ticker.volume,
        base_unit: ticker.base_unit,
      }));

      const baseUnitTypesQry = "SELECT DISTINCT base_unit FROM tickers";
      db.query(baseUnitTypesQry, async (err, result) => {
        if (err) throw err;
        const baseUnitTypes = result.map((row) => row.base_unit);
        const figures = {};

        await Promise.all([
          getAveragePrice(crypto).then((result) => {
            figures.averagePrice = Number(result.averagePrice).toFixed(0);
          }),
          getPriceDiff(crypto, "5Min").then((result) => {
            figures.priceFiveMins = Number(result.priceDiff).toFixed(2);
          }),
          getPriceDiff(crypto, "1Hr").then((result) => {
            figures.priceOneHour = Number(result.priceDiff).toFixed(2);
          }),
          getPriceDiff(crypto, "1Day").then((result) => {
            figures.priceOneDay = Number(result.priceDiff).toFixed(2);
          }),
          getPriceDiff(crypto, "7Days").then((result) => {
            figures.priceSevenDays = Number(result.priceDiff).toFixed(2);
          }),
        ]);

        res.render("index", {
          currency: currency,
          crypto: crypto,
          tickers: data,
          baseUnitTypes: baseUnitTypes,
          figures: figures,
        });
      });
    });
  } catch (error) {
    console.error("Error handling request:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
