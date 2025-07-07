import { Injectable, OnDestroy } from '@angular/core';

import { BehaviorSubject, Subject } from 'rxjs';
import { map, pairwise, takeUntil } from 'rxjs/operators';

import { StacheNavLink } from '../nav/nav-link';
import { StacheWindowRef } from '../shared/window-ref';

@Injectable()
export class StachePageAnchorService implements OnDestroy {
  public pageAnchorsStream = new Subject<StacheNavLink[]>();
  public pageAnchors: BehaviorSubject<StacheNavLink>[] = [];
  public refreshRequestedStream = new Subject<void>();
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private windowRef: StacheWindowRef) {
    this.windowRef.scrollEventStream
      .pipe(
        takeUntil(this.ngUnsubscribe),
        map((e) => this.windowRef.nativeWindow.document.body.scrollHeight),
        pairwise(),
      )
      .subscribe((height) => {
        if (height[0] !== height[1]) {
          this.refreshAnchors();
        }
      });
  }

  public addAnchor(anchorStream: BehaviorSubject<StacheNavLink>): void {
    anchorStream.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: () => {
        this.updateAnchorStream();
      },
      complete: () => {
        this.removeAnchor(anchorStream.getValue());
      },
    });

    this.pageAnchors.push(anchorStream);
    this.updateAnchorStream();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public refreshAnchors(): void {
    this.refreshRequestedStream.next();
  }

  public scrollToAnchor(elementId: string): void {
    const element = this.windowRef.nativeWindow.document.querySelector(
      `#${elementId}`,
    );
    /*istanbul ignore else*/
    if (element) {
      element.scrollIntoView();
    }
  }

  private removeAnchor(removedAnchor: StacheNavLink): void {
    this.pageAnchors = this.pageAnchors.filter(
      (anchor: BehaviorSubject<StacheNavLink>) => {
        return anchor.getValue().name !== removedAnchor.name;
      },
    );
  }

  private updateAnchorStream(): void {
    this.pageAnchors.sort(this.sortPageAnchors);
    this.pageAnchorsStream.next(
      this.pageAnchors.map((anchor) => anchor.getValue()),
    );
  }

  private sortPageAnchors(
    anchorA: BehaviorSubject<StacheNavLink>,
    anchorB: BehaviorSubject<StacheNavLink>,
  ): number {
    return anchorA.getValue().offsetTop - anchorB.getValue().offsetTop;
  }
}
