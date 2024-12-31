export const logger = {
  debug: (...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.debug('[Debug]', ...args);
    }
  },
  info: (...args: unknown[]) => {
    console.info('[Info]', ...args);
  },
  error: (...args: unknown[]) => {
    console.error('[Error]', ...args);
  }
};