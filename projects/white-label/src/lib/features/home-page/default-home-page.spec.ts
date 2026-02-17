import type { EnvironmentProviders, Provider } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BRAND_CONFIG } from 'core';

import { DefaultHomePage } from './default-home-page';

describe('DefaultHomePage', () => {
  async function setup(brandName?: string): Promise<ComponentFixture<DefaultHomePage>> {
    const providers: (Provider | EnvironmentProviders)[] = [provideRouter([])];
    if (brandName) {
      providers.push({
        provide: BRAND_CONFIG,
        useValue: { name: brandName, primaryColor: '#000', theme: 'dark' },
      });
    }

    await TestBed.configureTestingModule({
      imports: [DefaultHomePage],
      providers,
    }).compileComponents();

    const fixture = TestBed.createComponent(DefaultHomePage);
    await fixture.whenStable();
    return fixture;
  }

  it('should create', async () => {
    const fixture = await setup();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows "App" when no BRAND_CONFIG', async () => {
    const fixture = await setup();
    const hero = fixture.nativeElement.querySelector('.hero');
    expect(hero.textContent).toContain('Welcome to App');
  });

  it('shows brand name when BRAND_CONFIG provided', async () => {
    const fixture = await setup('PurpleBank');
    const hero = fixture.nativeElement.querySelector('.hero');
    expect(hero.textContent).toContain('Welcome to PurpleBank');
  });

  it('renders 6 quick action cards', async () => {
    const fixture = await setup();
    const cards = fixture.nativeElement.querySelectorAll('.actions-grid .action-card');
    expect(cards.length).toBe(6);
  });

  it('renders 3 promo offer cards', async () => {
    const fixture = await setup();
    const cards = fixture.nativeElement.querySelectorAll('.promos-grid .promo-card');
    expect(cards.length).toBe(3);
  });

  it('renders net worth as currency', async () => {
    const fixture = await setup();
    const netWorth = fixture.nativeElement.querySelector('.net-worth');
    expect(netWorth.textContent).toContain('$184,620.45');
  });

  it('renders Start Application link', async () => {
    const fixture = await setup();
    const links = fixture.nativeElement.querySelectorAll('a');
    const startLink = Array.from(links).find((el) =>
      (el as HTMLElement).textContent?.includes('Start Application'),
    );
    expect(startLink).toBeTruthy();
  });
});
