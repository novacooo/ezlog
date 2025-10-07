import { LogLevel, normalize, NormalizeTarget, shouldLog } from './levels';
import { formatLog, TimeFormat } from './formatters';

// ──────────────────────────────────────── Core utilities ─────────────────────────────────────────

const methodMap: Record<LogLevel, typeof console.log> = {
  [LogLevel.DEBUG]: console.debug,
  [LogLevel.INFO]: console.info,
  [LogLevel.WARN]: console.warn,
  [LogLevel.ERROR]: console.error,
  [LogLevel.FATAL]: console.error,
};

function getMethod(logLevel: LogLevel) {
  const normalized = normalize(logLevel, NormalizeTarget.NAME);
  return methodMap[normalized];
}

// ──────────────────────────────────────────── Logger ─────────────────────────────────────────────

function log(level: LogLevel, minLevel: LogLevel, timeFormat: TimeFormat, ...args: any[]): void {
  if (!shouldLog(level, minLevel)) return;

  const method = getMethod(level);
  const msg = formatLog(level, timeFormat, ...args);

  method(...msg);
}

export type Logger = {
  debug: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  fatal: (...args: any[]) => void;
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
