import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sky-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyCodeComponent {}
