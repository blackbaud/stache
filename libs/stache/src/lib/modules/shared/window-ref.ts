import { Injectable, OnDestroy } from '@angular/core';

import { Observable, ReplaySubject, Subject, fromEvent, takeUntil } from 'rxjs';

function getWindow(): any {
  return window;
}

@Injectable()
export class StacheWindowRef implements OnDestroy {
  public get nativeWindow(): any {
    return getWindow();
  }

  public get onResizeStream(): Observable<Window> {
    return this.#resizeSubject.asObservable();
  }

  public scrollEventStream = fromEvent<Event>(this.nativeWindow, 'scroll');

  #ngUnsubscribe = new Subject<void>();
  #resizeSubject = new ReplaySubject<Window>();

  constructor() {
    fromEvent<UIEvent>(this.nativeWindow, 'resize')
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((evt) => this.#resizeSubject.next(evt.target as Window));
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }
}
