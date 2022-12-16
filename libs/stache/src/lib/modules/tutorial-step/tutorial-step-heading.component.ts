import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'stache-tutorial-step-heading',
  templateUrl: './tutorial-step-heading.component.html',
  styleUrls: ['./tutorial-step-heading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StacheTutorialStepHeadingComponent {}
