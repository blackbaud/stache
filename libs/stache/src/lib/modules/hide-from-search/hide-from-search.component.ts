import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'stache-hide-from-search',
  templateUrl: './hide-from-search.component.html',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class StacheHideFromSearchComponent {}
