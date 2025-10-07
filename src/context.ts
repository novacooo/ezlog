import { LogLevel } from './levels';
import { TimeFormat } from './formatters';

// ──────────────────────────────────────────── Context ────────────────────────────────────────────

export type LoggerContext = {
  minLevel: LogLevel;
  timeFormat: TimeFormat;
};

// ───────────────────────────────────────── Test helpers ──────────────────────────────────────────

export function createTestContext(overrides?: Partial<LoggerContext>): LoggerContext {
  return {
    minLevel: LogLevel.DEBUG,
    timeFormat: TimeFormat.HH,
    ...overrides,
  };
}
