import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'stache-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class StacheContainerComponent {}
