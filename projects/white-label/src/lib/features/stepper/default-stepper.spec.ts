import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultStepper } from './default-stepper';
import { StepDefinition } from './step-definition';

@Component({
  selector: 'sb-stepper-host',
  imports: [DefaultStepper],
  template: `
    <lib-default-stepper [steps]="steps()" [linear]="linear()" [orientation]="orientation()">
      @for (step of steps(); track step.label) {
        <ng-template>
          <p>Content for {{ step.label }}</p>
        </ng-template>
      }
    </lib-default-stepper>
  `,
})
class StepperHost {
  readonly steps = input<StepDefinition[]>([
    { label: 'Step 1' },
    { label: 'Step 2' },
    { label: 'Step 3' },
  ]);
  readonly linear = input(false);
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
}

describe('DefaultStepper', () => {
  let fixture: ComponentFixture<StepperHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepperHost],
    }).compileComponents();

    fixture = TestBed.createComponent(StepperHost);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders correct number of steps', () => {
    const stepHeaders = fixture.nativeElement.querySelectorAll('.mat-step-header');
    expect(stepHeaders.length).toBe(3);
  });

  it('displays step labels', () => {
    const labels = fixture.nativeElement.querySelectorAll('.mat-step-text-label');
    const texts = Array.from(labels).map((el) => (el as HTMLElement).textContent?.trim());
    expect(texts).toEqual(['Step 1', 'Step 2', 'Step 3']);
  });

  it('Next button navigates forward', async () => {
    const nextBtn = fixture.nativeElement.querySelector('[matStepperNext]') as HTMLButtonElement;
    expect(nextBtn).toBeTruthy();
    nextBtn.click();
    await fixture.whenStable();
    fixture.detectChanges();

    const stepper = fixture.nativeElement.querySelector('mat-stepper');
    const activeStep = stepper?.querySelector('.mat-step-header[aria-selected="true"]');
    const label = activeStep?.querySelector('.mat-step-text-label')?.textContent.trim();
    expect(label).toBe('Step 2');
  });

  it('Back button not visible on first step', () => {
    // On first step, the visible step content should not contain a Back button
    const stepperActions = fixture.nativeElement.querySelectorAll('.stepper-actions');
    const firstActions = stepperActions[0];
    const backBtn = firstActions?.querySelector('[matstepperprevious]');
    expect(backBtn).toBeNull();
  });
});
