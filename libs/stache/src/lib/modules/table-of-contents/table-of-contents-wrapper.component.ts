import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  Renderer2,
} from '@angular/core';

import { StacheNavLink } from '../nav/nav-link';
import { StacheWindowRef } from '../shared/window-ref';

const HAS_TOC_CLASS_NAME = 'stache-table-of-contents-enabled';

@Component({
  selector: 'stache-table-of-contents-wrapper',
  templateUrl: './table-of-contents-wrapper.component.html',
  styleUrls: ['./table-of-contents-wrapper.component.scss'],
  standalone: false,
})
export class StacheTableOfContentsWrapperComponent
  implements AfterViewInit, OnDestroy
{
  @Input()
  public tocRoutes: StacheNavLink[] | undefined;

  #renderer: Renderer2;
  #windowRef: StacheWindowRef;

  constructor(renderer: Renderer2, windowRef: StacheWindowRef) {
    this.#renderer = renderer;
    this.#windowRef = windowRef;
  }

  public ngAfterViewInit(): void {
    this.#addClassToBody();
  }

  public ngOnDestroy(): void {
    this.#removeClassFromBody();
  }

  #addClassToBody(): void {
    this.#renderer.addClass(
      this.#windowRef.nativeWindow.document.body,
      HAS_TOC_CLASS_NAME,
    );
  }

  #removeClassFromBody(): void {
    this.#renderer.removeClass(
      this.#windowRef.nativeWindow.document.body,
      HAS_TOC_CLASS_NAME,
    );
  }
}
