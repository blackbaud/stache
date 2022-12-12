import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-stache-playground',
  templateUrl: './stache-playground.component.html',
  styleUrls: ['./stache-playground.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StachePlaygroundComponent {}
