export function validateEmail(email) {
  const matchesEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return matchesEmailPattern;
};

export function validatePassword(password) {
  const validLength = 8 <= password.length && password.length <= 100;
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  
  return validLength && hasLowerCase && hasUpperCase && hasDigit;
};