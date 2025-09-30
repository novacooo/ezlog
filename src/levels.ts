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

export type LogLevel = ObjectValues<typeof LogLevelName> | ObjectValues<typeof LogLevelNumber>;

type NameToNumberMap = Record<ObjectValues<typeof LogLevelName>, ObjectValues<typeof LogLevelNumber>>;
type NumberToNameMap = Record<ObjectValues<typeof LogLevelNumber>, ObjectValues<typeof LogLevelName>>;

const nameToNumberMap: NameToNumberMap = {
  [LogLevelName.DEBUG]: LogLevelNumber.DEBUG,
  [LogLevelName.INFO]: LogLevelNumber.INFO,
  [LogLevelName.WARN]: LogLevelNumber.WARN,
  [LogLevelName.ERROR]: LogLevelNumber.ERROR,
  [LogLevelName.FATAL]: LogLevelNumber.FATAL,
} as const;

const numberToNameMap: NumberToNameMap = {
  [LogLevelNumber.DEBUG]: LogLevelName.DEBUG,
  [LogLevelNumber.INFO]: LogLevelName.INFO,
  [LogLevelNumber.WARN]: LogLevelName.WARN,
  [LogLevelNumber.ERROR]: LogLevelName.ERROR,
  [LogLevelNumber.FATAL]: LogLevelName.FATAL,
} as const;

export const NormalizeTarget = {
  NUMBER: 'number',
  NAME: 'name',
} as const;

export type NormalizeTarget = ObjectValues<typeof NormalizeTarget>;

export function normalizeLogLevel(
  level: LogLevel,
  target: typeof NormalizeTarget.NUMBER,
): ObjectValues<typeof LogLevelNumber>;

export function normalizeLogLevel(
  level: LogLevel,
  target: typeof NormalizeTarget.NAME,
): ObjectValues<typeof LogLevelName>;

export function normalizeLogLevel(level: LogLevel, target: NormalizeTarget): LogLevel {
  if (target === NormalizeTarget.NUMBER) {
    if (typeof level === 'number') {
      const range = Object.values(LogLevelNumber);
      const min = Math.min(...range);
      const max = Math.max(...range);

      if (level < min || level > max) {
        throw new Error(`Invalid log level number: ${level}. Must be between ${min}-${max}.`);
      }

      return level;
    }

    const normalized = nameToNumberMap[level];

    if (normalized === undefined) {
      throw new Error(`Invalid log level: ${level}`);
    }

    return normalized;
  }

  if (target === NormalizeTarget.NAME) {
    if (typeof level === 'string') {
      if (!nameToNumberMap.hasOwnProperty(level)) {
        throw new Error(`Invalid log level name: ${level}`);
      }
      return level;
    }

    const normalized = numberToNameMap[level];

    if (normalized === undefined) {
      throw new Error(`Invalid log level number: ${level}. Must be between 0-4.`);
    }

    return normalized;
  }

  throw new Error(
    `Invalid normalization target: ${target}. Must be '${NormalizeTarget.NUMBER}' or '${NormalizeTarget.NUMBER}'.`,
  );
}

export function shouldLog(level: LogLevel, minLevel: LogLevel): boolean {
  return normalizeLogLevel(level, NormalizeTarget.NUMBER) >= normalizeLogLevel(minLevel, NormalizeTarget.NUMBER);
}
