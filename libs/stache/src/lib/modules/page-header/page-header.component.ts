import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'stache-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class StachePageHeaderComponent {}
