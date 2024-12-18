const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
} as const;

type LogLevel = keyof typeof LOG_LEVELS;

class Logger {
  private level: number = LOG_LEVELS.DEBUG;

  private formatMessage(level: LogLevel, message: string, ...args: unknown[]) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level}]`;
    
    if (args.length > 0) {
      console.group(prefix, message);
      args.forEach(arg => console.log(arg));
      console.groupEnd();
    } else {
      console.log(prefix, message);
    }
  }

  debug(message: string, ...args: unknown[]) {
    if (this.level <= LOG_LEVELS.DEBUG) {
      this.formatMessage('DEBUG', message, ...args);
    }
  }

  info(message: string, ...args: unknown[]) {
    if (this.level <= LOG_LEVELS.INFO) {
      this.formatMessage('INFO', message, ...args);
    }
  }

  warn(message: string, ...args: unknown[]) {
    if (this.level <= LOG_LEVELS.WARN) {
      this.formatMessage('WARN', message, ...args);
    }
  }

  error(message: string, ...args: unknown[]) {
    if (this.level <= LOG_LEVELS.ERROR) {
      this.formatMessage('ERROR', message, ...args);
    }
  }

  setLevel(level: LogLevel) {
    this.level = LOG_LEVELS[level];
  }
}

export const logger = new Logger();