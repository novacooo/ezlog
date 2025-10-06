import type { ObjectValues } from './utils';

export const LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  FATAL: 'fatal',
} as const;

export type LogLevel = ObjectValues<typeof LogLevel>;

const levelMap: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
  [LogLevel.FATAL]: 4,
} as const;

export const NormalizeTarget = {
  NUMBER: 'number',
  NAME: 'name',
} as const;

export type NormalizeTarget = ObjectValues<typeof NormalizeTarget>;

export function normalizeLogLevel(level: LogLevel | number, target: typeof NormalizeTarget.NUMBER): number;
export function normalizeLogLevel(level: LogLevel | number, target: typeof NormalizeTarget.NAME): LogLevel;
export function normalizeLogLevel(level: LogLevel | number, target: NormalizeTarget): LogLevel | number {
  switch (target) {
    case NormalizeTarget.NUMBER:
      if (typeof level === 'number') {
        const range = Object.values(levelMap);
        const min = Math.min(...range);
        const max = Math.max(...range);

        if (level < min || level > max) {
          throw new Error(`Invalid log level number: ${level}. Must be between ${min}-${max}.`);
        }

        return level;
      }

      const number = levelMap[level];
      if (number === undefined) {
        throw new Error(`Invalid log level: ${level}`);
      }

      return number;
    case NormalizeTarget.NAME:
      if (typeof level === 'string') {
        if (!levelMap.hasOwnProperty(level)) {
          throw new Error(`Invalid log level name: ${level}`);
        }

        return level;
      }

      const inverseMap: Record<string, LogLevel> = Object.fromEntries(
        Object.entries(levelMap).map(([name, number]) => [number, name as LogLevel]),
      );
      const normalized = inverseMap[level];

      if (normalized === undefined) {
        const range = Object.values(levelMap);
        const min = Math.min(...range);
        const max = Math.max(...range);

        throw new Error(`Invalid log level number: ${level}. Must be between ${min}-${max}.`);
      }

      return normalized;
    default:
      throw new Error(
        `Invalid normalization target: ${target}. Must be '${NormalizeTarget.NAME}' or '${NormalizeTarget.NUMBER}'.`,
      );
  }
}

export function shouldLog(level: LogLevel | number, minLevel: LogLevel | number): boolean {
  return normalizeLogLevel(level, NormalizeTarget.NUMBER) >= normalizeLogLevel(minLevel, NormalizeTarget.NUMBER);
}
