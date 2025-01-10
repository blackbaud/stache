import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'sky-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyVideoComponent {
  @Input()
  public set videoSource(value: string | undefined) {
    this.src = value
      ? this.#sanitizer.bypassSecurityTrustResourceUrl(value)
      : undefined;
    this.#changeDetector.markForCheck();
  }

  public src: SafeResourceUrl | undefined;

  #changeDetector: ChangeDetectorRef;

  #sanitizer: DomSanitizer;

  constructor(changeDetector: ChangeDetectorRef, sanitizer: DomSanitizer) {
    this.#changeDetector = changeDetector;
    this.#sanitizer = sanitizer;
  }
}
