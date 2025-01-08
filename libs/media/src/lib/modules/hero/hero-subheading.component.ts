import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'sky-hero-subheading',
  templateUrl: './hero-subheading.component.html',
  styleUrls: ['./hero-subheading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyHeroSubheadingComponent {
  @Input()
  public heroTextColor: string | undefined = '#fff';
}
