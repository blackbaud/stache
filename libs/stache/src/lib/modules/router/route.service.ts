import { Inject, Injectable, OnDestroy, Optional } from '@angular/core';
import { NavigationStart, ROUTES, Router, Routes } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { StacheNavLink } from '../nav/nav-link';
import { numberConverter } from '../shared/input-converter';

import { StacheRouteMetadataConfig } from './route-metadata-config';
import { StacheRouteMetadataConfigJson } from './route-metadata-config-json';
import { STACHE_ROUTE_OPTIONS, StacheRouteOptions } from './route-options';
import { sortByName, sortByOrder } from './sort';

type UnformattedStacheNavLink = {
  path: string;
  segments: string[];
  children?: UnformattedStacheNavLink[];
  data?: Partial<StacheRouteMetadataConfigJson>;
};

function clone<T>(thing: T): T {
  return JSON.parse(JSON.stringify(thing));
}

/**
 * The StacheRouteService assumes the consuming application's routes are "flat", without children.
 * For example:
 * ```
 * const routes: Routes = [
 *   {
 *     path: '',
 *     component: HomeComponent,
 *   },
 *   {
 *     path: 'design',
 *     component: DesignPlaygroundComponent,
 *     data: {
 *       stache: {
 *         name: 'Design',
 *       },
 *     },
 *   },
 *   {
 *     path: 'design/styles',
 *     component: StylesPlaygroundComponent,
 *     data: {
 *       stache: {
 *         name: 'Styles',
 *       },
 *     },
 *   },
 * ];
 * ```
 * Import the StacheRouterModule into lazy-loaded modules to give the Stache route service the desired route config.
 * For example:
 * ```
 * @NgModule({
 *   import: [
 *     RouterModule.forChild({...}),
 *     StacheRouterModule.forChild('my-top-level-route')
 *   ]
 * })
 * export class MyLazyLoadedModule {}
 * ```
 * Lazy loaded components will lose the context provided by StacheRouterModule.forChild(...)
 * You may override the StacheRouteOptions via a route provider to wire lazy components into navigation
 * ```
 *  const routes: Routes = [
 *  {
 *    path: 'lazy',
 *    loadComponent: () => import('./path/to/lazy.component'),
 *    providers: [
 *      { provide: StacheRouteOptions, useValue: {basePath: 'nested'}}
 *    ]
 *    data: {
 *      stache: {
 *        name: 'Lazy',
 *      },
 *    },
 *  },
 * ];
 * ```
 */
@Injectable()
export class StacheRouteService implements OnDestroy {
  #activeRoutes: StacheNavLink[] | undefined;
  #ngUnsubscribe = new Subject<void>();
  #options: StacheRouteOptions | undefined;
  #router: Router;
  #routes: Routes = [];

