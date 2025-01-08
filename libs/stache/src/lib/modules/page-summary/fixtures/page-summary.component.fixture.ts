import { Component, Input } from '@angular/core';

@Component({
  selector: 'stache-test-component',
  templateUrl: './page-summary.component.fixture.html',
  standalone: false,
})
export class StachePageSummaryTestComponent {
  @Input()
  public pageSummaryText: string | undefined;
}
