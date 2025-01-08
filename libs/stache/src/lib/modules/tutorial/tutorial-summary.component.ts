import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'stache-tutorial-summary',
  templateUrl: './tutorial-summary.component.html',
  styleUrls: ['./tutorial-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class StacheTutorialSummaryComponent {}
