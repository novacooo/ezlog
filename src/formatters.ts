import { type LogLevel, LogLevelName, normalizeLogLevel, NormalizeTarget } from './levels';
import { hasColorSupport, LogColor } from './colors';
import type { ObjectValues } from './utils';

export type LogEntry = {
  level: LogLevel;
  message: string;
  timestamp?: Date;
};

export const TimeFormat = {
  HH: 'HH:mm:ss',
  HH_SSS: 'HH:mm:ss.SSS',
  ISO: 'ISO',
} as const;

export type TimeFormat = ObjectValues<typeof TimeFormat>;

export type FormatterOptions = {
  useColors?: boolean;
  timeFormat?: TimeFormat;
};

function formatTime(date: Date, format: TimeFormat = TimeFormat.HH): string {
  switch (format) {
    case TimeFormat.HH:
      return date.toTimeString().slice(0, 8);
    case TimeFormat.HH_SSS:
      return date.toTimeString().slice(0, 8) + '.' + date.getMilliseconds().toString().padStart(3, '0');
    case TimeFormat.ISO:
      return date.toISOString();
    default:
      return date.toTimeString().slice(0, 8);
  }
}

function colorize(text: string, logLevel: LogLevel, useColors: boolean): string {
  if (!useColors) {
    return text;
  }

  const levelName = normalizeLogLevel(logLevel, NormalizeTarget.NAME);
  const upperCase = levelName.toUpperCase() as Uppercase<ObjectValues<typeof LogLevelName>>;
  const color = LogColor[upperCase];
  const reset = LogColor.RESET;

  return `${color}${text}${reset}`;
}

export function formatLog(entry: LogEntry, options: FormatterOptions = {}): string {
  const { useColors = hasColorSupport(), timeFormat = TimeFormat.HH } = options;

  const timestamp = entry.timestamp || new Date();
  const timeString = formatTime(timestamp, timeFormat);
  const levelName = normalizeLogLevel(entry.level, NormalizeTarget.NAME);
  const levelPadded = levelName.padEnd(5, ' ');

  const coloredLevel = colorize(levelPadded, levelName, useColors);

  return `[${timeString}] ${coloredLevel} ${entry.message}`;
}

export function defaultFormatter(entry: LogEntry): string {
  return formatLog(entry);
}
