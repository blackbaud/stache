import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'stache-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class StacheTutorialComponent {}
