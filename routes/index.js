const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { getAveragePrice, getPriceDiff } = require("../models/tickerModel");

router.get("/", async (req, res) => {
  const currency = (req.query.currency || "inr").toLowerCase();
  const crypto = (req.query.crypto || "btc").toLowerCase();

  try {
    const sql = "SELECT * FROM tickers";
    db.query(sql, async (err, result) => {
      if (err) {
        console.error("Error fetching tickers:", err.message);
        return res.status(500).send("Internal Server Error");
      }

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
        if (err) {
          console.error("Error fetching base units:", err.message);
          return res.status(500).send("Internal Server Error");
        }
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
