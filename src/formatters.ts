import { LogLevel, normalize, NormalizeTarget } from './levels';
import { Color, colorize, getColor } from './colors';
import type { ObjectValues } from './utils';
import type { LoggerState } from './state';

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

export function formatContext(context: Record<string, any>, color: Color): string[] {
  return Object.entries(context).map(([key, value]) => {
    const formattedValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    return colorize(`[${key}=${formattedValue}]`, color);
  });
}

// ────────────────────────────────────────── Formatters ───────────────────────────────────────────

export type FormatterFunction = (logLevel: LogLevel, state: LoggerState, ...args: any[]) => any[];

export const defaultFormatter: FormatterFunction = (logLevel, state, ...args) => {
  const time = formatTime(new Date(), state.timeFormat);
  const name = normalize(logLevel, NormalizeTarget.NAME).toUpperCase();
  const level = name.padEnd(5, ' ');
  const color = getColor(logLevel);

  const timeChunk = `${colorize('[', Color.LIGHT_GRAY)}${colorize(time, Color.GRAY)}${colorize(']', Color.LIGHT_GRAY)}`;
  const levelChunk = colorize(level, color);
  const contextChunks = formatContext(state.context, color);

  return [timeChunk, levelChunk, ...contextChunks, ...args];
};

export const jsonFormatter: FormatterFunction = (logLevel, state, ...args) => {
  const data = {
    timestamp: new Date().toISOString(),
    level: normalize(logLevel, NormalizeTarget.NAME),
    ...(Object.keys(state.context).length > 0 && { context: state.context }),
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

export const compactFormatter: FormatterFunction = (logLevel, state, ...args) => {
  const name = normalize(logLevel, NormalizeTarget.NAME).toUpperCase();
  const color = getColor(logLevel);
  const levelChunk = colorize(`[${name}]`, color);
  const contextChunks = formatContext(state.context, color);

  return [levelChunk, ...contextChunks, ...args];
};
