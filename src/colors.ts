import { type ObjectValues } from './utils';
import { type LogLevel, LogLevelName, normalizeLogLevel, NormalizeTarget } from './levels';

function rgb(r: number, g: number, b: number) {
  return `\x1b[38;2;${r};${g};${b}m`;
}

export const Color = {
  CYAN: rgb(120, 203, 227),
  LIGHT_GRAY: rgb(200, 200, 200),
  GRAY: rgb(144, 144, 144),
  ORANGE: rgb(255, 140, 67),
  RED: rgb(246, 83, 83),
  BRIGHT_RED: rgb(210, 0, 0),
  DEFAULT: '\x1b[0m',
} as const;

export type Color = ObjectValues<typeof Color>;

export function hasColorSupport() {
  return !!(typeof process !== 'undefined' && process.stdout?.isTTY && process.env.TERM !== 'dumb');
}

export function colorize(text: string, color: Color) {
  return hasColorSupport() ? `${color}${text}${Color.DEFAULT}` : text;
}

const logLevelColorMap = {
  [LogLevelName.DEBUG]: Color.CYAN,
  [LogLevelName.INFO]: Color.LIGHT_GRAY,
  [LogLevelName.WARN]: Color.ORANGE,
  [LogLevelName.ERROR]: Color.RED,
  [LogLevelName.FATAL]: Color.BRIGHT_RED,
} as const;

export function getLogLevelColor(logLevel: LogLevel) {
  const normalized = normalizeLogLevel(logLevel, NormalizeTarget.NAME);

  return logLevelColorMap[normalized] ?? Color.DEFAULT;
}
