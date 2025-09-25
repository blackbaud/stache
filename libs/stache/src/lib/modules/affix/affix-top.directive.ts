import {
  AfterContentInit,
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
} from '@angular/core';

import { StacheViewportAdapterService } from '../shared/viewport-adapter.service';
import { StacheWindowRef } from '../shared/window-ref';

const AFFIX_CLASS_NAME = 'stache-affix-top';

@Directive({
  selector: '[stacheAffixTop]',
  standalone: false,
})
export class StacheAffixTopDirective
  implements AfterContentInit, AfterViewInit
{
  public isAffixed = false;

  #footerWrapper: HTMLElement | undefined;
  #viewportAdjustmentHeight = 0;
  #offsetTop = 0;
  #element: HTMLElement | undefined;

  #renderer: Renderer2;
  #elementRef: ElementRef;
  #viewportSvc: StacheViewportAdapterService;
  #windowRef: StacheWindowRef;

  constructor(
    renderer: Renderer2,
    elementRef: ElementRef,
    viewportService: StacheViewportAdapterService,
    windowRef: StacheWindowRef,
  ) {
    this.#renderer = renderer;
    this.#elementRef = elementRef;
    this.#viewportSvc = viewportService;
    this.#windowRef = windowRef;
  }

  public ngAfterViewInit(): void {
    const nativeElement = this.#elementRef.nativeElement;

    if (this.#isComponent(nativeElement) && nativeElement.children[0]) {
      this.#element = nativeElement.children[0];
    } else {
      this.#element = nativeElement;
    }
  }

  // This ensures that an element that should be affixed to the top on initial load is affixed.
  // In the AfterContentInit lifecycle hook to allow content to load if that affects positioning.
  public ngAfterContentInit(): void {
    this.onWindowScroll();
  }

  @HostListener('window:scroll')
  public onWindowScroll(): void {
    this.#viewportAdjustmentHeight = this.#viewportSvc.getHeight();
    this.#footerWrapper = this.#windowRef.nativeWindow.document.querySelector(
      '.stache-footer-wrapper',
    );
    this.#setMaxHeight();

    if (this.#element) {
      if (!this.isAffixed) {
        this.#offsetTop = this.#getOffset(this.#element);
      } else {
        this.#offsetTop = this.#element.offsetTop;
      }
    }

    const windowIsScrolledBeyondElement =
      this.#offsetTop - this.#viewportAdjustmentHeight <
      this.#windowRef.nativeWindow.pageYOffset;

    if (windowIsScrolledBeyondElement) {
      this.#affixToTop();
    } else {
      this.#resetElement();
    }
  }

  #isComponent(element: HTMLElement): boolean {
    let isComponent = false;

    Array.prototype.slice.call(element.attributes).forEach((item) => {
      if (!isComponent && item.name.indexOf('_nghost') === 0) {
        isComponent = true;
      }
    });

    return isComponent;
  }

  #getOffset(element: HTMLElement): number {
    let offset = element.offsetTop;
    let el = element;

    while (el.offsetParent) {
      const parent = el.offsetParent as HTMLElement;
      offset += parent.offsetTop;
      el = parent;
    }

    return offset;
  }

  #affixToTop(): void {
    if (!this.isAffixed && this.#element) {
      this.isAffixed = true;
      this.#renderer.setStyle(this.#element, 'position', 'fixed');
      this.#renderer.setStyle(this.#element, 'top', 'var(--sky-viewport-top)');
      this.#renderer.setStyle(this.#element, 'width', 'inherit');
      this.#renderer.addClass(this.#element, AFFIX_CLASS_NAME);
    }
  }

  #resetElement(): void {
    if (this.isAffixed) {
      this.isAffixed = false;
      this.#renderer.setStyle(this.#element, 'position', 'static');
      this.#renderer.removeStyle(this.#element, 'top');
      this.#renderer.removeClass(this.#element, AFFIX_CLASS_NAME);
    }
  }

  #setMaxHeight(): void {
    let maxHeight = `calc(100% - var(--sky-viewport-top))`;

    if (this.#footerWrapper && this.#footerIsVisible()) {
      maxHeight = `calc(${
        this.#getOffset(this.#footerWrapper) -
        this.#windowRef.nativeWindow.pageYOffset
      }px - var(--sky-viewport-top))`;
    }

    /* istanbul ignore else */
    if (this.#element) {
      this.#renderer.setStyle(this.#element, 'height', `${maxHeight}`);
    }
  }

  #footerIsVisible(): boolean {
    /*istanbul ignore else*/
    if (this.#footerWrapper) {
      return (
        this.#footerWrapper.getBoundingClientRect().top <=
        this.#windowRef.nativeWindow.innerHeight
      );
    } else {
      return false;
    }
  }
}
