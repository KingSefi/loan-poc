import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';

import { AUTH_CONFIG, AuthConfig } from './auth.tokens';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(AUTH_CONFIG);

  get authConfig(): AuthConfig {
    return this.config;
  }

  login(): Observable<unknown> {
    return this.http.post(this.config.loginUrl, {
      provider: this.config.provider,
    });
  }

  logout(): Observable<unknown> {
    return of(undefined);
  }
}
