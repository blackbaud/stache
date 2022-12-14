// adapted from ngx-clipboard
import { Injectable } from '@angular/core';
import { SkyAppWindowRef } from '@skyux/core';

@Injectable()
export class SkyCopyToClipboardService {
  #windowRef: SkyAppWindowRef;

  constructor(windowRef: SkyAppWindowRef) {
    this.#windowRef = windowRef;
  }

  public copyContent(element: HTMLElement): void {
    const copyText = this.#getTextFromElement(element);
    this.#windowRef.nativeWindow.navigator.clipboard.writeText(copyText);
  }

  #getTextFromElement(element: HTMLElement): string | undefined {
    if (this.#isValidInputElement(element)) {
      const targetEl = element as HTMLInputElement | HTMLTextAreaElement;
      return targetEl.value;
    }

    return element.textContent?.trim();
  }

  #isValidInputElement(element: HTMLElement): boolean {
    return (
      element instanceof HTMLTextAreaElement ||
      element instanceof HTMLInputElement
    );
  }
}
