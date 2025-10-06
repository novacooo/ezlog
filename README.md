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

- `LogLevel.DEBUG` (0) - Detailed debug information
- `LogLevel.INFO` (1) - General informational messages
- `LogLevel.WARN` (2) - Warning messages
- `LogLevel.ERROR` (3) - Error messages
- `LogLevel.FATAL` (4) - Critical errors

### Time Formats

- `TimeFormat.HH` - `HH:mm:ss` (default)
- `TimeFormat.HH_SSS` - `HH:mm:ss.SSS`
- `TimeFormat.ISO` - ISO 8601 format

## License

MIT © [Jacek Nowak](https://github.com/novacooo)
