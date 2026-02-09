import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandSwitcher } from './brand-switcher.component';

describe('BrandSwitcher', () => {
  let component: BrandSwitcher;
  let fixture: ComponentFixture<BrandSwitcher>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandSwitcher]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandSwitcher);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
