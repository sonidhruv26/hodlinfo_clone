const express = require("express");
const path = require("path");
require("dotenv").config();
const app = express();

// Database and Controllers
require("./config/db");
const {
  updateDatabase,
  updatePriceDifferences,
} = require("./controllers/dataController");

// Set view engine and static files
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Routes
const indexRouter = require("./routes/index");
app.use("/", indexRouter);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Initialize periodic tasks
updateDatabase();
updatePriceDifferences();
