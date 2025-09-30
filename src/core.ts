import { type LogLevel, shouldLog } from './levels';
import { defaultFormatter, formatLog, type FormatterOptions, type LogEntry } from './formatters';

export type LoggerOutput = 'console' | 'file' | 'custom';

export interface LoggerOptions {
  minLevel?: LogLevel;
  formatter?: (entry: LogEntry) => string;
  formatterOptions?: FormatterOptions;
  output?: LoggerOutput;
  outputTarget?: string | ((message: string) => void);
}

export class Logger {
  private minLevel: LogLevel;
  private formatter: (entry: LogEntry) => string;
  private formatterOptions: FormatterOptions;
  private output: LoggerOutput;
  private outputTarget?: string | ((message: string) => void);

  constructor(options: LoggerOptions = {}) {
    this.minLevel = options.minLevel ?? 'info';
    this.formatter = options.formatter ?? defaultFormatter;
    this.formatterOptions = options.formatterOptions ?? {};
    this.output = options.output ?? 'console';
    this.outputTarget = options.outputTarget;
  }

  private log(level: LogLevel, message: string): void {
    if (!shouldLog(level, this.minLevel)) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
    };

    const formattedMessage =
      this.formatter === defaultFormatter ? formatLog(entry, this.formatterOptions) : this.formatter(entry);

    this.writeOutput(formattedMessage);
  }

  private writeOutput(message: string): void {
    switch (this.output) {
      case 'console':
        console.log(message);
        break;
      case 'custom':
        if (typeof this.outputTarget === 'function') {
          this.outputTarget(message);
        } else {
          throw new Error('Custom output requires a function as outputTarget');
        }
        break;
      case 'file':
        if (typeof this.outputTarget === 'string') {
          // For Node.js environments - would need fs import
          throw new Error('File output not implemented yet - requires fs module');
        } else {
          throw new Error('File output requires a string path as outputTarget');
        }
        break;
      default:
        console.log(message);
    }
  }

  debug(message: string): void {
    this.log('debug', message);
  }

  info(message: string): void {
    this.log('info', message);
  }

  warn(message: string): void {
    this.log('warn', message);
  }

  error(message: string): void {
    this.log('error', message);
  }

  fatal(message: string): void {
    this.log('fatal', message);
  }

  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  getMinLevel(): LogLevel {
    return this.minLevel;
  }

  setFormatter(formatter: (entry: LogEntry) => string): void {
    this.formatter = formatter;
  }

  setFormatterOptions(options: FormatterOptions): void {
    this.formatterOptions = { ...this.formatterOptions, ...options };
  }
}

export function createLogger(options: LoggerOptions = {}): Logger {
  return new Logger(options);
}

export const defaultLogger = new Logger();
