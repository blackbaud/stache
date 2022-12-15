import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

import { StacheWindowRef } from './window-ref';

const HAS_OMNIBAR_CLASS_NAME = 'stache-omnibar-enabled';
const EXPECTED_OMNIBAR_HEIGHT = 50;

@Injectable()
export class StacheOmnibarAdapterService {
  #renderer: Renderer2;
  #element: HTMLElement;
  #windowRef: StacheWindowRef;

  constructor(windowRef: StacheWindowRef, rendererFactory: RendererFactory2) {
    this.#windowRef = windowRef;
    this.#renderer = rendererFactory.createRenderer(undefined, null);
    this.#element = windowRef.nativeWindow.document.querySelector(
      '.sky-omnibar-iframe'
    );
  }

  public checkForOmnibar(): void {
    if (this.omnibarEnabled()) {
      this.#applyClassToBody();
    }
  }

  public getHeight(): number {
    if (this.omnibarEnabled()) {
      return EXPECTED_OMNIBAR_HEIGHT;
    }
    return 0;
  }

  public omnibarEnabled(): boolean {
    // Converts the element's existence to a boolean.
    return !!this.#element;
  }

  #applyClassToBody(): void {
    this.#renderer.addClass(
      this.#windowRef.nativeWindow.document.body,
      HAS_OMNIBAR_CLASS_NAME
    );
  }
}
