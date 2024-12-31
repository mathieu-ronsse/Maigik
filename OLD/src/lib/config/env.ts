// Environment variable configuration
const ENV = {
  REPLICATE_API_TOKEN: import.meta.env.VITE_REPLICATE_API_TOKEN,
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  IS_DEV: import.meta.env.DEV,
} as const;

export type EnvVar = keyof typeof ENV;

export function getEnvVar(key: EnvVar): string {
  const value = ENV[key];
  
  if (!value) {
    throw new Error(
      `Environment variable ${key} is not defined. ` +
      `Make sure it's set in your .env file and prefixed with VITE_`
    );
  }
  
  return value;
}

// Validate all required environment variables on app initialization
export function validateEnv() {
  const required: EnvVar[] = [
    'REPLICATE_API_TOKEN',
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY'
  ];

  const missing = required.filter(key => !ENV[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n` +
      missing.map(key => `  - ${key}`).join('\n') +
      `\n\nMake sure they are defined in your .env file and prefixed with VITE_`
    );
  }
}