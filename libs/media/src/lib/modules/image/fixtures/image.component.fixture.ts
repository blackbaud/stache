import { Component } from '@angular/core';

@Component({
  selector: 'sky-test-image-cmp',
  templateUrl: './image.component.fixture.html',
})
export class SkyImageTestComponent {
  public caption: string | undefined;

  public captionType = 'default';

  public imageAlt = '';

  public imageSource: string | undefined;

  public showBorder: boolean | undefined;

  public showCaptionPrefix: boolean | undefined;
}
