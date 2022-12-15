import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { StacheWindowRef } from '../shared/window-ref';

import { StacheNavLink } from './nav-link';

type StacheRoute = Omit<StacheNavLink, 'name'>;

@Injectable()
export class StacheNavService {
  #router: Router;
  #windowRef: StacheWindowRef;

  constructor(router: Router, windowRef: StacheWindowRef) {
    this.#router = router;
    this.#windowRef = windowRef;
  }

  public navigate(route: StacheRoute): void {
    const extras: NavigationExtras = { queryParamsHandling: 'merge' };
    const currentPath = this.#router.url.split('?')[0].split('#')[0];

    if (this.isExternal(route)) {
      this.#windowRef.nativeWindow.location.href = route.path;
      return;
    }

    if (route.fragment) {
      if (this.#isCurrentRoute(route.path, currentPath)) {
        this.#navigateInPage(route.fragment);
        return;
      }
      extras.fragment = route.fragment;
    }

    if (Array.isArray(route.path)) {
      this.#router.navigate(route.path, extras);
    } else {
      this.#router.navigate([route.path], extras);
    }
  }

  public isExternal(route: StacheRoute | string): boolean {
    return typeof route === 'string'
      ? /^(https?|mailto|ftp):+|^(www)/.test(route)
      : false;
  }

  #isCurrentRoute(routePath: string | string[], currentPath: string): boolean {
    let path = routePath;

    if (Array.isArray(path)) {
      path = path.join('/');
    }

    return (
      path === '.' || currentPath.replace(/^\//, '') === path.replace(/^\//, '')
    );
  }

  #navigateInPage(fragment: string): void {
    const element =
      this.#windowRef.nativeWindow.document.getElementById(fragment);
    if (element) {
      element.scrollIntoView();
      this.#windowRef.nativeWindow.location.hash = fragment;
    } else {
      // The current page is the path intended, but no element with the fragment exists, scroll to
      // the top of the page.
      this.#windowRef.nativeWindow.scroll(0, 0);
    }
  }
}
