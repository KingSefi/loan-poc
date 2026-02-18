import { InjectionToken } from '@angular/core';

export interface AuthConfig {
  readonly provider: 'google' | 'microsoft' | 'github';
  readonly sessionDurationSeconds: number;
  readonly loginUrl: string;
}

export const AUTH_CONFIG = new InjectionToken<AuthConfig>('AUTH_CONFIG');
