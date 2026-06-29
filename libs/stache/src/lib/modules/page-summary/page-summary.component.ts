import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'stache-page-summary',
  templateUrl: './page-summary.component.html',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class StachePageSummaryComponent {}
