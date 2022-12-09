import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-media-playground',
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaPlaygroundComponent {}
