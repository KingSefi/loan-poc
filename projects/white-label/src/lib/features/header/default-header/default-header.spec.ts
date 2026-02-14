import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BRAND_CONFIG } from 'core';

import { DefaultHeader } from './default-header';

describe('DefaultHeader', () => {
  async function setup(
    brandName?: string,
    titleOverride?: string,
  ): Promise<ComponentFixture<DefaultHeader>> {
    const providers: any[] = [provideAnimationsAsync()];
    if (brandName) {
      providers.push({
        provide: BRAND_CONFIG,
        useValue: { name: brandName, primaryColor: '#000', theme: 'light' },
      });
    }

    await TestBed.configureTestingModule({
      imports: [DefaultHeader],
      providers,
    }).compileComponents();

    const fixture = TestBed.createComponent(DefaultHeader);
    if (titleOverride) {
      fixture.componentRef.setInput('title', titleOverride);
    }
    await fixture.whenStable();
    return fixture;
  }

  it('should create', async () => {
    const fixture = await setup();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows "App" when no BRAND_CONFIG', async () => {
    const fixture = await setup();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('App');
  });

  it('shows brand name when BRAND_CONFIG provided', async () => {
    const fixture = await setup('GreenBank');
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('GreenBank');
  });

  it('shows custom title when title input set', async () => {
    const fixture = await setup('GreenBank', 'My Custom Title');
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('My Custom Title');
    expect(text).not.toContain('GreenBank');
  });

  it('toggleMenu() flips menuOpen signal', async () => {
    const fixture = await setup();
    const component = fixture.componentInstance;
    expect(component.menuOpen()).toBe(false);
    component.toggleMenu();
    expect(component.menuOpen()).toBe(true);
    component.toggleMenu();
    expect(component.menuOpen()).toBe(false);
  });

  it('aria-expanded reflects menuOpen state', async () => {
    const fixture = await setup();
    const btn = fixture.nativeElement.querySelector('button[aria-label="Toggle navigation menu"]');
    expect(btn.getAttribute('aria-expanded')).toBe('false');

    fixture.componentInstance.toggleMenu();
    fixture.detectChanges();
    expect(btn.getAttribute('aria-expanded')).toBe('true');
  });
});
