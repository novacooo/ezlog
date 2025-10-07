import { describe, expect, it } from 'vitest';
import { formatLog, TimeFormat } from '../src/formatters';
import { LogLevel } from '../src';

describe('formatLog', () => {
  it('should return an array with time, level, and message', () => {
    const result = formatLog(LogLevel.INFO, TimeFormat.HH, 'test message');

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(3);
    expect(result[0]).toMatch(/\[\d{2}:\d{2}:\d{2}\]/); // time chunk with brackets
    expect(result[1]).toContain('INFO');
    expect(result[2]).toBe('test message');
  });

  it('should format time with HH_SSS format', () => {
    const result = formatLog(LogLevel.INFO, TimeFormat.HH_SSS, 'test');

    expect(result[0]).toMatch(/\[\d{2}:\d{2}:\d{2}\.\d{3}\]/); // HH:mm:ss.SSS pattern
  });

  it('should format time with ISO format', () => {
    const result = formatLog(LogLevel.INFO, TimeFormat.ISO, 'test');

    expect(result[0]).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/); // ISO pattern
  });

  it('should pad log level names to 5 characters', () => {
    const debugLog = formatLog(LogLevel.DEBUG, TimeFormat.HH, 'message');
    const infoLog = formatLog(LogLevel.INFO, TimeFormat.HH, 'message');
    const warnLog = formatLog(LogLevel.WARN, TimeFormat.HH, 'message');
    const errorLog = formatLog(LogLevel.ERROR, TimeFormat.HH, 'message');
    const fatalLog = formatLog(LogLevel.FATAL, TimeFormat.HH, 'message');

    expect(debugLog[1]).toContain('DEBUG');
    expect(infoLog[1]).toContain('INFO '); // padded with space
    expect(warnLog[1]).toContain('WARN '); // padded with space
    expect(errorLog[1]).toContain('ERROR');
    expect(fatalLog[1]).toContain('FATAL');
  });

  it('should handle multiple arguments', () => {
    const result = formatLog(LogLevel.WARN, TimeFormat.HH, 'message', { foo: 'bar' }, 123);

    expect(result).toHaveLength(5);
    expect(result[0]).toMatch(/\[.*\]/); // time chunk
    expect(result[1]).toContain('WARN'); // level chunk
    expect(result[2]).toBe('message');
    expect(result[3]).toEqual({ foo: 'bar' });
    expect(result[4]).toBe(123);
  });
});
