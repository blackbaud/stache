import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'sky-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyImageComponent {
  @Input()
  public caption: string | undefined;

  @Input()
  public captionType: string | undefined = 'default';

  @Input()
  public imageAlt: string | undefined = 'image';

  @Input()
  public imageSource: string | undefined;

  @Input()
  public showBorder: boolean | undefined = false;

  @Input()
  public set showCaptionPrefix(value: boolean | undefined) {
    this.#_showCaptionPrefix = value !== false;
  }

  public get showCaptionPrefix(): boolean {
    return this.#_showCaptionPrefix;
  }

  #_showCaptionPrefix = true;
}
