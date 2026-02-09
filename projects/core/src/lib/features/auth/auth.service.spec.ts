import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';

import { AuthService } from './auth.service';
import { AUTH_CONFIG, AuthConfig } from './auth.tokens';

const mockConfig: AuthConfig = {
  provider: 'google',
  sessionDurationSeconds: 3600,
  loginUrl: '/api/auth/login',
};

describe('AuthService', () => {
  let service: AuthService;
  let httpSpy: { post: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    httpSpy = { post: vi.fn().mockReturnValue(of({ token: 'abc' })) };

    TestBed.configureTestingModule({
      providers: [
        { provide: AUTH_CONFIG, useValue: mockConfig },
        { provide: HttpClient, useValue: httpSpy },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose auth config', () => {
    expect(service.authConfig).toEqual(mockConfig);
  });

  it('should call login endpoint with provider', () => {
    service.login().subscribe();
    expect(httpSpy.post).toHaveBeenCalledWith('/api/auth/login', {
      provider: 'google',
    });
  });
});
