import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-image-playground',
  templateUrl: './image-playground.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImagePlaygroundComponent {}
