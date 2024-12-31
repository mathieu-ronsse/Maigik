type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogMessage {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(message: LogMessage): string {
    return `[${message.timestamp}] [${message.level.toUpperCase()}] ${message.message}`;
  }

  private log(level: LogLevel, message: string, ...args: unknown[]): void {
    const logMessage: LogMessage = {
      level,
      message,
      data: args.length > 0 ? args : undefined,
      timestamp: new Date().toISOString()
    };

    if (level === 'debug' && !this.isDevelopment) {
      return;
    }

    const formattedMessage = this.formatMessage(logMessage);

    switch (level) {
      case 'debug':
        console.debug(formattedMessage, ...(args || []));
        break;
      case 'info':
        console.info(formattedMessage, ...(args || []));
        break;
      case 'warn':
        console.warn(formattedMessage, ...(args || []));
        break;
      case 'error':
        console.error(formattedMessage, ...(args || []));
        break;
    }
  }

  debug(message: string, ...args: unknown[]): void {
    this.log('debug', message, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    this.log('info', message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.log('warn', message, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    this.log('error', message, ...args);
  }
}

export const logger = new Logger();