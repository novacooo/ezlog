import { type LogLevel, LogLevelName, normalizeLogLevel, NormalizeTarget, shouldLog } from './levels';
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
  setMinLevel: (level: LogLevel) => void;
  getMinLevel: () => LogLevel;
};

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

function log(level: LogLevel, message: string, minLevel: LogLevel): void {
  if (!shouldLog(level, minLevel)) return;

  const msg = formatLog({ level, message });
  const method = getMethod(level);

  method(msg);
}

export function createLogger(options: LoggerOptions = {}): Logger {
  let minLevel: LogLevel = options.minLevel ?? 'info';

  return {
    debug: (message: string) => log('debug', message, minLevel),
    info: (message: string) => log('info', message, minLevel),
    warn: (message: string) => log('warn', message, minLevel),
    error: (message: string) => log('error', message, minLevel),
    fatal: (message: string) => log('fatal', message, minLevel),
    setMinLevel: (level: LogLevel) => {
      minLevel = level;
    },
    getMinLevel: () => minLevel,
  };
}
