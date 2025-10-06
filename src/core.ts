import { LogLevel, normalizeLogLevel, NormalizeTarget, shouldLog } from './levels';
import { formatLog, TimeFormat } from './formatters';

export type LoggerOptions = {
  minLevel?: LogLevel;
  timeFormat?: TimeFormat;
};

export type Logger = {
  debug: (message: string) => void;
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
  fatal: (message: string) => void;
};

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

function log(level: LogLevel, minLevel: LogLevel, timeFormat: TimeFormat, message: string): void {
  if (!shouldLog(level, minLevel)) return;

  const msg = formatLog(level, timeFormat, message);
  const method = getMethod(level);

  method(msg);
}

export function createLogger(options: LoggerOptions = {}): Logger {
  const minLevel = options.minLevel ?? LogLevel.INFO;
  const timeFormat = options.timeFormat ?? TimeFormat.HH;

  return {
    debug: (message: string) => log(LogLevel.DEBUG, minLevel, timeFormat, message),
    info: (message: string) => log(LogLevel.INFO, minLevel, timeFormat, message),
    warn: (message: string) => log(LogLevel.WARN, minLevel, timeFormat, message),
    error: (message: string) => log(LogLevel.ERROR, minLevel, timeFormat, message),
    fatal: (message: string) => log(LogLevel.FATAL, minLevel, timeFormat, message),
  };
}
