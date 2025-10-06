# @novacooo/ezlog

🪵 Lightweight, no-nonsense logger for personal projects.

## Installation

```bash
npm install @novacooo/ezlog
```

## Usage

```typescript
import { createLogger } from '@novacooo/ezlog';

const logger = createLogger();

logger.debug('Debug message');
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message');
logger.fatal('Fatal error');
```

## Configuration

```typescript
import { createLogger } from '@novacooo/ezlog';

const logger = createLogger({
  minLevel: 'debug',
  timeFormat: 'HH:mm:ss.SSS',
});
```

### Log Levels

- `'debug'` (0) - Detailed debug information
- `'info'` (1) - General informational messages (default)
- `'warn'` (2) - Warning messages
- `'error'` (3) - Error messages
- `'fatal'` (4) - Critical errors

### Time Formats

- `'HH:mm:ss'` - Hours, minutes, seconds (default)
- `'HH:mm:ss.SSS'` - With milliseconds
- `'ISO'` - ISO 8601 format

## License

MIT © [Jacek Nowak](https://github.com/novacooo)
