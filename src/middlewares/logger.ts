import morgan from "morgan";
import { StreamOptions } from "morgan";
import winston from "winston";

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "combined.log" }),
    ],
});

if (process.env.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    );
}

const stream: StreamOptions = {
    write: (message) => logger.info(message.trim()),
};

export const morganMiddleware = morgan(
    ":remote-addr - :method :url :status :res[content-length] - :response-time ms",
    { stream }
);

export default logger;
