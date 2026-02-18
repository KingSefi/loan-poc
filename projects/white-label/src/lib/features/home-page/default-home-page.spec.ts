import type { EnvironmentProviders, Provider } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BRAND_CONFIG, LOAN_CONFIG, LoanConfig } from 'core';

import { DefaultHomePage } from './default-home-page';

const MOCK_LOAN_CONFIG: LoanConfig = {
  minAmount: 1000,
  maxAmount: 50000,
  minTermMonths: 6,
  maxTermMonths: 60,
  purposes: ['Personal', 'Home Improvement'],
  incomeVerification: 'self-declared',
  requiresEmployerVerification: false,
};

describe('DefaultHomePage', () => {
  async function setup(options?: {
    brandName?: string;
    loanConfig?: LoanConfig;
  }): Promise<ComponentFixture<DefaultHomePage>> {
    const providers: (Provider | EnvironmentProviders)[] = [provideRouter([])];
    if (options?.brandName) {
      providers.push({
        provide: BRAND_CONFIG,
        useValue: { name: options.brandName, primaryColor: '#000', theme: 'dark' },
      });
    }
    if (options?.loanConfig) {
      providers.push({ provide: LOAN_CONFIG, useValue: options.loanConfig });
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
    const fixture = await setup({ brandName: 'PurpleBank' });
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
    const fixture = await setup({ loanConfig: MOCK_LOAN_CONFIG });
    const links = fixture.nativeElement.querySelectorAll('a');
    const startLink = Array.from(links).find((el) =>
      (el as HTMLElement).textContent?.includes('Start Application'),
    );
    expect(startLink).toBeTruthy();
  });
});
