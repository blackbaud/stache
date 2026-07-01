import { Component, input } from '@angular/core';

@Component({
  selector: 'sky-test-image-cmp',
  templateUrl: './image.component.fixture.html',
  standalone: false,
})
export class SkyImageTestComponent {
  public caption: string | undefined;

  public captionType = 'default';

  public imageAlt = '';

  public imageSource: string | undefined;

  public showBorder = input<boolean | undefined>(undefined);

  public showCaptionPrefix: boolean | undefined;
}
