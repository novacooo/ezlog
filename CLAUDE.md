# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

@novacooo/ezlog is a lightweight, no-nonsense logger for personal projects. It's a TypeScript library that provides colored console logging with configurable log levels and time formats.

## Development Commands

### Testing

- `npm test` - Run all tests with Vitest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

### Building

- `npm run build` - Build the library using tsup (generates CJS and ESM outputs)
- `npm run dev` - Run development mode with nodemon (watches src/ and executes src/index.ts)

### Code Quality

- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting without making changes

### Publishing

- `npm run release` - Build, test, and publish to npm (automated workflow)

## Architecture

The codebase follows a modular structure with clear separation of concerns:

### Core Module (`src/core.ts`)

The main entry point that exports `createLogger()` factory function. It:

- Creates logger instances with 5 methods: `debug`, `info`, `warn`, `error`, `fatal`
- Maps log levels to appropriate console methods
- Orchestrates formatting and level filtering

### Log Levels (`src/levels.ts`)

Manages the log level system:

- Defines 5 log levels: DEBUG (0), INFO (1), WARN (2), ERROR (3), FATAL (4)
- `normalizeLogLevel()` - Converts between string names and numeric levels with overloaded signatures
- `shouldLog()` - Determines if a message should be logged based on min level
- Accepts both string names ('debug') and numbers (0) for flexibility

### Formatters (`src/formatters.ts`)

Handles output formatting:

- Supports 3 time formats: 'HH:mm:ss' (default), 'HH:mm:ss.SSS', 'ISO'
- `formatLog()` - Generates formatted log strings with time, level, and message chunks
- All chunks are colorized according to log level

### Colors (`src/colors.ts`)

Terminal color management:

- Uses RGB ANSI escape codes for consistent colors across terminals
- `hasColorSupport()` - Detects TTY support and disables colors when piped
- Maps each log level to a specific color (debug=cyan, info=light gray, warn=orange, error=red, fatal=bright red)

### Test Structure

Tests are located in `test/` directory (not `src/`):

- Uses Vitest with globals enabled
- Tests are excluded from TypeScript compilation (see tsconfig.json)
- Coverage excludes test files and dist output

## Build System

The project uses tsup for bundling:

- Outputs both CJS (`dist/index.js`) and ESM (`dist/index.mjs`) formats
- Generates TypeScript declaration files for both formats
- Includes sourcemaps and tree-shaking
- Entry point: `src/index.ts` (exports public API only)
