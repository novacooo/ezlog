import { LogLevel } from './levels';
import { TimeFormat } from './formatters';

// ────────────────────────────────────────────── State ────────────────────────────────────────────

export type LoggerState = {
  minLevel: LogLevel;
  timeFormat: TimeFormat;
  context: Record<string, any>;
};

// ───────────────────────────────────────── Test helpers ──────────────────────────────────────────

export function createTestState(overrides?: Partial<LoggerState>): LoggerState {
  return {
    minLevel: LogLevel.DEBUG,
    timeFormat: TimeFormat.HH,
    context: {},
    ...overrides,
  };
}
