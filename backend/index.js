const express = require("express");
const path = require("path");
require("dotenv").config();
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME || "MyApp";

// health check api
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: APP_NAME
  });
});

// serve react build
const frontendBuildPath = path.join(__dirname, "public");
app.use(express.static(frontendBuildPath));

// react router fallback (Express 5 safe)
app.use((req, res) => {
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const logStream = fs.createWriteStream(
  process.env.LOG_PATH || "./logs/app.log",
  { flags: "a" }
);

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  console.log(line.trim());
  logStream.write(line);
}

log(`Server started on port ${PORT}`);