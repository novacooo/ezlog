import { describe, expect, it } from 'vitest';
import { LogLevel } from '../src';
import { normalize, NormalizeTarget, shouldLog } from '../src/levels';

describe('normalizeLogLevel', () => {
  describe('to NUMBER', () => {
    it('should convert string level to number', () => {
      expect(normalize(LogLevel.DEBUG, NormalizeTarget.NUMBER)).toBe(0);
      expect(normalize(LogLevel.INFO, NormalizeTarget.NUMBER)).toBe(1);
      expect(normalize(LogLevel.WARN, NormalizeTarget.NUMBER)).toBe(2);
      expect(normalize(LogLevel.ERROR, NormalizeTarget.NUMBER)).toBe(3);
      expect(normalize(LogLevel.FATAL, NormalizeTarget.NUMBER)).toBe(4);
    });

    it('should pass through valid number levels', () => {
      expect(normalize(0, NormalizeTarget.NUMBER)).toBe(0);
      expect(normalize(1, NormalizeTarget.NUMBER)).toBe(1);
      expect(normalize(2, NormalizeTarget.NUMBER)).toBe(2);
      expect(normalize(3, NormalizeTarget.NUMBER)).toBe(3);
      expect(normalize(4, NormalizeTarget.NUMBER)).toBe(4);
    });

    it('should throw on invalid number levels', () => {
      expect(() => normalize(-1, NormalizeTarget.NUMBER)).toThrow('Invalid log level number: -1');
      expect(() => normalize(5, NormalizeTarget.NUMBER)).toThrow('Invalid log level number: 5');
      expect(() => normalize(999, NormalizeTarget.NUMBER)).toThrow('Invalid log level number: 999');
    });

    it('should throw on invalid string levels', () => {
      // @ts-expect-error - testing invalid input
      expect(() => normalize('invalid', NormalizeTarget.NUMBER)).toThrow('Invalid log level name: invalid');
    });
  });

  describe('to NAME', () => {
    it('should convert number level to string', () => {
      expect(normalize(0, NormalizeTarget.NAME)).toBe(LogLevel.DEBUG);
      expect(normalize(1, NormalizeTarget.NAME)).toBe(LogLevel.INFO);
      expect(normalize(2, NormalizeTarget.NAME)).toBe(LogLevel.WARN);
      expect(normalize(3, NormalizeTarget.NAME)).toBe(LogLevel.ERROR);
      expect(normalize(4, NormalizeTarget.NAME)).toBe(LogLevel.FATAL);
    });

    it('should pass through valid string levels', () => {
      expect(normalize(LogLevel.DEBUG, NormalizeTarget.NAME)).toBe(LogLevel.DEBUG);
      expect(normalize(LogLevel.INFO, NormalizeTarget.NAME)).toBe(LogLevel.INFO);
      expect(normalize(LogLevel.WARN, NormalizeTarget.NAME)).toBe(LogLevel.WARN);
      expect(normalize(LogLevel.ERROR, NormalizeTarget.NAME)).toBe(LogLevel.ERROR);
      expect(normalize(LogLevel.FATAL, NormalizeTarget.NAME)).toBe(LogLevel.FATAL);
    });

    it('should throw on invalid number levels', () => {
      expect(() => normalize(-1, NormalizeTarget.NAME)).toThrow('Invalid log level number: -1');
      expect(() => normalize(5, NormalizeTarget.NAME)).toThrow('Invalid log level number: 5');
    });

    it('should throw on invalid string levels', () => {
      // @ts-expect-error - testing invalid input
      expect(() => normalize('invalid', NormalizeTarget.NAME)).toThrow('Invalid log level name: invalid');
    });
  });

  it('should throw on invalid normalization target', () => {
    // @ts-expect-error - testing invalid input
    expect(() => normalize(LogLevel.INFO, 'invalid')).toThrow('Invalid normalization target');
  });
});

describe('shouldLog', () => {
  it('should return true when level >= minLevel', () => {
    expect(shouldLog(LogLevel.ERROR, LogLevel.DEBUG)).toBe(true);
    expect(shouldLog(LogLevel.WARN, LogLevel.WARN)).toBe(true);
    expect(shouldLog(LogLevel.FATAL, LogLevel.INFO)).toBe(true);
  });

  it('should return false when level < minLevel', () => {
    expect(shouldLog(LogLevel.DEBUG, LogLevel.INFO)).toBe(false);
    expect(shouldLog(LogLevel.INFO, LogLevel.WARN)).toBe(false);
    expect(shouldLog(LogLevel.WARN, LogLevel.ERROR)).toBe(false);
  });

  it('should work with number levels', () => {
    expect(shouldLog(0, 1)).toBe(false); // DEBUG < INFO
    expect(shouldLog(3, 1)).toBe(true); // ERROR >= INFO
  });

  it('should work with mixed string and number levels', () => {
    expect(shouldLog(LogLevel.DEBUG, 1)).toBe(false); // DEBUG < INFO (1)
    expect(shouldLog(3, LogLevel.INFO)).toBe(true); // ERROR (3) >= INFO
  });
});
