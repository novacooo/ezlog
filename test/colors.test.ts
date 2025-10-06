import { afterEach, describe, expect, it } from 'vitest';
import { colorizeText, getTextColor, hasColorSupport, TextColor } from '../src/colors';
import { LogLevel } from '../src';

describe('hasColorSupport', () => {
  const originalProcess = global.process;

  afterEach(() => {
    global.process = originalProcess;
  });

  it('should return true when TTY is available', () => {
    global.process = {
      ...originalProcess,
      stdout: { isTTY: true } as any,
      env: { TERM: 'xterm-256color' },
    } as any;

    expect(hasColorSupport()).toBe(true);
  });

  it('should return false when TTY is not available', () => {
    global.process = {
      ...originalProcess,
      stdout: { isTTY: false } as any,
      env: { TERM: 'xterm-256color' },
    } as any;

    expect(hasColorSupport()).toBe(false);
  });

  it('should return false when TERM is dumb', () => {
    global.process = {
      ...originalProcess,
      stdout: { isTTY: true } as any,
      env: { TERM: 'dumb' },
    } as any;

    expect(hasColorSupport()).toBe(false);
  });

  it('should return false when process is undefined', () => {
    global.process = undefined as any;

    expect(hasColorSupport()).toBe(false);
  });
});

describe('colorizeText', () => {
  it('should add color codes when color support is available', () => {
    const originalProcess = global.process;
    global.process = {
      ...originalProcess,
      stdout: { isTTY: true } as any,
      env: { TERM: 'xterm-256color' },
    } as any;

    const result = colorizeText('test', TextColor.CYAN);

    expect(result).toContain('test');
    expect(result).toMatch(/\x1b\[38;2;\d+;\d+;\d+m/); // RGB color code
    expect(result).toContain('\x1b[0m'); // Reset code

    global.process = originalProcess;
  });

  it('should return plain text when color support is not available', () => {
    const originalProcess = global.process;
    global.process = {
      ...originalProcess,
      stdout: { isTTY: false } as any,
    } as any;

    const result = colorizeText('test', TextColor.CYAN);

    expect(result).toBe('test');
    expect(result).not.toContain('\x1b');

    global.process = originalProcess;
  });
});

describe('getTextColor', () => {
  it('should return correct color for each log level', () => {
    expect(getTextColor(LogLevel.DEBUG)).toBe(TextColor.CYAN);
    expect(getTextColor(LogLevel.INFO)).toBe(TextColor.LIGHT_GRAY);
    expect(getTextColor(LogLevel.WARN)).toBe(TextColor.ORANGE);
    expect(getTextColor(LogLevel.ERROR)).toBe(TextColor.RED);
    expect(getTextColor(LogLevel.FATAL)).toBe(TextColor.BRIGHT_RED);
  });
});
