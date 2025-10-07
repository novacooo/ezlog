import { type ObjectValues } from './utils';
import { LogLevel, normalize, NormalizeTarget } from './levels';

// ──────────────────────────────────────── Color utilities ────────────────────────────────────────

export function hasColorSupport(): boolean {
  return !!(typeof process !== 'undefined' && process.stdout?.isTTY && process.env.TERM !== 'dumb');
}

function rgb(r: number, g: number, b: number): string {
  return `\x1b[38;2;${r};${g};${b}m`;
}

// ──────────────────────────────────────────── Colors ─────────────────────────────────────────────

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

// ────────────────────────────────────────── Colorizing ───────────────────────────────────────────

export function colorize(text: string, color: Color): string {
  return hasColorSupport() ? `${color}${text}${Color.DEFAULT}` : text;
}

const colorMap: Record<LogLevel, Color> = {
  [LogLevel.DEBUG]: Color.CYAN,
  [LogLevel.INFO]: Color.LIGHT_GRAY,
  [LogLevel.WARN]: Color.ORANGE,
  [LogLevel.ERROR]: Color.RED,
  [LogLevel.FATAL]: Color.BRIGHT_RED,
} as const;

export function getColor(logLevel: LogLevel): Color {
  const normalized = normalize(logLevel, NormalizeTarget.NAME);
  return colorMap[normalized] ?? Color.DEFAULT;
}
