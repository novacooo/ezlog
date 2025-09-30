import type { ObjectValues } from './utils';

export const LogLevelName = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  FATAL: 'fatal',
} as const;

export const LogLevelNumber: Record<keyof typeof LogLevelName, number> = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4,
} as const;

type NameToNumberMap = Record<ObjectValues<typeof LogLevelName>, ObjectValues<typeof LogLevelNumber>>;

const nameToNumberMap: NameToNumberMap = {
  debug: LogLevelNumber.DEBUG,
  info: LogLevelNumber.INFO,
  warn: LogLevelNumber.WARN,
  error: LogLevelNumber.ERROR,
  fatal: LogLevelNumber.FATAL,
} as const;

export type LogLevel = ObjectValues<typeof LogLevelName> | ObjectValues<typeof LogLevelNumber>;

export function normalizeLogLevel(level: LogLevel): number {
  if (typeof level === 'number') {
    const range = Object.values(LogLevelNumber);
    if (level < Math.min(...range) || level > Math.max(...range)) {
      throw new Error(`Invalid log level number: ${level}. Must be between 0-4.`);
    }
    return level;
  }
  const normalized = nameToNumberMap[level];
  if (normalized === undefined) {
    throw new Error(`Invalid log level: ${level}`);
  }
  return normalized;
}

export function shouldLog(level: LogLevel, minLevel: LogLevel): boolean {
  return normalizeLogLevel(level) >= normalizeLogLevel(minLevel);
}
