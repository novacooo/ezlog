import { LogLevel, normalizeLogLevel, NormalizeTarget, shouldLog } from './levels';
import { formatLog, TimeFormat } from './formatters';
import type { LogMethod, LogParams } from './types';

const methodMap: Record<LogLevel, typeof console.log> = {
  [LogLevel.DEBUG]: console.debug,
  [LogLevel.INFO]: console.info,
  [LogLevel.WARN]: console.warn,
  [LogLevel.ERROR]: console.error,
  [LogLevel.FATAL]: console.error,
};

function getMethod(logLevel: LogLevel) {
  const normalized = normalizeLogLevel(logLevel, NormalizeTarget.NAME);
  return methodMap[normalized];
}

function log(level: LogLevel, minLevel: LogLevel, timeFormat: TimeFormat, ...args: LogParams): void {
  if (!shouldLog(level, minLevel)) return;

  const method = getMethod(level);
  const msg = formatLog(level, timeFormat, ...args);

  method(...msg);
}

export type Logger = {
  debug: LogMethod;
  info: LogMethod;
  warn: LogMethod;
  error: LogMethod;
  fatal: LogMethod;
};

export type LoggerOptions = {
  minLevel?: LogLevel;
  timeFormat?: TimeFormat;
};

export function createLogger(options: LoggerOptions = {}): Logger {
  const minLevel = options.minLevel ?? LogLevel.INFO;
  const timeFormat = options.timeFormat ?? TimeFormat.HH;

  return {
    debug: (...args) => log(LogLevel.DEBUG, minLevel, timeFormat, ...args),
    info: (...args) => log(LogLevel.INFO, minLevel, timeFormat, ...args),
    warn: (...args) => log(LogLevel.WARN, minLevel, timeFormat, ...args),
    error: (...args) => log(LogLevel.ERROR, minLevel, timeFormat, ...args),
    fatal: (...args) => log(LogLevel.FATAL, minLevel, timeFormat, ...args),
  };
}
