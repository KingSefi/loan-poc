import { TestBed } from '@angular/core/testing';
import { BRAND_CONFIG } from 'core';

import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  afterEach(() => {
    document.documentElement.className = '';
  });

  function createService(brandTheme?: 'light' | 'dark'): ThemeService {
    TestBed.configureTestingModule({
      providers: brandTheme
        ? [
            {
              provide: BRAND_CONFIG,
              useValue: { name: 'Test', primaryColor: '#000', theme: brandTheme },
            },
          ]
        : [],
    });
    return TestBed.inject(ThemeService);
  }

  it('initializes to light with no BRAND_CONFIG', () => {
    const service = createService();
    expect(service.theme()).toBe('light');
    expect(service.isDark()).toBe(false);
  });

  it('initializes to brand theme when BRAND_CONFIG provided', () => {
    const service = createService('dark');
    expect(service.theme()).toBe('dark');
    expect(service.isDark()).toBe(true);
  });

  it('toggle() switches light to dark and back', () => {
    const service = createService();
    expect(service.theme()).toBe('light');

    service.toggle();
    expect(service.theme()).toBe('dark');
    expect(service.isDark()).toBe(true);

    service.toggle();
    expect(service.theme()).toBe('light');
    expect(service.isDark()).toBe(false);
  });

  it('applies dark-theme / light-theme class on document.documentElement', () => {
    const service = createService();
    TestBed.flushEffects();

    expect(document.documentElement.classList.contains('light-theme')).toBe(true);
    expect(document.documentElement.classList.contains('dark-theme')).toBe(false);

    service.toggle();
    TestBed.flushEffects();

    expect(document.documentElement.classList.contains('dark-theme')).toBe(true);
    expect(document.documentElement.classList.contains('light-theme')).toBe(false);
  });

  it('applies and cleans up brandClass on document.documentElement', () => {
    const service = createService();
    TestBed.flushEffects();

    service.brandClass.set('purple-brand');
    TestBed.flushEffects();
    expect(document.documentElement.classList.contains('purple-brand')).toBe(true);

    service.brandClass.set(null);
    TestBed.flushEffects();
    expect(document.documentElement.classList.contains('purple-brand')).toBe(false);
  });
});
