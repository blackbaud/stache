import {
  Component,
  Input
} from '@angular/core';

import {
  SkyAppWindowRef
} from '@skyux/core';

import {
  SkyCopyToClipboardService
} from './clipboard.service';

@Component({
  selector: 'sky-copy-to-clipboard',
  templateUrl: './clipboard.component.html'
})
export class SkyCopyToClipboardComponent {
  @Input()
  public copyTarget: HTMLElement;

  @Input()
  public buttonText: string;

  @Input()
  public buttonClickedText: string;

  public buttonActive: boolean = false;
  private timeout: any;
  private window: Window;

  constructor(
    private clipboardService: SkyCopyToClipboardService,
    private windowRef: SkyAppWindowRef
  ) {
    this.window = this.windowRef.nativeWindow;
  }

  public copyToClipboard() {
    this.buttonActive = true;
    this.clipboardService.copyContent(this.copyTarget);

    if (this.timeout) {
      this.window.clearTimeout(this.timeout);
    }

    this.timeout = this.window.setTimeout(() => {
      this.buttonActive = false;
    }, 1000);
  }
}
