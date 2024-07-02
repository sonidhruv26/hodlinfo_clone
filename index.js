const express = require("express");
const path = require("path");
const app = express();
require("dotenv").config();
require("./controllers/dataController"); // This will start your intervals

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

const indexRouter = require("./routes/index");
app.use("/", indexRouter);

app.listen(4000, () => {
  console.log("Server started on port 4000");
});
