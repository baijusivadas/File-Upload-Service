const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// Create logs directory if it doesn't exist
const logDir = path.join(__dirname, "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Logger setup
const logger = require("logger").createLogger("logs/server.log");
logger.setLevel("info");

// Routes and middleware
const fileRoutes = require("./routes/fileRoutes");
const errorHandler = require("./middlewares/errorMiddleware");

const app = express();

// Set EJS as view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/icons", express.static(path.join(__dirname, "public/icons")));

// Log incoming requests
app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

app.use("/", fileRoutes);
app.use("/upload", fileRoutes);

// Error handlers
app.use(errorHandler.notFound);
app.use(errorHandler.errorHandler);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
