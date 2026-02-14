import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, Router } from '@angular/router';

import { BrandSwitcher } from './brand-switcher.component';

describe('BrandSwitcher', () => {
  let fixture: ComponentFixture<BrandSwitcher>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandSwitcher],
      providers: [provideAnimationsAsync(), provideRouter([])],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(BrandSwitcher);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('calls router.navigateByUrl on brand change', () => {
    const spy = vi.spyOn(router, 'navigateByUrl');
    fixture.componentInstance.onBrandChange({ value: '/purple' } as any);
    expect(spy).toHaveBeenCalledWith('/purple');
  });

  it('has aria-labels on toggle buttons', () => {
    const buttons = fixture.nativeElement.querySelectorAll('mat-button-toggle button');
    expect(buttons.length).toBe(2);
    for (const btn of buttons) {
      expect(btn.getAttribute('aria-label')).toBeTruthy();
    }
  });
});
