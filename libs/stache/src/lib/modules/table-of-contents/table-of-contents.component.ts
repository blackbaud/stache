import { Component, Input, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { StacheNavLink } from '../nav/nav-link';
import { StacheViewportAdapterService } from '../shared/viewport-adapter.service';
import { StacheWindowRef } from '../shared/window-ref';

@Component({
  selector: 'stache-table-of-contents',
  templateUrl: './table-of-contents.component.html',
  styleUrls: ['./table-of-contents.component.scss'],
  standalone: false,
})
export class StacheTableOfContentsComponent implements OnDestroy {
  @Input()
  public routes: StacheNavLink[] | undefined;

  #documentBottom: number | undefined;
  #ngUnsubscribe = new Subject<void>();
  #viewportService: StacheViewportAdapterService;
  #viewTop = 0;
  #windowRef: StacheWindowRef;

  constructor(
    windowRef: StacheWindowRef,
    viewportSvc: StacheViewportAdapterService,
  ) {
    this.#windowRef = windowRef;
    this.#viewportService = viewportSvc;
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
      this.#windowRef.nativeWindow.pageYOffset +
      this.#viewportService.getHeight();
    this.#documentBottom = Math.round(
      this.#windowRef.nativeWindow.document.documentElement.getBoundingClientRect()
        .bottom,
    );
  }

  #isCurrent(routes: StacheNavLink[]): void {
    if (this.#scrolledToEndOfPage()) {
      routes.forEach((route: StacheNavLink, idx: number) => {
        route.isCurrent = idx === routes.length - 1;
      });
      return;
    }
    routes.forEach((route, index) => {
      const nextRoute = routes[index + 1];
      if (nextRoute && (nextRoute.offsetTop || 0) <= this.#viewTop) {
        route.isCurrent = false;
        return;
      }
      if (route.offsetTop === undefined) {
        route.isCurrent = false;
      } else {
        route.isCurrent = !!(route.offsetTop <= this.#viewTop);
      }
    });
  }

  #scrolledToEndOfPage(): boolean {
    /*istanbul ignore else*/
    if (this.#documentBottom !== undefined) {
      return (
        this.#windowRef.nativeWindow.innerHeight + 5 >= this.#documentBottom
      );
    } else {
      return false;
    }
  }
}
