import { AuthConfig } from 'core';

export const DEFAULT_AUTH_CONFIG: AuthConfig = {
  provider: 'google',
  sessionDurationSeconds: 1800,
  loginUrl: '/api/auth/login',
};
