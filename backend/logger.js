const winston = require("winston");
const path = require("path");


const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});


const logger = winston.createLogger({
  level: "info", 
  format: winston.format.combine(
    winston.format.timestamp(),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }), 
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: path.join(__dirname, "logs", "app.log"),
      format: winston.format.combine(
        winston.format.uncolorize(), 
        winston.format.timestamp(),
        logFormat
      ),
    }),
    new winston.transports.File({
      filename: path.join(__dirname, "logs", "error.log"),
      level: "error", 
      format: winston.format.combine(
        winston.format.uncolorize(),
        winston.format.timestamp(),
        logFormat
      ),
    }),
  ],
});

module.exports = logger;
