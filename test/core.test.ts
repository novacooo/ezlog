import { describe, expect, it } from 'vitest';
import { createLogger, LogLevel, TimeFormat } from '../src';

describe('createLogger', () => {
  describe('initialization', () => {
    it('should create logger with all required methods', () => {
      const logger = createLogger();

      expect(logger).toHaveProperty('debug');
      expect(logger).toHaveProperty('info');
      expect(logger).toHaveProperty('warn');
      expect(logger).toHaveProperty('error');
      expect(logger).toHaveProperty('fatal');

      expect(typeof logger.debug).toBe('function');
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.fatal).toBe('function');
    });

    it('should create logger with default options', () => {
      const logger = createLogger();
      expect(logger).toBeDefined();
    });

    it('should create logger with custom minLevel', () => {
      const logger = createLogger({ minLevel: LogLevel.DEBUG });
      expect(logger).toBeDefined();
    });

    it('should create logger with custom timeFormat', () => {
      const logger = createLogger({ timeFormat: TimeFormat.ISO });
      expect(logger).toBeDefined();
    });

    it('should create logger with both options', () => {
      const logger = createLogger({
        minLevel: LogLevel.WARN,
        timeFormat: TimeFormat.HH_SSS,
      });
      expect(logger).toBeDefined();
    });
  });

  describe('configuration acceptance', () => {
    it('should accept all valid log levels', () => {
      expect(() => createLogger({ minLevel: LogLevel.DEBUG })).not.toThrow();
      expect(() => createLogger({ minLevel: LogLevel.INFO })).not.toThrow();
      expect(() => createLogger({ minLevel: LogLevel.WARN })).not.toThrow();
      expect(() => createLogger({ minLevel: LogLevel.ERROR })).not.toThrow();
      expect(() => createLogger({ minLevel: LogLevel.FATAL })).not.toThrow();
    });

    it('should accept numeric log levels', () => {
      expect(() => createLogger({ minLevel: 0 })).not.toThrow();
      expect(() => createLogger({ minLevel: 1 })).not.toThrow();
      expect(() => createLogger({ minLevel: 2 })).not.toThrow();
      expect(() => createLogger({ minLevel: 3 })).not.toThrow();
      expect(() => createLogger({ minLevel: 4 })).not.toThrow();
    });

    it('should accept all valid time formats', () => {
      expect(() => createLogger({ timeFormat: TimeFormat.HH })).not.toThrow();
      expect(() => createLogger({ timeFormat: TimeFormat.HH_SSS })).not.toThrow();
      expect(() => createLogger({ timeFormat: TimeFormat.ISO })).not.toThrow();
    });
  });

  describe('logger methods behavior', () => {
    it('should not throw when calling any log method', () => {
      const logger = createLogger({ minLevel: LogLevel.DEBUG });

      expect(() => logger.debug('test')).not.toThrow();
      expect(() => logger.info('test')).not.toThrow();
      expect(() => logger.warn('test')).not.toThrow();
      expect(() => logger.error('test')).not.toThrow();
      expect(() => logger.fatal('test')).not.toThrow();
    });

    it('should handle calls without arguments', () => {
      const logger = createLogger();

      expect(() => logger.info()).not.toThrow();
    });

    it('should handle multiple arguments', () => {
      const logger = createLogger();

      expect(() => logger.info('msg', { foo: 'bar' }, 123, true)).not.toThrow();
    });

    it('should handle different argument types', () => {
      const logger = createLogger();

      expect(() => logger.info('string')).not.toThrow();
      expect(() => logger.info(123)).not.toThrow();
      expect(() => logger.info({ key: 'value' })).not.toThrow();
      expect(() => logger.info([1, 2, 3])).not.toThrow();
      expect(() => logger.info(null)).not.toThrow();
      expect(() => logger.info(undefined)).not.toThrow();
      expect(() => logger.info(true)).not.toThrow();
    });
  });
});
