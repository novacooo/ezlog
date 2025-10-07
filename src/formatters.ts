import { LogLevel, normalize, NormalizeTarget } from './levels';
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

export type FormatterFunction = (logLevel: LogLevel, ctx: LoggerContext, ...args: any[]) => any[];

export const defaultFormatter: FormatterFunction = (logLevel, ctx, ...args) => {
  const time = formatTime(new Date(), ctx.timeFormat);
  const name = normalize(logLevel, NormalizeTarget.NAME).toUpperCase();
  const level = name.padEnd(5, ' ');
  const color = getColor(logLevel);

  const timeChunk = `${colorize('[', Color.LIGHT_GRAY)}${colorize(time, Color.GRAY)}${colorize(']', Color.LIGHT_GRAY)}`;
  const levelChunk = colorize(level, color);

  return [timeChunk, levelChunk, ...args];
};

export const jsonFormatter: FormatterFunction = (logLevel, ctx, ...args) => {
  const data = {
    timestamp: new Date().toISOString(),
    level: normalize(logLevel, NormalizeTarget.NAME),
    message: args
      .map((arg) => {
        if (typeof arg === 'object') {
          return JSON.stringify(arg);
        }
        return String(arg);
      })
      .join(' '),
  };

  return [JSON.stringify(data)];
};

export const compactFormatter: FormatterFunction = (logLevel, ctx, ...args) => {
  const name = normalize(logLevel, NormalizeTarget.NAME).toUpperCase();
  const color = getColor(logLevel);
  const levelChunk = colorize(`[${name}]`, color);

  return [levelChunk, ...args];
};

export const emojiFormatter: FormatterFunction = (level, ctx, ...args) => {
  const emojiMap = {
    [LogLevel.DEBUG]: '🐛',
    [LogLevel.INFO]: 'ℹ️',
    [LogLevel.WARN]: '⚠️',
    [LogLevel.ERROR]: '❌ ',
    [LogLevel.FATAL]: '💀',
  };

  return [emojiMap[level] ?? '?', ...args];
};

// Backward compatibility
export function formatLog(logLevel: LogLevel, ctx: LoggerContext, ...args: any[]): any[] {
  return ctx.formatter(logLevel, ctx, ...args);
}
