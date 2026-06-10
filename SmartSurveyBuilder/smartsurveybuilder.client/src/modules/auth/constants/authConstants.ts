// Auth API Endpoints
export const AUTH_API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  REFRESH: '/api/auth/refresh',
  REGISTER: '/api/auth/register',
  VERIFY_EMAIL: '/api/auth/verify-email',
  VALIDATE: '/api/auth/validate',
} as const;

// Auth Error Messages
export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  WEAK_PASSWORD: 'Password is too weak',
  NETWORK_ERROR: 'Network error. Please try again',
  UNKNOWN_ERROR: 'An unknown error occurred',
  USER_INACTIVE: 'User account is inactive',
  TOKEN_EXPIRED: 'Token has expired',
} as const;

// Auth Success Messages
export const AUTH_SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logged out successfully',
  REGISTER_SUCCESS: 'Registration successful',
} as const;

// Auth Local Storage Keys
export const AUTH_STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
} as const;

