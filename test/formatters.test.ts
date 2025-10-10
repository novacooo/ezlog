import { describe, expect, it } from 'vitest';
import { defaultFormatter, jsonFormatter, compactFormatter, TimeFormat } from '../src/formatters';
import { LogLevel } from '../src';
import { createTestContext } from '../src/context';

describe('defaultFormatter', () => {
  it('should return an array with time, level, and message', () => {
    const ctx = createTestContext({ timeFormat: TimeFormat.HH });
    const result = defaultFormatter(LogLevel.INFO, ctx, 'test message');

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(3);
    expect(result[0]).toMatch(/\[\d{2}:\d{2}:\d{2}\]/); // time chunk with brackets
    expect(result[1]).toContain('INFO');
    expect(result[2]).toBe('test message');
  });

  it('should format time with HH_SSS format', () => {
    const ctx = createTestContext({ timeFormat: TimeFormat.HH_SSS });
    const result = defaultFormatter(LogLevel.INFO, ctx, 'test');

    expect(result[0]).toMatch(/\[\d{2}:\d{2}:\d{2}\.\d{3}\]/); // HH:mm:ss.SSS pattern
  });

  it('should format time with ISO format', () => {
    const ctx = createTestContext({ timeFormat: TimeFormat.ISO });
    const result = defaultFormatter(LogLevel.INFO, ctx, 'test');

    expect(result[0]).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/); // ISO pattern
  });

  it('should pad log level names to 5 characters', () => {
    const ctx = createTestContext();
    const debugLog = defaultFormatter(LogLevel.DEBUG, ctx, 'message');
    const infoLog = defaultFormatter(LogLevel.INFO, ctx, 'message');
    const warnLog = defaultFormatter(LogLevel.WARN, ctx, 'message');
    const errorLog = defaultFormatter(LogLevel.ERROR, ctx, 'message');
    const fatalLog = defaultFormatter(LogLevel.FATAL, ctx, 'message');

    expect(debugLog[1]).toContain('DEBUG');
    expect(infoLog[1]).toContain('INFO '); // padded with space
    expect(warnLog[1]).toContain('WARN '); // padded with space
    expect(errorLog[1]).toContain('ERROR');
    expect(fatalLog[1]).toContain('FATAL');
  });

  it('should handle multiple arguments', () => {
    const ctx = createTestContext();
    const result = defaultFormatter(LogLevel.WARN, ctx, 'message', { foo: 'bar' }, 123);

    expect(result).toHaveLength(5);
    expect(result[0]).toMatch(/\[.*\]/); // time chunk
    expect(result[1]).toContain('WARN'); // level chunk
    expect(result[2]).toBe('message');
    expect(result[3]).toEqual({ foo: 'bar' });
    expect(result[4]).toBe(123);
  });
});

describe('jsonFormatter', () => {
  it('should produce valid JSON output', () => {
    const ctx = createTestContext();
    const result = jsonFormatter(LogLevel.INFO, ctx, 'test', 'message');

    expect(result).toHaveLength(1);
    expect(() => JSON.parse(result[0])).not.toThrow();

    const parsed = JSON.parse(result[0]);
    expect(parsed).toHaveProperty('timestamp');
    expect(parsed).toHaveProperty('level', 'info');
    expect(parsed).toHaveProperty('message', 'test message');
  });

  it('should stringify objects in message', () => {
    const ctx = createTestContext();
    const result = jsonFormatter(LogLevel.INFO, ctx, 'User:', { id: 123 });

    const parsed = JSON.parse(result[0]);
    expect(parsed.message).toContain('User:');
    expect(parsed.message).toContain('"id":123');
  });

  it('should handle all log levels', () => {
    const ctx = createTestContext();

    const debugLog = jsonFormatter(LogLevel.DEBUG, ctx, 'debug message');
    expect(JSON.parse(debugLog[0]).level).toBe('debug');

    const infoLog = jsonFormatter(LogLevel.INFO, ctx, 'info message');
    expect(JSON.parse(infoLog[0]).level).toBe('info');

    const warnLog = jsonFormatter(LogLevel.WARN, ctx, 'warn message');
    expect(JSON.parse(warnLog[0]).level).toBe('warn');

    const errorLog = jsonFormatter(LogLevel.ERROR, ctx, 'error message');
    expect(JSON.parse(errorLog[0]).level).toBe('error');

    const fatalLog = jsonFormatter(LogLevel.FATAL, ctx, 'fatal message');
    expect(JSON.parse(fatalLog[0]).level).toBe('fatal');
  });

  it('should handle multiple mixed arguments', () => {
    const ctx = createTestContext();
    const result = jsonFormatter(LogLevel.ERROR, ctx, 'Error:', 404, { url: '/api' });

    const parsed = JSON.parse(result[0]);
    expect(parsed.message).toContain('Error:');
    expect(parsed.message).toContain('404');
    expect(parsed.message).toContain('{"url":"/api"}');
  });
});

describe('compactFormatter', () => {
  it('should include level and message', () => {
    const ctx = createTestContext();
    const result = compactFormatter(LogLevel.WARN, ctx, 'test', 'message');

    expect(result.length).toBeGreaterThanOrEqual(2);
    expect(result[0]).toContain('WARN');
    expect(result[1]).toBe('test');
    expect(result[2]).toBe('message');
  });

  it('should format all log levels correctly', () => {
    const ctx = createTestContext();

    const debugLog = compactFormatter(LogLevel.DEBUG, ctx, 'message');
    expect(debugLog[0]).toContain('DEBUG');

    const infoLog = compactFormatter(LogLevel.INFO, ctx, 'message');
    expect(infoLog[0]).toContain('INFO');

    const warnLog = compactFormatter(LogLevel.WARN, ctx, 'message');
    expect(warnLog[0]).toContain('WARN');

    const errorLog = compactFormatter(LogLevel.ERROR, ctx, 'message');
    expect(errorLog[0]).toContain('ERROR');

    const fatalLog = compactFormatter(LogLevel.FATAL, ctx, 'message');
    expect(fatalLog[0]).toContain('FATAL');
  });

  it('should handle multiple arguments', () => {
    const ctx = createTestContext();
    const result = compactFormatter(LogLevel.INFO, ctx, 'User logged in', { userId: 123 });

    expect(result).toHaveLength(3);
    expect(result[0]).toContain('INFO');
    expect(result[1]).toBe('User logged in');
    expect(result[2]).toEqual({ userId: 123 });
  });

  it('should not include timestamps', () => {
    const ctx = createTestContext({ timeFormat: TimeFormat.ISO });
    const result = compactFormatter(LogLevel.WARN, ctx, 'test');

    // Compact formatter should not include timestamps
    expect(result.every(chunk => !String(chunk).match(/\d{2}:\d{2}:\d{2}/))).toBe(true);
  });
});
