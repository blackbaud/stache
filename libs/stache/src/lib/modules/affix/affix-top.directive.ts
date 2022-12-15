import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
} from '@angular/core';

import { StacheOmnibarAdapterService } from '../shared/omnibar-adapter.service';
import { StacheWindowRef } from '../shared/window-ref';

const AFFIX_CLASS_NAME = 'stache-affix-top';

@Directive({
  selector: '[stacheAffixTop]',
})
export class StacheAffixTopDirective implements AfterViewInit {
  isAffixed = false;

  #footerWrapper: HTMLElement | undefined;
  #omnibarHeight = 0;
  #offsetTop = 0;
  #element: HTMLElement | undefined;

  #renderer: Renderer2;
  #elementRef: ElementRef;
  #omnibarSvc: StacheOmnibarAdapterService;
  #windowRef: StacheWindowRef;

  constructor(
    renderer: Renderer2,
    elementRef: ElementRef,
    omnibarSvc: StacheOmnibarAdapterService,
    windowRef: StacheWindowRef
  ) {
    this.#renderer = renderer;
    this.#elementRef = elementRef;
    this.#omnibarSvc = omnibarSvc;
    this.#windowRef = windowRef;
  }

  public ngAfterViewInit(): void {
    this.#footerWrapper = this.#windowRef.nativeWindow.document.querySelector(
      '.stache-footer-wrapper'
    );
    const nativeElement = this.#elementRef.nativeElement;

    if (this.#isComponent(nativeElement) && nativeElement.children[0]) {
      this.#element = nativeElement.children[0];
    } else {
      this.#element = nativeElement;
    }
  }

  @HostListener('window:scroll')
  public onWindowScroll(): void {
    this.#omnibarHeight = this.#omnibarSvc.getHeight();
    this.#setMaxHeight();

    if (this.#element && !this.isAffixed) {
      this.#offsetTop = this.#getOffset(this.#element);
    }

    const windowIsScrolledBeyondElement =
      this.#offsetTop - this.#omnibarHeight <=
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
    if (!this.isAffixed) {
      this.isAffixed = true;
      this.#renderer.setStyle(this.#element, 'position', 'fixed');
      this.#renderer.setStyle(this.#element, 'top', '0px');
      this.#renderer.setStyle(this.#element, 'width', 'inherit');
      this.#renderer.addClass(this.#element, AFFIX_CLASS_NAME);
    }
  }

  #resetElement(): void {
    if (this.isAffixed) {
      this.isAffixed = false;
      this.#renderer.setStyle(this.#element, 'position', 'static');
      this.#renderer.removeClass(this.#element, AFFIX_CLASS_NAME);
    }
  }

  #setMaxHeight(): void {
    let maxHeight = `calc(100% - ${this.#omnibarHeight}px)`;

    if (this.#footerWrapper && this.#footerIsVisible()) {
      maxHeight = `${
        this.#getOffset(this.#footerWrapper) -
        this.#windowRef.nativeWindow.pageYOffset -
        this.#omnibarHeight
      }px`;
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
