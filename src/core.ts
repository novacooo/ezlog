import { LogLevel, normalizeLogLevel, NormalizeTarget, shouldLog } from './levels';
import { formatLog } from './formatters';

export type LoggerOptions = {
  minLevel?: LogLevel;
};

export type Logger = {
  debug: (message: string) => void;
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
  fatal: (message: string) => void;
};

const methodMap = {
  [LogLevel.DEBUG]: console.debug,
  [LogLevel.INFO]: console.info,
  [LogLevel.WARN]: console.warn,
  [LogLevel.ERROR]: console.error,
  [LogLevel.FATAL]: console.error,
} as const;

function getMethod(logLevel: LogLevel) {
  const normalized = normalizeLogLevel(logLevel, NormalizeTarget.NAME);
  return methodMap[normalized] ?? console.log;
}

function log(level: LogLevel, message: string, minLevel: LogLevel): void {
  if (!shouldLog(level, minLevel)) return;

  const msg = formatLog({ level, message });
  const method = getMethod(level);

  method(msg);
}

export function createLogger(options: LoggerOptions = {}): Logger {
  let minLevel = options.minLevel ?? LogLevel.INFO;

  return {
    debug: (message: string) => log(LogLevel.DEBUG, message, minLevel),
    info: (message: string) => log(LogLevel.INFO, message, minLevel),
    warn: (message: string) => log(LogLevel.WARN, message, minLevel),
    error: (message: string) => log(LogLevel.ERROR, message, minLevel),
    fatal: (message: string) => log(LogLevel.FATAL, message, minLevel),
  };
}
