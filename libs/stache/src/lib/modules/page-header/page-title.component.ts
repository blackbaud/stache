import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'stache-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class StachePageTitleComponent {}
