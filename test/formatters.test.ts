import { describe, it, expect } from 'vitest';
import { formatLog, TimeFormat } from '../src/formatters';
import { LogLevel } from '../src';

describe('formatLog', () => {
  it('should format log with default HH time format', () => {
    const result = formatLog(LogLevel.INFO, TimeFormat.HH, 'test message');

    expect(result).toContain('INFO');
    expect(result).toContain('test message');
    expect(result).toMatch(/\d{2}:\d{2}:\d{2}/); // HH:mm:ss pattern
  });

  it('should format log with HH_SSS time format', () => {
    const result = formatLog(LogLevel.INFO, TimeFormat.HH_SSS, 'test message');

    expect(result).toMatch(/\d{2}:\d{2}:\d{2}\.\d{3}/); // HH:mm:ss.SSS pattern
  });

  it('should format log with ISO time format', () => {
    const result = formatLog(LogLevel.INFO, TimeFormat.ISO, 'test message');

    expect(result).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/); // ISO pattern
  });

  it('should pad log level names to 5 characters', () => {
    const debugLog = formatLog(LogLevel.DEBUG, TimeFormat.HH, 'message');
    const infoLog = formatLog(LogLevel.INFO, TimeFormat.HH, 'message');
    const warnLog = formatLog(LogLevel.WARN, TimeFormat.HH, 'message');
    const errorLog = formatLog(LogLevel.ERROR, TimeFormat.HH, 'message');
    const fatalLog = formatLog(LogLevel.FATAL, TimeFormat.HH, 'message');

    expect(debugLog).toContain('DEBUG');
    expect(infoLog).toContain('INFO '); // padded
    expect(warnLog).toContain('WARN '); // padded
    expect(errorLog).toContain('ERROR');
    expect(fatalLog).toContain('FATAL');
  });

  it('should include all log components', () => {
    const result = formatLog(LogLevel.WARN, TimeFormat.HH, 'warning message');

    // Check for time brackets
    expect(result).toMatch(/\[.*\]/);
    // Check for level
    expect(result).toContain('WARN');
    // Check for message
    expect(result).toContain('warning message');
  });
});
