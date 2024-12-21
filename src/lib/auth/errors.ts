// Custom error types for authentication
export class AuthError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export function getAuthErrorMessage(error: unknown): string {
  if (!error) return 'An unknown error occurred';

  // Handle Supabase auth errors
  if (typeof error === 'object' && error !== null) {
    const authError = error as { code?: string; message?: string };
    
    switch (authError.code) {
      case 'invalid_credentials':
        return 'Invalid email or password';
      case 'user_not_found':
        return 'No user found with this email';
      case 'email_taken':
        return 'An account with this email already exists';
      default:
        return authError.message || 'Authentication failed';
    }
  }

  return error instanceof Error ? error.message : 'Authentication failed';
}