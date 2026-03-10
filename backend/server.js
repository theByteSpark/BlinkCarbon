const express = require("express");
const cors = require("cors");
require("dotenv").config();

const mailRoutes = require("./routes/mailRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/mail", mailRoutes);

app.get("/", (req, res) => {
  res.send("BlinkCarbon Backend Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});