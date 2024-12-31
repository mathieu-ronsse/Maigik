export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= 6;
}

export function getValidationErrors(email: string, password: string): string[] {
  const errors: string[] = [];

  if (!validateEmail(email)) {
    errors.push('Please enter a valid email address');
  }

  if (!validatePassword(password)) {
    errors.push('Password must be at least 6 characters long');
  }

  return errors;
}