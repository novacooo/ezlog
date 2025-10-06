import { type LogLevel, normalizeLogLevel, NormalizeTarget } from './levels';
import { colorizeText, getTextColor, TextColor } from './colors';
import type { ObjectValues } from './utils';

export const TimeFormat = {
  HH: 'HH:mm:ss',
  HH_SSS: 'HH:mm:ss.SSS',
  ISO: 'ISO',
} as const;

export type TimeFormat = ObjectValues<typeof TimeFormat>;

function formatTime(date: Date, format: TimeFormat = TimeFormat.HH): string {
  if (format === TimeFormat.HH) {
    return date.toTimeString().slice(0, 8);
  } else if (format === TimeFormat.HH_SSS) {
    return date.toTimeString().slice(0, 8) + '.' + date.getMilliseconds().toString().padStart(3, '0');
  } else if (format === TimeFormat.ISO) {
    return date.toISOString();
  } else {
    return date.toTimeString().slice(0, 8);
  }
}

export type LogEntry = {
  level: LogLevel;
  message: string;
};

export function formatLog(entry: LogEntry) {
  const time = formatTime(new Date(), TimeFormat.HH);
  const name = normalizeLogLevel(entry.level, NormalizeTarget.NAME).toUpperCase();
  const level = name.padEnd(5, ' ');
  const color = getTextColor(entry.level);

  const timeChunk = `${colorizeText('[', TextColor.LIGHT_GRAY)}${colorizeText(time, TextColor.GRAY)}${colorizeText(']', TextColor.LIGHT_GRAY)}`;
  const levelChunk = colorizeText(level, color);
  const dividerChunk = colorizeText('|', TextColor.GRAY);
  const messageChunk = colorizeText(entry.message, color);

  return [timeChunk, levelChunk, dividerChunk, messageChunk].join(' ');
}
