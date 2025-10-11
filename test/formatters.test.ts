import { describe, expect, it } from 'vitest';
import { compactFormatter, defaultFormatter, jsonFormatter, TimeFormat } from '../src/formatters';
import { LogLevel } from '../src';
import { createTestState } from '../src/state';

describe('defaultFormatter', () => {
  it('should return an array with time, level, and message', () => {
    const state = createTestState({ timeFormat: TimeFormat.HH });
    const result = defaultFormatter(LogLevel.INFO, state, 'test message');

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(3);
    expect(result[0]).toMatch(/\[\d{2}:\d{2}:\d{2}\]/); // time chunk with brackets
    expect(result[1]).toContain('INFO');
    expect(result[2]).toBe('test message');
  });

  it('should format time with HH_SSS format', () => {
    const state = createTestState({ timeFormat: TimeFormat.HH_SSS });
    const result = defaultFormatter(LogLevel.INFO, state, 'test');

    expect(result[0]).toMatch(/\[\d{2}:\d{2}:\d{2}\.\d{3}\]/); // HH:mm:ss.SSS pattern
  });

  it('should format time with ISO format', () => {
    const state = createTestState({ timeFormat: TimeFormat.ISO });
    const result = defaultFormatter(LogLevel.INFO, state, 'test');

    expect(result[0]).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/); // ISO pattern
  });

  it('should pad log level names to 5 characters', () => {
    const state = createTestState();
    const debugLog = defaultFormatter(LogLevel.DEBUG, state, 'message');
    const infoLog = defaultFormatter(LogLevel.INFO, state, 'message');
    const warnLog = defaultFormatter(LogLevel.WARN, state, 'message');
    const errorLog = defaultFormatter(LogLevel.ERROR, state, 'message');
    const fatalLog = defaultFormatter(LogLevel.FATAL, state, 'message');

    expect(debugLog[1]).toContain('DEBUG');
    expect(infoLog[1]).toContain('INFO '); // padded with space
    expect(warnLog[1]).toContain('WARN '); // padded with space
    expect(errorLog[1]).toContain('ERROR');
    expect(fatalLog[1]).toContain('FATAL');
  });

  it('should handle multiple arguments', () => {
    const state = createTestState();
    const result = defaultFormatter(LogLevel.WARN, state, 'message', { foo: 'bar' }, 123);

    expect(result).toHaveLength(5);
    expect(result[0]).toMatch(/\[.*\]/); // time chunk
    expect(result[1]).toContain('WARN'); // level chunk
    expect(result[2]).toBe('message');
    expect(result[3]).toEqual({ foo: 'bar' });
    expect(result[4]).toBe(123);
  });

  it('should format context correctly', () => {
    const state = createTestState({ context: { service: 'api', requestId: '123' } });
    const result = defaultFormatter(LogLevel.INFO, state, 'test message');

    expect(result.length).toBeGreaterThanOrEqual(4);
    expect(result[0]).toMatch(/\[.*\]/); // time chunk
    expect(result[1]).toContain('INFO'); // level chunk
    // context chunks should be present
    const contextStr = result.join(' ');
    expect(contextStr).toContain('service=api');
    expect(contextStr).toContain('requestId=123');
  });

  it('should handle empty context', () => {
    const state = createTestState({ context: {} });
    const result = defaultFormatter(LogLevel.INFO, state, 'test message');

    expect(result).toHaveLength(3); // time, level, message
  });

  it('should format context with various data types', () => {
    const state = createTestState({
      context: {
        string: 'value',
        number: 42,
        boolean: true,
        object: { nested: 'data' },
      },
    });
    const result = defaultFormatter(LogLevel.INFO, state, 'test');

    const contextStr = result.join(' ');
    expect(contextStr).toContain('string=value');
    expect(contextStr).toContain('number=42');
    expect(contextStr).toContain('boolean=true');
    expect(contextStr).toContain('object=');
  });
});

