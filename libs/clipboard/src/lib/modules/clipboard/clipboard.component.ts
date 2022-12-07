import {
  Component,
  Input,
  ChangeDetectorRef
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
  /**
   * Specifies an ARIA label for the copy to clipboard button
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * If the button includes a visible label outside of the button itself, use `ariaLabelledBy` instead.
   */
  @Input()
  public ariaLabel: string;

  /**
   * Specifies the HTML element ID (without the leading #) of the element that labels the copy to clipboard button. This sets the input's aria-labelledby attribute
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * If the button does not include a visible label outside of the button itself, use `ariaLabel` instead.
   */
   @Input()
   public ariaLabelledBy: string;

  /**
   * Specifies the HTMLElement which contains the content being copied.
   */
  @Input()
  public copyTarget: HTMLElement;

  /**
   * Specifies the label for the copy to clipboard button when the button has not been clicked.
   */
  @Input()
  public buttonText: string;

  /**
   * Specifies the label for the copy to clipboard button after the button has been clicked.
   */
  @Input()
  public buttonClickedText: string;

  /**
   * Specifies a title attribute for the copy to clipboard button.
   */
  @Input()
  public title: string;

  public buttonActive: boolean = false;
  private timeout: any;
  private window: Window;

  constructor(
    private clipboardService: SkyCopyToClipboardService,
    private windowRef: SkyAppWindowRef,
    private cdr: ChangeDetectorRef
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
      this.cdr.markForCheck();
    }, 1000);
  }
}
