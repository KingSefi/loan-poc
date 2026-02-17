import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BRAND_CONFIG, SIDENAV_CONFIG, SidenavSection } from 'core';

import { DefaultSidenavLayout } from './sidenav-layout';

const MOCK_SECTIONS: readonly SidenavSection[] = [
  {
    header: 'Overview',
    items: [
      { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
      { icon: 'account_balance', label: 'Accounts', route: '/accounts' },
    ],
  },
  {
    header: 'Services',
    items: [{ icon: 'payment', label: 'Payments', route: '/payments' }],
  },
];

describe('DefaultSidenavLayout', () => {
  let fixture: ComponentFixture<DefaultSidenavLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultSidenavLayout],
      providers: [
        provideRouter([]),
        { provide: SIDENAV_CONFIG, useValue: MOCK_SECTIONS },
        {
          provide: BRAND_CONFIG,
          useValue: { name: 'TestBank', primaryColor: '#000', theme: 'light' },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DefaultSidenavLayout);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders section headers from config', () => {
    const subheaders = fixture.nativeElement.querySelectorAll('[mat-subheader]');
    const texts = Array.from(subheaders).map((el) => (el as HTMLElement).textContent?.trim());
    expect(texts).toEqual(['Overview', 'Services']);
  });

  it('renders nav items with correct labels', () => {
    const items = fixture.nativeElement.querySelectorAll('a[mat-list-item]');
    expect(items.length).toBe(3);
    const labels = Array.from(items).map((el) => {
      const span = (el as HTMLElement).querySelector('span:not(mat-icon)');
      return span?.textContent?.trim();
    });
    expect(labels).toContain('Dashboard');
    expect(labels).toContain('Accounts');
    expect(labels).toContain('Payments');
  });

  it('renders dividers between sections but not before first', () => {
    const dividers = fixture.nativeElement.querySelectorAll('mat-divider');
    expect(dividers.length).toBe(1);
  });

  it('includes default-header', () => {
    const header = fixture.nativeElement.querySelector('lib-default-header');
    expect(header).toBeTruthy();
  });

  it('includes router-outlet', () => {
    const outlet = fixture.nativeElement.querySelector('router-outlet');
    expect(outlet).toBeTruthy();
  });
});
