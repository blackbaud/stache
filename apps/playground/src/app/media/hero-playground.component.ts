import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-hero-playground',
  templateUrl: './hero-playground.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroPlaygroundComponent {}
