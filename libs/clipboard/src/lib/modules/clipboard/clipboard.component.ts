import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { SkyAppWindowRef } from '@skyux/core';

import { SkyCopyToClipboardService } from './clipboard.service';

@Component({
  selector: 'sky-copy-to-clipboard',
  templateUrl: './clipboard.component.html',
})
export class SkyCopyToClipboardComponent {
  /**
   * Specifies an ARIA label for the copy to clipboard button
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * If the button includes a visible label outside of the button itself, use `ariaLabelledBy` instead.
   */
  @Input()
  public ariaLabel: string | undefined;

  /**
   * Specifies the HTML element ID (without the leading #) of the element that labels the copy to clipboard button. This sets the input's aria-labelledby attribute
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * If the button does not include a visible label outside of the button itself, use `ariaLabel` instead.
   */
  @Input()
  public ariaLabelledBy: string | undefined;

  /**
   * Specifies the HTMLElement which contains the content being copied.
   */
  @Input()
  public copyTarget: HTMLElement | undefined;

  /**
   * Specifies the label for the copy to clipboard button when the button has not been clicked.
   */
  @Input()
  public buttonText: string | undefined;

  /**
   * Specifies the label for the copy to clipboard button after the button has been clicked.
   */
  @Input()
  public buttonClickedText: string | undefined;

  /**
   * Specifies a title attribute for the copy to clipboard button.
   */
  @Input()
  public title: string | undefined;

  public buttonActive = false;

  #changeDetector: ChangeDetectorRef;
  #clipboardSvc: SkyCopyToClipboardService;
  #timeout: number | undefined;
  #window: Window;

  constructor(
    changeDetector: ChangeDetectorRef,
    clipboardSvc: SkyCopyToClipboardService,
    windowRef: SkyAppWindowRef
  ) {
    this.#changeDetector = changeDetector;
    this.#clipboardSvc = clipboardSvc;
    this.#window = windowRef.nativeWindow;
  }

  public copyToClipboard(): void {
    if (this.copyTarget) {
      this.buttonActive = true;

      this.#clipboardSvc.copyContent(this.copyTarget);

      if (this.#timeout !== undefined) {
        this.#window.clearTimeout(this.#timeout);
      }

      this.#timeout = this.#window.setTimeout(() => {
        this.buttonActive = false;
        this.#changeDetector.markForCheck();
      }, 1000);
    }
  }
}
