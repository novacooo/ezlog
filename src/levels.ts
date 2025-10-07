import type { ObjectValues } from './utils';

// ──────────────────────────────────────────── Levels ─────────────────────────────────────────────

export const LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  FATAL: 'fatal',
} as const;

export type LogLevel = ObjectValues<typeof LogLevel>;

// ────────────────────────────────────────── Normalizing ──────────────────────────────────────────

export const NormalizeTarget = {
  NUMBER: 'number',
  NAME: 'name',
} as const;

export type NormalizeTarget = ObjectValues<typeof NormalizeTarget>;

const levelToNumber: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
  [LogLevel.FATAL]: 4,
} as const;

const numberToLevel: Record<number, LogLevel> = {
  0: LogLevel.DEBUG,
  1: LogLevel.INFO,
  2: LogLevel.WARN,
  3: LogLevel.ERROR,
  4: LogLevel.FATAL,
} as const;

const MIN_LEVEL = 0;
const MAX_LEVEL = 4;

function validateLevelNumber(level: number): void {
  if (level >= MIN_LEVEL && level <= MAX_LEVEL) return;
  throw new Error(`Invalid log level number: ${level}. Must be between ${MIN_LEVEL}-${MAX_LEVEL}.`);
}

function validateLevelName(level: string): asserts level is LogLevel {
  if (level in levelToNumber) return;
  throw new Error(`Invalid log level name: ${level}`);
}

function validateLevel(level: string | number) {
  return typeof level === 'number' ? validateLevelNumber(level) : validateLevelName(level);
}

export function normalize(level: LogLevel | number, target: typeof NormalizeTarget.NUMBER): number;
export function normalize(level: LogLevel | number, target: typeof NormalizeTarget.NAME): LogLevel;
export function normalize(level: LogLevel | number, target: NormalizeTarget): LogLevel | number {
  validateLevel(level);

  if (target === NormalizeTarget.NUMBER) {
    return typeof level === 'number' ? level : levelToNumber[level];
  }

  if (target === NormalizeTarget.NAME) {
    return typeof level === 'string' ? level : numberToLevel[level];
  }

  throw new Error(
    `Invalid normalization target: ${target}. Must be '${NormalizeTarget.NAME}' or '${NormalizeTarget.NUMBER}'.`,
  );
}

// ──────────────────────────────────────── Level utilities ────────────────────────────────────────

export function shouldLog(level: LogLevel | number, minLevel: LogLevel | number): boolean {
  return normalize(level, NormalizeTarget.NUMBER) >= normalize(minLevel, NormalizeTarget.NUMBER);
}
