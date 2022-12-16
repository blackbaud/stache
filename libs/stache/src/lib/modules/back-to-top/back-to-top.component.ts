import { Component, HostListener, Input } from '@angular/core';

import { StacheWindowRef } from '../shared/window-ref';

const DEFAULT_OFFSET = 200;

@Component({
  selector: 'stache-back-to-top',
  templateUrl: './back-to-top.component.html',
  styleUrls: ['./back-to-top.component.scss'],
})
export class StacheBackToTopComponent {
  @Input()
  public set offset(value: number | undefined) {
    this.#_offset = value ?? DEFAULT_OFFSET;
  }

  public get offset(): number {
    return this.#_offset;
  }

  public isHidden = true;

  #_offset = DEFAULT_OFFSET;
  #windowRef: StacheWindowRef;

  constructor(windowRef: StacheWindowRef) {
    this.#windowRef = windowRef;
  }

  @HostListener('window:scroll')
  public onWindowScroll(): void {
    this.isHidden = this.#windowRef.nativeWindow.pageYOffset < this.offset;
  }

  public scrollToTop(): void {
    this.#windowRef.nativeWindow.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}
