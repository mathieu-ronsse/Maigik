const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

const currentLevel = process.env.LOG_LEVEL ? LOG_LEVELS[process.env.LOG_LEVEL.toUpperCase()] : LOG_LEVELS.INFO;

function formatMessage(level, message, ...args) {
  const timestamp = new Date().toISOString();
  const formattedArgs = args.length ? '\n' + args.map(arg => JSON.stringify(arg, null, 2)).join('\n') : '';
  return `[${timestamp}] [${level}] ${message}${formattedArgs}`;
}

export const logger = {
  debug: (message, ...args) => {
    if (currentLevel <= LOG_LEVELS.DEBUG) {
      console.debug(formatMessage('DEBUG', message, ...args));
    }
  },
  
  info: (message, ...args) => {
    if (currentLevel <= LOG_LEVELS.INFO) {
      console.info(formatMessage('INFO', message, ...args));
    }
  },
  
  warn: (message, ...args) => {
    if (currentLevel <= LOG_LEVELS.WARN) {
      console.warn(formatMessage('WARN', message, ...args));
    }
  },
  
  error: (message, ...args) => {
    if (currentLevel <= LOG_LEVELS.ERROR) {
      console.error(formatMessage('ERROR', message, ...args));
      
      // For errors, also log the stack trace if available
      if (args[0] instanceof Error) {
        console.error(args[0].stack);
      }
    }
  }
};