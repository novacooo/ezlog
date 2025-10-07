import { type LogLevel, normalize, NormalizeTarget } from './levels';
import { Color, colorize, getColor } from './colors';
import type { ObjectValues } from './utils';
import type { LoggerContext } from './context';

// ───────────────────────────────────────── Time formats ──────────────────────────────────────────

export const TimeFormat = {
  HH: 'HH:mm:ss',
  HH_SSS: 'HH:mm:ss.SSS',
  ISO: 'ISO',
} as const;

export type TimeFormat = ObjectValues<typeof TimeFormat>;

// ─────────────────────────────────────── Format utilities ────────────────────────────────────────

export function formatTime(date: Date, format: TimeFormat = TimeFormat.HH): string {
  if (format === TimeFormat.HH) {
    return date.toTimeString().slice(0, 8);
  }

  if (format === TimeFormat.HH_SSS) {
    return date.toTimeString().slice(0, 8) + '.' + date.getMilliseconds().toString().padStart(3, '0');
  }

  if (format === TimeFormat.ISO) {
    return date.toISOString();
  }

  return date.toTimeString().slice(0, 8);
}

// ────────────────────────────────────────── Formatters ───────────────────────────────────────────

export function formatLog(logLevel: LogLevel, ctx: LoggerContext, ...args: any[]): any[] {
  const time = formatTime(new Date(), ctx.timeFormat);
  const name = normalize(logLevel, NormalizeTarget.NAME).toUpperCase();
  const level = name.padEnd(5, ' ');
  const color = getColor(logLevel);

  const timeChunk = `${colorize('[', Color.LIGHT_GRAY)}${colorize(time, Color.GRAY)}${colorize(']', Color.LIGHT_GRAY)}`;
  const levelChunk = colorize(level, color);

  return [timeChunk, levelChunk, ...args];
}
