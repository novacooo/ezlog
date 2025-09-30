// import { createLogger, defaultLogger } from './core';
// import { LogLevelNumber } from './levels';
// import { TimeFormat } from './formatters';
//
// export { Logger, defaultLogger, createLogger, type LoggerOptions, type LoggerOutput } from './core';
// export { LogLevelName, type LogLevel, LogLevelNumber, shouldLog, normalizeLogLevel, NormalizeTarget } from './levels';
// export { formatLog, defaultFormatter, type LogEntry, type FormatterOptions, type TimeFormat } from './formatters';
// export { LogColor, hasColorSupport } from './colors';
//
// export const ezlog = defaultLogger;

import { createLogger } from './core';
import { LogLevelNumber } from './levels';
import { TimeFormat } from './formatters';

const ezlog = createLogger();

function exampleUsage() {
  console.log('=== EZLOG - Przykłady użycia ===\n');

  // 1. Podstawowe użycie
  console.log('1. Podstawowe logi:');
  ezlog.debug('To jest debug (nie wyświetli się - domyślny poziom to INFO)');
  ezlog.info('Użytkownik zalogowany pomyślnie');
  ezlog.warn('Ostrzeżenie: niska ilość miejsca na dysku');
  ezlog.error('Błąd połączenia z bazą danych');
  ezlog.fatal('Krytyczny błąd systemu');

  console.log('\n2. Logger z niższym poziomem (DEBUG):');
  const debugLogger = createLogger({ minLevel: LogLevelNumber.DEBUG });
  debugLogger.debug('Teraz debug się wyświetli');
  debugLogger.info('Informacja z debug loggera');

  console.log('\n3. Logger bez kolorów:');
  const noColorLogger = createLogger({
    formatterOptions: { useColors: false },
  });
  noColorLogger.info('Log bez kolorów');
  noColorLogger.error('Błąd bez kolorów');

  console.log('\n4. Logger z milisekundami:');
  const msLogger = createLogger({
    formatterOptions: { timeFormat: TimeFormat.HH_SSS },
  });
  msLogger.info('Log z milisekundami');

  console.log('\n5. Używanie poziomów numerycznych:');
  const numericLogger = createLogger({ minLevel: 2 }); // WARN i wyżej
  numericLogger.info('Info się nie wyświetli (1 < 2)');
  numericLogger.warn('Warn się wyświetli (2 >= 2)');
  numericLogger.error('Error się wyświetli (3 >= 2)');

  console.log('\n6. Custom output:');
  const customLogger = createLogger({
    output: 'custom',
    outputTarget: (message) => console.log(`📝 CUSTOM: ${message}`),
  });
  customLogger.info('Log z custom outputem');

  console.log('\n7. Dynamiczna zmiana poziomu:');
  const dynamicLogger = createLogger({ minLevel: 'error' });
  console.log('Aktualny poziom:', dynamicLogger.getMinLevel());
  dynamicLogger.info('To się nie wyświetli');

  dynamicLogger.setMinLevel('debug');
  console.log('Nowy poziom:', dynamicLogger.getMinLevel());
  dynamicLogger.info('Teraz info się wyświetli');

  console.log('\n=== Koniec przykładów ===');
}

exampleUsage();
