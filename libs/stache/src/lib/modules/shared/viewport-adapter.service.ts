import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

import { StacheWindowRef } from './window-ref';

const HAS_VIEWPORT_ADJUSTMENT_CLASS_NAME = 'stache-viewport-adjusted';

@Injectable()
export class StacheViewportAdapterService {
  #renderer: Renderer2;
  #windowRef: StacheWindowRef;

  constructor(windowRef: StacheWindowRef, rendererFactory: RendererFactory2) {
    this.#windowRef = windowRef;
    this.#renderer = rendererFactory.createRenderer(undefined, null);
  }

  public checkForViewportAdjustment(): void {
    if (this.viewportAdjusted()) {
      this.#applyClassToBody();
    }
  }

  public getHeight(): number {
    if (this.viewportAdjusted()) {
      return parseInt(
        getComputedStyle(
          this.#windowRef.nativeWindow.document.documentElement,
        ).getPropertyValue('--sky-viewport-top'),
        10,
      );
    }
    return 0;
  }

  public viewportAdjusted(): boolean {
    // Converts the element's existence to a boolean.
    return (
      parseInt(
        getComputedStyle(
          this.#windowRef.nativeWindow.document.documentElement,
        ).getPropertyValue('--sky-viewport-top'),
        10,
      ) > 0
    );
  }

  #applyClassToBody(): void {
    this.#renderer.addClass(
      this.#windowRef.nativeWindow.document.body,
      HAS_VIEWPORT_ADJUSTMENT_CLASS_NAME,
    );
  }
}
