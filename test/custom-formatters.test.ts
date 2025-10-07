import { describe, expect, it } from 'vitest';
import { compactFormatter, createLogger, type FormatterFunction, jsonFormatter, LogLevel } from '../src';

describe('Custom Formatters', () => {
  describe('jsonFormatter', () => {
    it('should format logs as JSON', () => {
      const logger = createLogger({ minLevel: LogLevel.DEBUG, formatter: jsonFormatter });

      // We can't easily test console output, so we'll just verify it doesn't throw
      expect(() => logger.info('test message')).not.toThrow();
      expect(() => logger.error('error message', { foo: 'bar' })).not.toThrow();
    });

    it('should produce valid JSON output', () => {
      const result = jsonFormatter(
        LogLevel.INFO,
        { minLevel: LogLevel.INFO, timeFormat: 'HH:mm:ss', formatter: jsonFormatter } as any,
        'test',
        'message',
      );

      expect(result).toHaveLength(1);
      expect(() => JSON.parse(result[0])).not.toThrow();

      const parsed = JSON.parse(result[0]);
      expect(parsed).toHaveProperty('timestamp');
      expect(parsed).toHaveProperty('level', 'info');
      expect(parsed).toHaveProperty('message', 'test message');
    });

    it('should stringify objects in message', () => {
      const result = jsonFormatter(
        LogLevel.INFO,
        { minLevel: LogLevel.INFO, timeFormat: 'HH:mm:ss', formatter: jsonFormatter } as any,
        'User:',
        { id: 123 },
      );

      const parsed = JSON.parse(result[0]);
      expect(parsed.message).toContain('User:');
      expect(parsed.message).toContain('"id":123');
    });
  });

  describe('compactFormatter', () => {
    it('should format logs compactly', () => {
      const logger = createLogger({ minLevel: LogLevel.DEBUG, formatter: compactFormatter });

      expect(() => logger.info('test message')).not.toThrow();
      expect(() => logger.debug('debug message')).not.toThrow();
    });

    it('should include level and message', () => {
      const result = compactFormatter(
        LogLevel.WARN,
        { minLevel: LogLevel.INFO, timeFormat: 'HH:mm:ss', formatter: compactFormatter } as any,
        'test',
        'message',
      );

      expect(result.length).toBeGreaterThanOrEqual(2);
      expect(result[0]).toContain('WARN');
      expect(result[1]).toBe('test');
      expect(result[2]).toBe('message');
    });
  });

  describe('custom formatter', () => {
    it('should allow custom formatter function', () => {
      const customFormatter: FormatterFunction = (level, ctx, ...args) => {
        return [`🎨 Custom:`, ...args];
      };

      const logger = createLogger({ minLevel: LogLevel.DEBUG, formatter: customFormatter });

      expect(() => logger.info('test')).not.toThrow();
    });

    it('should receive correct parameters', () => {
      let capturedLevel: any;
      let capturedArgs: any[] = [];

      const customFormatter: FormatterFunction = (level, ctx, ...args) => {
        capturedLevel = level;
        capturedArgs = args;
        return ['formatted'];
      };

      const logger = createLogger({ minLevel: LogLevel.DEBUG, formatter: customFormatter });
      logger.warn('test', 'message', 123);

      expect(capturedLevel).toBe(LogLevel.WARN);
      expect(capturedArgs).toEqual(['test', 'message', 123]);
    });
  });
});
