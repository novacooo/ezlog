import { LogLevel } from './levels';
import { TimeFormat, defaultFormatter, type FormatterFunction } from './formatters';

// ──────────────────────────────────────────── Context ────────────────────────────────────────────

export type LoggerContext = {
  minLevel: LogLevel;
  timeFormat: TimeFormat;
  formatter: FormatterFunction;
};

// ───────────────────────────────────────── Test helpers ──────────────────────────────────────────

export function createTestContext(overrides?: Partial<LoggerContext>): LoggerContext {
  return {
    minLevel: LogLevel.DEBUG,
    timeFormat: TimeFormat.HH,
    formatter: defaultFormatter,
    ...overrides,
  };
}
