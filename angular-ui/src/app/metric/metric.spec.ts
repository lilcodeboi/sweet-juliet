import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricComponent } from './metric';

describe('Metric', () => {
  let component: MetricComponent;
  let fixture: ComponentFixture<MetricComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MetricComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
