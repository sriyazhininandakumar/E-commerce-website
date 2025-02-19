const winston = require("winston");
const path = require("path");
const fs = require("fs");


const logDir = path.join(__dirname, "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = winston.createLogger({
  level: "debug", 
  format: winston.format.combine(
    winston.format.timestamp(),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      level: "debug", 
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: path.join(logDir, "app.log"),
      level: "debug", 
      format: winston.format.combine(
        winston.format.uncolorize(),
        winston.format.timestamp(),
        logFormat
      ),
    }),
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error", 
      format: winston.format.combine(
        winston.format.uncolorize(),
        winston.format.timestamp(),
        logFormat
      ),
    }),
    new winston.transports.File({
      filename: path.join(logDir, "debug.log"),
      level: "debug", 
      format: winston.format.combine(
        winston.format.uncolorize(),
        winston.format.timestamp(),
        logFormat
      ),
    }),
  ],
});

module.exports = logger;
