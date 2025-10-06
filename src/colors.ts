import { type ObjectValues } from './utils';
import { LogLevel, normalizeLogLevel, NormalizeTarget } from './levels';

function rgbToTextColor(r: number, g: number, b: number) {
  return `\x1b[38;2;${r};${g};${b}m`;
}

export const TextColor = {
  CYAN: rgbToTextColor(120, 203, 227),
  LIGHT_GRAY: rgbToTextColor(200, 200, 200),
  GRAY: rgbToTextColor(144, 144, 144),
  ORANGE: rgbToTextColor(255, 140, 67),
  RED: rgbToTextColor(246, 83, 83),
  BRIGHT_RED: rgbToTextColor(210, 0, 0),
  DEFAULT: '\x1b[0m',
} as const;

export type TextColor = ObjectValues<typeof TextColor>;

export function hasColorSupport() {
  return !!(typeof process !== 'undefined' && process.stdout?.isTTY && process.env.TERM !== 'dumb');
}

export function colorizeText(text: string, color: TextColor) {
  return hasColorSupport() ? `${color}${text}${TextColor.DEFAULT}` : text;
}

const textColorMap = {
  [LogLevel.DEBUG]: TextColor.CYAN,
  [LogLevel.INFO]: TextColor.LIGHT_GRAY,
  [LogLevel.WARN]: TextColor.ORANGE,
  [LogLevel.ERROR]: TextColor.RED,
  [LogLevel.FATAL]: TextColor.BRIGHT_RED,
} as const;

export function getTextColor(logLevel: LogLevel) {
  const normalized = normalizeLogLevel(logLevel, NormalizeTarget.NAME);

  return textColorMap[normalized] ?? TextColor.DEFAULT;
}
