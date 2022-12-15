import { Injectable } from '@angular/core';

import { Observable, ReplaySubject, fromEvent } from 'rxjs';

function getWindow(): any {
  return window;
}

/**
 * @internal
 */
@Injectable()
export class StacheWindowRef {
  public get nativeWindow(): any {
    return getWindow();
  }

  public get onResizeStream(): Observable<Window> {
    return this.#resizeSubject.asObservable();
  }

  public scrollEventStream = fromEvent<Event>(this.nativeWindow, 'scroll');

  #resizeSubject = new ReplaySubject<Window>();

  constructor() {
    this.nativeWindow.addEventListener('resize', (event: UIEvent) => {
      this.#onResize(event);
    });
  }

  #onResize(event: UIEvent): void {
    this.#resizeSubject.next(event.target as Window);
  }
}