describe('jsonFormatter', () => {
  it('should produce valid JSON output', () => {
    const state = createTestState();
    const result = jsonFormatter(LogLevel.INFO, state, 'test', 'message');

    expect(result).toHaveLength(1);
    expect(() => JSON.parse(result[0])).not.toThrow();

    const parsed = JSON.parse(result[0]);
    expect(parsed).toHaveProperty('timestamp');
    expect(parsed).toHaveProperty('level', 'info');
    expect(parsed).toHaveProperty('message', 'test message');
  });

  it('should stringify objects in message', () => {
    const state = createTestState();
    const result = jsonFormatter(LogLevel.INFO, state, 'User:', { id: 123 });

    const parsed = JSON.parse(result[0]);
    expect(parsed.message).toContain('User:');
    expect(parsed.message).toContain('"id":123');
  });

  it('should handle all log levels', () => {
    const state = createTestState();

    const debugLog = jsonFormatter(LogLevel.DEBUG, state, 'debug message');
    expect(JSON.parse(debugLog[0]).level).toBe('debug');

    const infoLog = jsonFormatter(LogLevel.INFO, state, 'info message');
    expect(JSON.parse(infoLog[0]).level).toBe('info');

    const warnLog = jsonFormatter(LogLevel.WARN, state, 'warn message');
    expect(JSON.parse(warnLog[0]).level).toBe('warn');

    const errorLog = jsonFormatter(LogLevel.ERROR, state, 'error message');
    expect(JSON.parse(errorLog[0]).level).toBe('error');

    const fatalLog = jsonFormatter(LogLevel.FATAL, state, 'fatal message');
    expect(JSON.parse(fatalLog[0]).level).toBe('fatal');
  });

  it('should handle multiple mixed arguments', () => {
    const state = createTestState();
    const result = jsonFormatter(LogLevel.ERROR, state, 'Error:', 404, { url: '/api' });

    const parsed = JSON.parse(result[0]);
    expect(parsed.message).toContain('Error:');
    expect(parsed.message).toContain('404');
    expect(parsed.message).toContain('{"url":"/api"}');
  });

  it('should include context in JSON output', () => {
    const state = createTestState({ context: { service: 'api', requestId: '123' } });
    const result = jsonFormatter(LogLevel.INFO, state, 'test message');

    const parsed = JSON.parse(result[0]);
    expect(parsed).toHaveProperty('context');
    expect(parsed.context).toEqual({ service: 'api', requestId: '123' });
  });

  it('should not include context key when context is empty', () => {
    const state = createTestState({ context: {} });
    const result = jsonFormatter(LogLevel.INFO, state, 'test message');

    const parsed = JSON.parse(result[0]);
    expect(parsed).not.toHaveProperty('context');
  });

  it('should handle context with nested objects', () => {
    const state = createTestState({
      context: {
        user: { id: 123, email: 'test@example.com' },
        metadata: { version: '1.0' },
      },
    });
    const result = jsonFormatter(LogLevel.INFO, state, 'test');

    const parsed = JSON.parse(result[0]);
    expect(parsed.context).toEqual({
      user: { id: 123, email: 'test@example.com' },
      metadata: { version: '1.0' },
    });
  });
});

describe('compactFormatter', () => {
  it('should include level and message', () => {
    const state = createTestState();
    const result = compactFormatter(LogLevel.WARN, state, 'test', 'message');

    expect(result.length).toBeGreaterThanOrEqual(2);
    expect(result[0]).toContain('WARN');
    expect(result[1]).toBe('test');
    expect(result[2]).toBe('message');
  });

  it('should format all log levels correctly', () => {
    const state = createTestState();

    const debugLog = compactFormatter(LogLevel.DEBUG, state, 'message');
    expect(debugLog[0]).toContain('DEBUG');

    const infoLog = compactFormatter(LogLevel.INFO, state, 'message');
    expect(infoLog[0]).toContain('INFO');

    const warnLog = compactFormatter(LogLevel.WARN, state, 'message');
    expect(warnLog[0]).toContain('WARN');

    const errorLog = compactFormatter(LogLevel.ERROR, state, 'message');
    expect(errorLog[0]).toContain('ERROR');

    const fatalLog = compactFormatter(LogLevel.FATAL, state, 'message');
    expect(fatalLog[0]).toContain('FATAL');
  });

  it('should handle multiple arguments', () => {
    const state = createTestState();
    const result = compactFormatter(LogLevel.INFO, state, 'User logged in', { userId: 123 });

    expect(result).toHaveLength(3);
    expect(result[0]).toContain('INFO');
    expect(result[1]).toBe('User logged in');
    expect(result[2]).toEqual({ userId: 123 });
  });

  it('should not include timestamps', () => {
    const state = createTestState({ timeFormat: TimeFormat.ISO });
    const result = compactFormatter(LogLevel.WARN, state, 'test');

    // Compact formatter should not include timestamps
    expect(result.every((chunk) => !String(chunk).match(/\d{2}:\d{2}:\d{2}/))).toBe(true);
  });

  it('should include context in output', () => {
    const state = createTestState({ context: { service: 'api', requestId: '123' } });
    const result = compactFormatter(LogLevel.INFO, state, 'test message');

    expect(result.length).toBeGreaterThanOrEqual(3); // level + context chunks + message
    const contextStr = result.join(' ');
    expect(contextStr).toContain('service=api');
    expect(contextStr).toContain('requestId=123');
  });

  it('should handle empty context', () => {
    const state = createTestState({ context: {} });
    const result = compactFormatter(LogLevel.INFO, state, 'test message');

    expect(result).toHaveLength(2); // level + message only
  });
});
