import { Component, ViewChild, input } from '@angular/core';

import { SkyCopyToClipboardComponent } from '../clipboard.component';

@Component({
  selector: 'sky-clipboard-test',
  templateUrl: './clipboard.component.fixture.html',
  standalone: false,
})
export class SkyClipboardTestComponent {
  public ariaLabel = input<string | undefined>(undefined);

  public ariaLabelledBy = input<string | undefined>(undefined);

  public buttonType = input<'default' | 'icon-borderless'>('default');

  @ViewChild(SkyCopyToClipboardComponent)
  public copyToClipboardComponent!: SkyCopyToClipboardComponent;

  public title = input<string | undefined>(undefined);
}
