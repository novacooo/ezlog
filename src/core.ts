import { type LogLevel, LogLevelName, normalizeLogLevel, NormalizeTarget, shouldLog } from './levels';
import { formatLog } from './formatters';

export interface LoggerOptions {
  minLevel?: LogLevel;
}

const methodMap = {
  [LogLevelName.DEBUG]: console.debug,
  [LogLevelName.INFO]: console.info,
  [LogLevelName.WARN]: console.warn,
  [LogLevelName.ERROR]: console.error,
  [LogLevelName.FATAL]: console.error,
} as const;

function getMethod(logLevel: LogLevel) {
  const normalized = normalizeLogLevel(logLevel, NormalizeTarget.NAME);
  return methodMap[normalized] ?? console.log;
}

export class Logger {
  private minLevel: LogLevel;

  constructor(options: LoggerOptions = {}) {
    this.minLevel = options.minLevel ?? 'info';
  }

  debug(message: string) {
    this.log('debug', message);
  }

  info(message: string) {
    this.log('info', message);
  }

  warn(message: string) {
    this.log('warn', message);
  }

  error(message: string) {
    this.log('error', message);
  }

  fatal(message: string) {
    this.log('fatal', message);
  }

  setMinLevel(level: LogLevel) {
    this.minLevel = level;
  }

  getMinLevel(): LogLevel {
    return this.minLevel;
  }

  private log(level: LogLevel, message: string): void {
    if (!shouldLog(level, this.minLevel)) return;

    const msg = formatLog({ level, message });
    const method = getMethod(level);

    method(msg);
  }
}

export function createLogger(options: LoggerOptions = {}): Logger {
  return new Logger(options);
}
