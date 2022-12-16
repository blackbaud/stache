import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'stache-tutorial-heading',
  templateUrl: './tutorial-heading.component.html',
  styleUrls: ['./tutorial-heading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StacheTutorialHeadingComponent {}
