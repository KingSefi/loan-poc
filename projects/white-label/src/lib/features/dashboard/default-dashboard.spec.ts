import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { DefaultDashboard } from './default-dashboard';

describe('DefaultDashboard', () => {
  let fixture: ComponentFixture<DefaultDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultDashboard],
      providers: [provideAnimationsAsync()],
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

  it('renders loan stepper with 4 steps', () => {
    const stepHeaders = fixture.nativeElement.querySelectorAll('.stepper-card .mat-step-header');
    expect(stepHeaders.length).toBe(4);
  });

  it('displays account balances as currency', () => {
    const firstCard = fixture.nativeElement.querySelector('.accounts-grid mat-card');
    expect(firstCard.textContent).toContain('$');
  });
});
