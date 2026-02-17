import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BRAND_CONFIG, MenuGroup, TOPNAV_CONFIG } from 'core';

import { DefaultTopNavLayout } from './topnav-layout';

const MOCK_MENUS: readonly MenuGroup[] = [
  { icon: 'home', label: 'Home', route: '/home' },
  {
    icon: 'account_balance',
    label: 'Accounts',
    children: [
      { icon: 'account_balance_wallet', label: 'Checking' },
      { icon: 'savings', label: 'Savings' },
    ],
  },
];

describe('DefaultTopNavLayout', () => {
  let fixture: ComponentFixture<DefaultTopNavLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultTopNavLayout],
      providers: [
        provideRouter([]),
        { provide: TOPNAV_CONFIG, useValue: MOCK_MENUS },
        {
          provide: BRAND_CONFIG,
          useValue: { name: 'TestBank', primaryColor: '#000', theme: 'dark' },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DefaultTopNavLayout);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders menu groups from config', () => {
    const megaNav = fixture.nativeElement.querySelector('.mega-nav');
    const buttons = megaNav.querySelectorAll('button, a');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it('groups with children render dropdown buttons', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.mega-nav button[mat-button]');
    const dropdownBtn = Array.from(buttons).find((btn) =>
      (btn as HTMLElement).textContent?.includes('Accounts'),
    );
    expect(dropdownBtn).toBeTruthy();
    expect((dropdownBtn as HTMLElement).textContent).toContain('arrow_drop_down');
  });

  it('groups without children render direct links', () => {
    const links = fixture.nativeElement.querySelectorAll('a[mat-button]');
    expect(links.length).toBe(1);
    expect(links[0].textContent).toContain('Home');
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
