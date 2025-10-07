# @novacooo/ezlog

🪵 **Lightweight, no-nonsense logger for personal projects.**

Simple, colorful, and flexible logging with zero dependencies. Perfect for quick projects where you need more than `console.log` but don't want the complexity of enterprise loggers.

[![npm version](https://img.shields.io/npm/v/@novacooo/ezlog.svg)](https://www.npmjs.com/package/@novacooo/ezlog)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🎨 **Colorful output** with 5 log levels
- 🕐 **Flexible time formats** (HH:mm:ss, ISO, custom)
- 🎯 **Log level filtering** (show only what matters)
- 🎭 **Custom formatters** (JSON, compact, or build your own)
- 📦 **Zero dependencies** (pure TypeScript)
- 🪶 **Tiny bundle size**
- 🔧 **TypeScript-first** with full type safety

## 📦 Installation

```bash
npm install @novacooo/ezlog
```

## 🚀 Quick Start

```typescript
import { createLogger } from '@novacooo/ezlog';

const logger = createLogger();

logger.debug('Debugging application state');
logger.info('Server started on port 3000');
logger.warn('Connection timeout after 5s');
logger.error('Failed to connect to database');
logger.fatal('Out of memory - shutting down');
```

**Output:**

```
[12:34:56] DEBUG Debugging application state
[12:34:56] INFO  Server started on port 3000
[12:34:56] WARN  Connection timeout after 5s
[12:34:56] ERROR Failed to connect to database
[12:34:56] FATAL Out of memory - shutting down
```

## 📚 Usage

### Basic Logging

```typescript
import { createLogger } from '@novacooo/ezlog';

const logger = createLogger();

// Log with multiple arguments
logger.info('User logged in:', { userId: 123, email: 'user@example.com' });

// Log with any data type
logger.debug('Request headers:', headers);
logger.error('API error:', error);
logger.warn('Retry attempt:', attemptNumber, 'of', maxRetries);
```

### Configuration

```typescript
import { createLogger, LogLevel, TimeFormat } from '@novacooo/ezlog';

const logger = createLogger({
  minLevel: LogLevel.DEBUG, // Show all logs
  timeFormat: TimeFormat.HH_SSS, // Include milliseconds
});
```

### Log Levels

Control which logs are displayed using `minLevel`:

| Level   | Value | Description                              |
| ------- | ----- | ---------------------------------------- |
| `DEBUG` | 0     | Detailed debug information               |
| `INFO`  | 1     | General informational messages (default) |
| `WARN`  | 2     | Warning messages                         |
| `ERROR` | 3     | Error messages                           |
| `FATAL` | 4     | Critical errors                          |

```typescript
// Show only warnings and errors
const logger = createLogger({ minLevel: 'warn' });

logger.debug('Not visible'); // ❌ Hidden
logger.info('Not visible'); // ❌ Hidden
logger.warn('Visible'); // ✅ Shown
logger.error('Visible'); // ✅ Shown
```

### Time Formats

Choose how timestamps are displayed:

```typescript
import { createLogger, TimeFormat } from '@novacooo/ezlog';

// HH:mm:ss (default)
const logger1 = createLogger({ timeFormat: TimeFormat.HH });
// [12:34:56] INFO Message

// HH:mm:ss.SSS (with milliseconds)
const logger2 = createLogger({ timeFormat: TimeFormat.HH_SSS });
// [12:34:56.789] INFO Message

// ISO 8601
const logger3 = createLogger({ timeFormat: TimeFormat.ISO });
// [2025-10-07T12:34:56.789Z] INFO Message
```

## 🎨 Custom Formatters

### Built-in Formatters

**Default Formatter** (colorful with timestamp):

```typescript
import { createLogger, defaultFormatter } from '@novacooo/ezlog';

const logger = createLogger({ formatter: defaultFormatter });
logger.info('Hello World');
// [12:34:56] INFO  Hello World
```

**JSON Formatter** (for production/structured logging):

```typescript
import { createLogger, jsonFormatter } from '@novacooo/ezlog';

const logger = createLogger({ formatter: jsonFormatter });
logger.info('User action', { userId: 123, action: 'login' });
// {"timestamp":"2025-10-07T12:34:56.789Z","level":"info","message":"User action {\"userId\":123,\"action\":\"login\"}"}
```

**Compact Formatter** (minimal output):

```typescript
import { createLogger, compactFormatter } from '@novacooo/ezlog';

const logger = createLogger({ formatter: compactFormatter });
logger.warn('Warning message');
// [WARN] Warning message
```

### Custom Formatter Functions

Create your own formatter for complete control:

```typescript
import { createLogger, type FormatterFunction } from '@novacooo/ezlog';

// Emoji formatter
const emojiFormatter: FormatterFunction = (level, ctx, ...args) => {
  const emojis = { debug: '🐛', info: 'ℹ️', warn: '⚠️', error: '❌', fatal: '💀' };
  return [emojis[level], ...args];
};

const logger = createLogger({ formatter: emojiFormatter });
logger.info('Hello!');
// ℹ️ Hello!

// Prefix formatter
const prefixFormatter: FormatterFunction = (level, ctx, ...args) => {
  return [`[MyApp]`, `[${level.toUpperCase()}]`, ...args];
};

const logger2 = createLogger({ formatter: prefixFormatter });
logger2.error('Something failed');
// [MyApp] [ERROR] Something failed
```

## 💡 Real-World Examples

### API Logging

```typescript
const logger = createLogger({ minLevel: 'info' });

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} ${res.statusCode} - ${responseTime}ms`);
  next();
});
```

### Application Lifecycle

```typescript
const logger = createLogger({ minLevel: 'debug' });

