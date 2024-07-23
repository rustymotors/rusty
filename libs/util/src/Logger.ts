import { pino } from "pino";

/**
 * @exports Logger
 * Logger
 * @description A simple logger with debug, info, warn, and error methods.
 */
interface Logger {
  debug: (msg: string) => void;
  info: (msg: string) => void;
  warn: (msg: string) => void;
  error: (msg: string) => void;
}

export const log: Logger = (function getLogger() {
  const self = pino({
    level: "debug",
  });
  return {
    debug: (msg: string) => self.debug(msg),
    info: (msg: string) => self.info(msg),
    warn: (msg: string) => self.warn(msg),
    error: (msg: string) => self.error(msg),
  };
})();