  constructor(
    router: Router,
    @Optional() @Inject(ROUTES) routes?: Routes,
    @Optional() @Inject(STACHE_ROUTE_OPTIONS) options?: StacheRouteOptions
  ) {
    this.#options = options;
    this.#router = router;
    this.#routes = ([] as Routes).concat(...(routes || []));

    router.events.pipe(takeUntil(this.#ngUnsubscribe)).subscribe((val) => {
      if (val instanceof NavigationStart) {
        this.clearActiveRoutes();
      }
    });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public getActiveRoutes(): StacheNavLink[] {
    if (this.#activeRoutes) {
      return this.#activeRoutes;
    }

    const rootPath = this.getActiveUrl().replace(/^\//, '').split('/')[0];

    const appRoutes = this.#options?.basePath
      ? this.#routes
      : this.#getRouteBranch(this.#routes, rootPath);

    const activeChildRoutes = appRoutes
      .filter((route) => {
        // If options.path is specified, it means that all routes are children
        // of the root path.
        return this.#options?.basePath || route.path?.indexOf(rootPath) === 0;
      })
      .map((route) => {
        const path = this.#prependOptionsPath(route.path);

        return {
          path,
          segments: path?.split('/'),
          data: route.data,
        };
      });

    const activeRoutes: UnformattedStacheNavLink[] = [
      {
        path: rootPath,
        segments: [rootPath],
        children: this.#assignChildren(activeChildRoutes, rootPath),
        data: activeChildRoutes.find((route) => route.path === rootPath)?.data,
      },
    ];

    this.#activeRoutes = this.#formatRoutes(activeRoutes);

    return clone(this.#activeRoutes);
  }

  public getActiveUrl(): string {
    return this.#router.url.split('?')[0].split('#')[0];
  }

  public clearActiveRoutes(): void {
    this.#activeRoutes = undefined;
  }

  /**
   * Recursively finds the "branch" of the routes tree that contains the given root path.
   */
  #getRouteBranch(routes: Routes, rootPath: string): Routes {
    const pathExistsInRoot = routes.some(
      (route) => route.path?.indexOf(rootPath) === 0
    );

    if (pathExistsInRoot) {
      return routes;
    }

    // Path not found, look in each route's children.
    for (const route of routes) {
      if (route.children) {
        const childRoutes = this.#getRouteBranch(route.children, rootPath);
        if (childRoutes.length > 0) {
          return childRoutes;
        }
      }
    }

    return [];
  }

  #prependOptionsPath(path: string | undefined): string | undefined {
    // If options.path is specified, all routes are children of the root path,
    // so prepend it to each path when building the path for navigation.
    if (this.#options?.basePath) {
      path = path
        ? `${this.#options.basePath}/${path}`
        : this.#options.basePath;
    }

    return path;
  }

  #assignChildren(
    routes: UnformattedStacheNavLink[],
    parentPath: string
  ): UnformattedStacheNavLink[] {
    const assignedRoutes: UnformattedStacheNavLink[] = [];
    const depth = parentPath.split('/').length + 1;

    routes.forEach((route) => {
      const routeDepth = route.segments.length;

      // Adding trailing slash to force end of parent path.  Otherwise:
      // a/child, a1/child, and a2/child would have all three children displayed under a.
      const isChildRoute =
        depth === routeDepth && route.path.indexOf(parentPath + '/') > -1;

      if (isChildRoute) {
        route.children = this.#assignChildren(routes, route.path);
        assignedRoutes.push(route);
      }
    });

    return assignedRoutes;
  }

  #formatRoutes(routes: UnformattedStacheNavLink[]): StacheNavLink[] {
    const formatted = routes
      .map((route) => {
        const pathMetadata = this.#validateNavOrder({
          ...route.data?.['stache'],
          showInNav: (route.data?.['stache']?.showInNav ?? true) as boolean,
        });
        const formattedRoute: StacheNavLink = Object.assign(
          {},
          {
            path: route.path,
            name: this.#getNameFromPath(
              route.segments[route.segments.length - 1]
            ),
          },
          pathMetadata
        );

        if (route.children) {
          formattedRoute.children = this.#formatRoutes(route.children);
        }

        return formattedRoute;
      })
      .filter((route) => route.showInNav !== false);

    return this.#sortRoutes(formatted) as StacheNavLink[];
  }

  #validateNavOrder(
    json: StacheRouteMetadataConfigJson
  ): StacheRouteMetadataConfig {
    if ('order' in json) {
      const order: number = numberConverter(json.order);
      json.order = order;
      if (order === undefined || order <= 0 || Number.isNaN(order)) {
        delete json.order;
      }
    }

    return json as StacheRouteMetadataConfig;
  }

  #getNameFromPath(path: string): string {
    path = path.replace(/-/g, ' ');
    return this.#toTitleCase(path);
  }

  #toTitleCase(phrase: string): string {
    return phrase
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  #sortRoutes(routes: StacheNavLink[]): StacheNavLink[] {
    const sortedRoutes = routes
      .filter((route) => !('order' in route))
      .sort(sortByName);

    const routesWithNavOrder = routes
      .filter((route) => 'order' in route)
      .sort(sortByName)
      .sort(sortByOrder);

    routesWithNavOrder.forEach((route) => {
      // We know route order is defined in this loop.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const order = route.order!;
      let newIdx = order - 1;
      const validPosition = (): boolean => newIdx < sortedRoutes.length;
      const positionPreviouslyAssigned = (): boolean => {
        return sortedRoutes[newIdx].order === undefined
          ? false
          : sortedRoutes[newIdx].order <= order;
      };

      if (validPosition()) {
        while (validPosition() && positionPreviouslyAssigned()) {
          newIdx++;
        }
        sortedRoutes.splice(newIdx, 0, route);
      } else {
        sortedRoutes.push(route);
      }
    });

    return sortedRoutes;
  }
}