logger.info('Initializing application...');
logger.debug('Loading configuration from .env');
logger.debug('Connecting to database...');
logger.info('Database connected ✓');
logger.info('Server listening on port 3000 ✓');
```

### Error Handling

```typescript
const logger = createLogger();

try {
  await riskyOperation();
} catch (error) {
  logger.error('Operation failed:', error);
}
```

### Production Logging (JSON)

```typescript
const logger = createLogger({
  minLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  formatter: process.env.NODE_ENV === 'production' ? jsonFormatter : defaultFormatter,
});

logger.info('App started');
logger.error('Payment processing failed', { orderId, amount, reason });
```

## 🔧 API Reference

### `createLogger(options?)`

Creates a new logger instance.

**Options:**

- `minLevel?: LogLevel | number` - Minimum log level to display (default: `'info'`)
- `timeFormat?: TimeFormat` - Timestamp format (default: `'HH:mm:ss'`)
- `formatter?: FormatterFunction` - Custom formatter function (default: `defaultFormatter`)

**Returns:** `Logger` instance with methods: `debug`, `info`, `warn`, `error`, `fatal`

### `FormatterFunction`

Type for custom formatter functions:

```typescript
type FormatterFunction = (logLevel: LogLevel, ctx: LoggerContext, ...args: any[]) => any[];
```

**Parameters:**

- `logLevel` - Current log level
- `ctx` - Logger context (includes `minLevel`, `timeFormat`, `formatter`)
- `...args` - Arguments passed to the log method

**Returns:** Array of values to pass to `console.*`

## 🤔 Why ezlog?

- **Simple**: One function call, no configuration files, no complexity
- **Fast**: Zero dependencies, minimal overhead
- **Flexible**: Use built-in formatters or create your own
- **TypeScript**: Full type safety out of the box
- **Modern**: ESM + CJS, works everywhere

## 📄 License

MIT © [Jacek Nowak](https://github.com/novacooo)

## 🔗 Links

- [GitHub](https://github.com/novacooo/ezlog)
- [npm](https://www.npmjs.com/package/@novacooo/ezlog)
- [Issues](https://github.com/novacooo/ezlog/issues)

---

Made with ❤️ for developers who want simple, beautiful logs without the bloat.
