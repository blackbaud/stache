import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { StacheTutorialStepComponent } from './tutorial-step.component';
import { StacheTutorialStepModule } from './tutorial-step.module';

describe('StacheTutorialStepComponent', () => {
  let component: StacheTutorialStepComponent;
  let fixture: ComponentFixture<StacheTutorialStepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StacheTutorialStepModule],
    });

    fixture = TestBed.createComponent(StacheTutorialStepComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should default to showing numbers', () => {
    expect(component.showNumber).toBe(true);
  });

  it('should reset the showNumber input', () => {
    component.showNumber = false;
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.stache-tutorial-step'),
    ).not.toHaveClass('stache-tutorial-step-numbered');

    component.showNumber = undefined;
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.stache-tutorial-step'),
    ).toHaveClass('stache-tutorial-step-numbered');
  });
});
