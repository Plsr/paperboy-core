const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Database Setup
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

app.use(bodyParser.json());

// Routes
app.get("/", (_req, res) => {
  res.send("Hello, world!");
});

const boomkmarkRoutes = require("./routes/bookmark");
const userRoutes = require("./routes/user");
app.use("/bookmarks", boomkmarkRoutes);
app.use("/users", userRoutes);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
