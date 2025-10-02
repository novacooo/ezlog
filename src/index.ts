import { createLogger } from './core';
import { LogLevelName } from './levels';

const ezlog = createLogger({
  minLevel: LogLevelName.DEBUG,
});

function exampleUsage() {
  ezlog.debug('Przejście na ekran logowania');
  ezlog.info('Użytkownik zalogowany pomyślnie');
  ezlog.warn('Ostrzeżenie: niska ilość miejsca na dysku');
  ezlog.error('Błąd połączenia z bazą danych');
  ezlog.fatal('Krytyczny błąd systemu');
}

exampleUsage();
