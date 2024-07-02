const db = require("../config/db");

const getAveragePrice = (baseUnit) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT AVG(last) as averagePrice FROM tickers WHERE base_unit = ?";
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

module.exports = { getAveragePrice, getPriceDiff };
