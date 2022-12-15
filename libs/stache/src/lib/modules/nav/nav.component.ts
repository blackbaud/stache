import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { StacheAuthService } from '../auth/auth.service';
import { StacheRouteService } from '../router/route.service';

import { StacheNav } from './nav';
import { StacheNavLink } from './nav-link';

@Component({
  selector: 'stache-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class StacheNavComponent implements OnDestroy, OnInit, StacheNav {
  @Input()
  public set routes(value: StacheNavLink[] | undefined) {
    this.#_routes = value;
    this.filteredRoutes = this.#filterRestrictedRoutes(
      value,
      this.#isAuthenticated
    );
    this.#assignActiveStates();
  }

  public get routes(): StacheNavLink[] | undefined {
    return this.#_routes;
  }

  @Input()
  public set navType(value: string | undefined) {
    this.#_navType = value;
    this.className = value ? `stache-nav-${value}` : undefined;
  }

  public get navType(): string | undefined {
    return this.#_navType;
  }

  set #isAuthenticated(value: boolean) {
    if (value !== this.#_isAuthenticated) {
      this.#_isAuthenticated = value;
      this.filteredRoutes = this.#filterRestrictedRoutes(this.routes, value);
    }
  }

  get #isAuthenticated(): boolean {
    return this.#_isAuthenticated;
  }

  public className: string | undefined;

  public filteredRoutes: StacheNavLink[] | undefined;

  #_isAuthenticated = false;
  #_navType: string | undefined;
  #_routes: StacheNavLink[] | undefined;
  #authSvc: StacheAuthService;
  #ngUnsubscribe = new Subject<void>();
  #routeSvc: StacheRouteService;

  public constructor(routeSvc: StacheRouteService, authSvc: StacheAuthService) {
    this.#routeSvc = routeSvc;
    this.#authSvc = authSvc;
  }

  public ngOnInit(): void {
    this.#assignActiveStates();

    this.#authSvc.isAuthenticated
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((isAuthenticated) => {
        this.#isAuthenticated = isAuthenticated;
      });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public hasRoutes(): boolean {
    return !!(this.filteredRoutes && this.filteredRoutes.length > 0);
  }

  public hasChildRoutes(route: StacheNavLink): boolean {
    return Array.isArray(route.children);
  }

  #assignActiveStates(): void {
    const activeUrl = this.#routeSvc.getActiveUrl();
    if (this.filteredRoutes) {
      this.filteredRoutes.forEach((route) => {
        route.isActive = this.#isActive(activeUrl, route);
        route.isCurrent = this.#isCurrent(activeUrl, route);
      });
    }
  }

  #isActive(activeUrl: string, route: StacheNavLink): boolean {
    let path = route.path;
    let navDepth: number;

    if (Array.isArray(path)) {
      navDepth = path.length;
      path = path.join('/');
    } else {
      navDepth = path.split('/').length;
    }

    if (path.indexOf('/') !== 0) {
      path = `/${path}`;
    }

    const isActiveParent =
      navDepth > 1 && `${activeUrl}/`.indexOf(`${path}/`) === 0;

    return isActiveParent || activeUrl === path;
  }

  #isCurrent(activeUrl: string, route: StacheNavLink): boolean {
    let path = route.path;

    if (Array.isArray(path)) {
      path = path.join('/');
    }

    return activeUrl === `/${path}`;
  }

  #filterRestrictedRoutes(
    routes: StacheNavLink[] | undefined,
    isAuthenticated: boolean
  ): StacheNavLink[] | undefined {
    if (!routes || routes.length === 0 || isAuthenticated) {
      return routes;
    }

    return routes.filter((route) => {
      return !route.restricted;
    });
  }
}
