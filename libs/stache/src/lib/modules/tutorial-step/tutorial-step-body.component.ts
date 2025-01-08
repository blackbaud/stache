import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'stache-tutorial-step-body',
  templateUrl: './tutorial-step-body.component.html',
  styleUrls: ['./tutorial-step-body.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class StacheTutorialStepBodyComponent {}
