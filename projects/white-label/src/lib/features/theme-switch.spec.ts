import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BRAND_CONFIG } from 'core';

import { ThemeService } from '../services/theme.service';
import { ThemeSwitch } from './theme-switch';

describe('ThemeSwitch', () => {
  let fixture: ComponentFixture<ThemeSwitch>;
  let themeService: ThemeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeSwitch],
      providers: [
        provideAnimationsAsync(),
        { provide: BRAND_CONFIG, useValue: { name: 'Test', primaryColor: '#000', theme: 'light' } },
      ],
    }).compileComponents();

    themeService = TestBed.inject(ThemeService);
    fixture = TestBed.createComponent(ThemeSwitch);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders a slide toggle', () => {
    const toggle = fixture.nativeElement.querySelector('mat-slide-toggle');
    expect(toggle).toBeTruthy();
  });

  it('toggle checked state reflects themeService.isDark()', () => {
    expect(themeService.isDark()).toBe(false);
    themeService.theme.set('dark');
    fixture.detectChanges();
    expect(themeService.isDark()).toBe(true);
  });
});
