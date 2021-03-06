import { addColors, createLogger, format, Logger, transports } from "winston";
import winston from "winston/lib/winston/config";

addColors({
  error: "red",
  warn: "yellow",
  info: "cyan",
  debug: "green",
});

export default (service: string): Logger => {
  return createLogger({
    level: "info",
    format: format.combine(
      format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.json()
    ),
    defaultMeta: { service: service },
    transports: [
      //
      // - Write to all logs with level `info` and below to `quick-start-combined.log`.
      // - Write all logs error (and below) to `quick-start-error.log`.
      //
      new transports.Console({
        format: format.combine(format.colorize(), format.simple()),
      }),
      // new transports.File({ filename: 'quick-start-error.log', level: 'error' }),
      // new transports.File({ filename: 'quick-start-combined.log' })
    ],
  });
};
