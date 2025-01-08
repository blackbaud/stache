import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-video-playground',
  templateUrl: './video-playground.component.html',
  styleUrls: ['./video-playground.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class VideoPlaygroundComponent {}
