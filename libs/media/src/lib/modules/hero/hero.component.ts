import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';

const DEFAULT_OPACITY = '0.4';

@Component({
  selector: 'sky-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyHeroComponent {
  @Input()
  public backgroundImageUrl: string | undefined;

  @Input()
  public set overlayOpacity(value: string | undefined) {
    const overlayOpacity = value || DEFAULT_OPACITY;
    const sanitized = overlayOpacity.replace(/[^\d.-]/g, '');
    const newValue = this.#parseInterval(sanitized).toString();
    this.#_overlayOpacity = newValue;
    this.#changeDetector.markForCheck();
  }

  public get overlayOpacity(): string {
    return this.#_overlayOpacity;
  }

  #changeDetector: ChangeDetectorRef;

  #_overlayOpacity = DEFAULT_OPACITY;

  constructor(changeDetector: ChangeDetectorRef) {
    this.#changeDetector = changeDetector;
  }

  #parseInterval(value: string): number {
    const interval = parseFloat(value);

    if (isNaN(interval)) {
      return 0.4;
    }

    if (interval > 100) {
      return 1;
    }

    if (interval < 0) {
      return 0;
    }

    if (interval % 1 > 0) {
      return interval;
    }

    return interval / 100;
  }
}
