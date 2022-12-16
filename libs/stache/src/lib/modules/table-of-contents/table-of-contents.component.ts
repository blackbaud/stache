import { Component, Input, OnDestroy } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

import { StacheNavLink } from '../nav/nav-link';
import { StacheOmnibarAdapterService } from '../shared/omnibar-adapter.service';
import { StacheWindowRef } from '../shared/window-ref';

@Component({
  selector: 'stache-table-of-contents',
  templateUrl: './table-of-contents.component.html',
  styleUrls: ['./table-of-contents.component.scss'],
})
export class StacheTableOfContentsComponent implements OnDestroy {
  @Input()
  public routes: StacheNavLink[] | undefined;

  #documentBottom: number | undefined;
  #ngUnsubscribe = new Subject<void>();
  #omnibarSvc: StacheOmnibarAdapterService;
  #viewTop = 0;
  #windowRef: StacheWindowRef;

  constructor(
    windowRef: StacheWindowRef,
    omnibarSvc: StacheOmnibarAdapterService
  ) {
    this.#windowRef = windowRef;
    this.#omnibarSvc = omnibarSvc;
    this.#windowRef.scrollEventStream
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        this.#updateRoutesOnScroll(this.routes);
      });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  #updateRoutesOnScroll(routes: StacheNavLink[] | undefined): void {
    if (routes?.length) {
      this.#updateView(routes);
    }
  }

  #updateView(routes: StacheNavLink[]): void {
    this.#trackViewTop();
    this.#isCurrent(routes);
  }

  #trackViewTop(): void {
    this.#viewTop =
      this.#windowRef.nativeWindow.pageYOffset + this.#omnibarSvc.getHeight();
    this.#documentBottom = Math.round(
      this.#windowRef.nativeWindow.document.documentElement.getBoundingClientRect()
        .bottom
    );
  }

  #isCurrent(routes: StacheNavLink[]): void {
    if (this.#scrolledToEndOfPage()) {
      routes.forEach((route: StacheNavLink, idx: number) => {
        route.isCurrent = idx === routes.length - 1;
      });
    } else {
      routes.forEach((route, index) => {
        const nextRoute = routes[index + 1];
        if ((nextRoute && nextRoute.offsetTop) || 0 <= this.#viewTop) {
          route.isCurrent = false;
          return;
        }
        route.isCurrent = !!(route.offsetTop || 0 <= this.#viewTop);
      });
    }
  }

  #scrolledToEndOfPage(): boolean {
    return this.#documentBottom !== undefined
      ? this.#windowRef.nativeWindow.innerHeight + 5 >= this.#documentBottom
      : false;
  }
}
