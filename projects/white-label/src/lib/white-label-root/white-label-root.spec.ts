import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ROOT_LAYOUT_TOKEN } from 'core';

import { WhiteLabelRoot } from './white-label-root';

@Component({ selector: 'app-mock-layout', template: '<p>mock layout</p>' })
class MockLayout {}

describe('WhiteLabelRoot', () => {
  let component: WhiteLabelRoot;
  let fixture: ComponentFixture<WhiteLabelRoot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhiteLabelRoot],
      providers: [{ provide: ROOT_LAYOUT_TOKEN, useValue: MockLayout }],
    }).compileComponents();

    fixture = TestBed.createComponent(WhiteLabelRoot);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hold the provided layout component', () => {
    expect(component.layoutComponent).toBe(MockLayout);
  });
});
