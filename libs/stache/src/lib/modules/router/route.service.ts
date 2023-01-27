import { Injectable, OnDestroy } from '@angular/core';
import {
  NavigationStart,
  Route,
  RouteConfigLoadEnd,
  Router,
  RouterPreloader,
} from '@angular/router';

import {
  Observable,
  Subject,
  concatAll,
  filter,
  from,
  mergeAll,
  of,
  takeUntil,
} from 'rxjs';

import { StacheNavLink } from '../nav/nav-link';
import { numberConverter } from '../shared/input-converter';

import { StacheRouteMetadataConfig } from './route-metadata-config';
import { StacheRouteMetadataConfigJson } from './route-metadata-config-json';
import { sortByName, sortByOrder } from './sort';

type UnformattedStacheNavLink = {
  path: string;
  segments: string[];
  children?: UnformattedStacheNavLink[];
};

function clone<T>(thing: T): T {
  return JSON.parse(JSON.stringify(thing));
}

@Injectable()
export class StacheRouteService implements OnDestroy {
  #activeRoutes: StacheNavLink[] | undefined;
  #metadata: StacheRouteMetadataConfig[] = [];
  #ngUnsubscribe = new Subject<void>();
  #router: Router;

  constructor(router: Router, preloader: RouterPreloader) {
    this.#router = router;
    from([
      from([of(undefined), preloader.preload()]).pipe(
        takeUntil(this.#ngUnsubscribe),
        concatAll()
      ),
      this.#router.events.pipe(
        takeUntil(this.#ngUnsubscribe),
        filter((e) => e instanceof RouteConfigLoadEnd)
      ),
    ])
      .pipe(mergeAll())
      .subscribe(() => {
        this.#addRouteMetadata('', ...this.#router.config).subscribe();
      });

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

    const appRoutes = this.#metadata;

    const activeChildRoutes: UnformattedStacheNavLink[] = appRoutes
      .filter((route) => route.path.indexOf(rootPath) === 0)
      .map((route) => ({
        segments: route.path.split('/'),
        path: route.path,
      }));

    const activeRoutes: UnformattedStacheNavLink[] = [
      {
        path: rootPath,
        segments: [rootPath],
        children: this.#assignChildren(activeChildRoutes, rootPath),
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
        const pathMetadata = this.#getMetadata(route);
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

  #addRouteMetadata(
    basePath: string,
    ...routes: (Route & { _loadedRoutes?: Route[] })[]
  ): Observable<void> {
    return from(
      routes.map((route) => {
        const path = [basePath, route.path].filter((p) => !!p).join('/');
        const data: StacheRouteMetadataConfigJson | undefined = route.data
          ? route.data['stache']
          : undefined;
        if (
          data &&
          (data.order || data.name) &&
          !this.#metadata.find((m) => m.path === path)
        ) {
          const json = this.#validateNavOrder({ ...data, path });
          this.#metadata.push(json);
        }

        const childRoutes = route.children || route._loadedRoutes || [];
        if (childRoutes.length > 0) {
          return this.#addRouteMetadata(path, ...childRoutes);
        }
        return of(undefined);
      })
    ).pipe(takeUntil(this.#ngUnsubscribe), mergeAll());
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

  #getMetadata(
    route: UnformattedStacheNavLink
  ): Partial<StacheRouteMetadataConfig> {
    const allMetadata = this.#metadata;

    if (allMetadata) {
      const foundRoute = allMetadata.filter((metaRoute) => {
        return metaRoute.path === route.path;
      })[0];

      if (foundRoute) {
        return foundRoute;
      }
    }

    return {};
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
