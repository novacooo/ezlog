import { LogLevel, normalize, NormalizeTarget, shouldLog } from './levels';
import { defaultFormatter, type FormatterFunction, TimeFormat } from './formatters';
import type { LoggerState } from './state';

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

function log(level: LogLevel, state: LoggerState, formatter: FormatterFunction, ...args: any[]): void {
  if (!shouldLog(level, state.minLevel)) return;

  const method = getMethod(level);
  const msg = formatter(level, state, ...args);

  method(...msg);
}

export type Logger = {
  debug: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  fatal: (...args: any[]) => void;
  child: (context: Record<string, any>) => Logger;
};

export type LoggerOptions = {
  minLevel?: LogLevel | number;
  timeFormat?: TimeFormat;
  formatter?: FormatterFunction;
  context?: Record<string, any>;
};

export function createLogger(options: LoggerOptions = {}): Logger {
  const formatter = options.formatter ?? defaultFormatter;
  const state: LoggerState = {
    minLevel: options.minLevel ? normalize(options.minLevel, NormalizeTarget.NAME) : LogLevel.INFO,
    timeFormat: options.timeFormat ?? TimeFormat.HH,
    context: options.context ?? {},
  };

  return {
    debug: (...args) => log(LogLevel.DEBUG, state, formatter, ...args),
    info: (...args) => log(LogLevel.INFO, state, formatter, ...args),
    warn: (...args) => log(LogLevel.WARN, state, formatter, ...args),
    error: (...args) => log(LogLevel.ERROR, state, formatter, ...args),
    fatal: (...args) => log(LogLevel.FATAL, state, formatter, ...args),
    child: (childContext) => {
      return createLogger({
        minLevel: state.minLevel,
        timeFormat: state.timeFormat,
        formatter: formatter,
        context: { ...state.context, ...childContext },
      });
    },
  };
}
