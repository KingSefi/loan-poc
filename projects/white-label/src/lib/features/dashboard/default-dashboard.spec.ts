import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DefaultDashboard } from './default-dashboard';

describe('DefaultDashboard', () => {
  let fixture: ComponentFixture<DefaultDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultDashboard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DefaultDashboard);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders 4 account cards', () => {
    const cards = fixture.nativeElement.querySelectorAll('.accounts-grid mat-card');
    expect(cards.length).toBe(4);
  });

  it('renders transaction rows', () => {
    const rows = fixture.nativeElement.querySelectorAll('.tx-row');
    expect(rows.length).toBe(8);
  });

  it('renders Start Application link', () => {
    const links = fixture.nativeElement.querySelectorAll('a');
    const startLink = Array.from(links).find((el) =>
      (el as HTMLElement).textContent?.includes('Start Application'),
    );
    expect(startLink).toBeTruthy();
  });

  it('displays account balances as currency', () => {
    const firstCard = fixture.nativeElement.querySelector('.accounts-grid mat-card');
    expect(firstCard.textContent).toContain('$');
  });
});
