import { Injectable, OnDestroy } from '@angular/core';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, pairwise, takeUntil } from 'rxjs/operators';

import { StacheNavLink } from '../nav/nav-link';
import { StacheWindowRef } from '../shared/window-ref';

@Injectable()
export class StachePageAnchorService implements OnDestroy {
  public get pageAnchorsStream(): Observable<StacheNavLink[]> {
    return this.#pageAnchorsStreamObs;
  }

  public get refreshRequestedStream(): Observable<void> {
    return this.#refreshRequestedStreamObs;
  }

  #pageAnchors$: BehaviorSubject<StacheNavLink>[] = [];

  #pageAnchorsStreamObs: Observable<StacheNavLink[]>;
  #pageAnchorsStream$ = new Subject<StacheNavLink[]>();

  #refreshRequestedStream$ = new Subject<void>();
  #refreshRequestedStreamObs: Observable<void>;

  #ngUnsubscribe = new Subject<void>();
  #windowRef: StacheWindowRef;

  constructor(windowRef: StacheWindowRef) {
    this.#windowRef = windowRef;
    this.#pageAnchorsStreamObs = this.#pageAnchorsStream$.asObservable();
    this.#refreshRequestedStreamObs =
      this.#refreshRequestedStream$.asObservable();

    windowRef.scrollEventStream
      .pipe(
        takeUntil(this.#ngUnsubscribe),
        map(() => windowRef.nativeWindow.document.body.scrollHeight),
        pairwise()
      )
      .subscribe((height) => {
        if (height[0] !== height[1]) {
          this.refreshAnchors();
        }
      });
  }

  public addAnchor(anchorStream: BehaviorSubject<StacheNavLink>): void {
    anchorStream.pipe(takeUntil(this.#ngUnsubscribe)).subscribe({
      next: () => {
        this.#updateAnchorStream();
      },
      complete: () => {
        this.#removeAnchor(anchorStream.getValue());
      },
    });

    this.#pageAnchors$.push(anchorStream);
    this.#updateAnchorStream();
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
    this.#pageAnchors$.forEach((o) => o.complete());
    this.#pageAnchorsStream$.complete();
    this.#refreshRequestedStream$.complete();
  }

  public refreshAnchors(): void {
    this.#refreshRequestedStream$.next();
  }

  public scrollToAnchor(elementId: string): void {
    const element = this.#windowRef.nativeWindow.document.querySelector(
      `#${elementId}`
    );
    /*istanbul ignore else*/
    if (element) {
      element.scrollIntoView();
    }
  }

  #removeAnchor(removedAnchor: StacheNavLink): void {
    this.#pageAnchors$ = this.#pageAnchors$.filter(
      (anchor: BehaviorSubject<StacheNavLink>) => {
        return anchor.getValue().name !== removedAnchor.name;
      }
    );
  }

  #updateAnchorStream(): void {
    this.#pageAnchors$.sort((a, b) => this.#sortPageAnchors(a, b));
    this.#pageAnchorsStream$.next(
      this.#pageAnchors$.map((anchor) => anchor.getValue())
    );
  }

  #sortPageAnchors(
    anchorA: BehaviorSubject<StacheNavLink>,
    anchorB: BehaviorSubject<StacheNavLink>
  ): number {
    return (
      (anchorA.getValue().offsetTop || 0) - (anchorB.getValue().offsetTop || 0)
    );
  }
}
