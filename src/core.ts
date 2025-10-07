import { LogLevel, normalize, NormalizeTarget, shouldLog } from './levels';
import { TimeFormat, defaultFormatter, type FormatterFunction } from './formatters';
import type { LoggerContext } from './context';

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

function log(level: LogLevel, ctx: LoggerContext, ...args: any[]): void {
  if (!shouldLog(level, ctx.minLevel)) return;

  const method = getMethod(level);
  const msg = ctx.formatter(level, ctx, ...args);

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
  minLevel?: LogLevel | number;
  timeFormat?: TimeFormat;
  formatter?: FormatterFunction;
};

export function createLogger(options: LoggerOptions = {}): Logger {
  const ctx: LoggerContext = {
    minLevel: options.minLevel ? normalize(options.minLevel, NormalizeTarget.NAME) : LogLevel.INFO,
    timeFormat: options.timeFormat ?? TimeFormat.HH,
    formatter: options.formatter ?? defaultFormatter,
  };

  return {
    debug: (...args) => log(LogLevel.DEBUG, ctx, ...args),
    info: (...args) => log(LogLevel.INFO, ctx, ...args),
    warn: (...args) => log(LogLevel.WARN, ctx, ...args),
    error: (...args) => log(LogLevel.ERROR, ctx, ...args),
    fatal: (...args) => log(LogLevel.FATAL, ctx, ...args),
  };
}
