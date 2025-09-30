import type { LogLevelName } from './levels';
import type { ObjectValues } from './utils';

export const LogColor: Record<Uppercase<ObjectValues<typeof LogLevelName>> | 'RESET', string> = {
  DEBUG: '\x1b[36m', // Cyan
  INFO: '\x1b[34m', // Blue
  WARN: '\x1b[33m', // Yellow
  ERROR: '\x1b[31m', // Red
  FATAL: '\x1b[35m', // Magenta
  RESET: '\x1b[0m',
} as const;

export type LogColor = ObjectValues<typeof LogColor>;

export function hasColorSupport() {
  return !!(typeof process !== 'undefined' && process.stdout?.isTTY && process.env.TERM !== 'dumb');
}
