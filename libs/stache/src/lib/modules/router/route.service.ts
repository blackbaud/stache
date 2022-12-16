import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { SkyAppConfig } from '@skyux/config';

import { StacheNavLink } from '../nav/nav-link';

import { SkyAppConfigRoutes } from './app-config-routes';
import { StacheRouteMetadataConfig } from './route-metadata-config';
import { StacheRouteMetadataService } from './route-metadata.service';
import { sortByName, sortByOrder } from './sort';

interface UnformattedStacheNavLink {
  path: string;
  segments: string[];
  children?: UnformattedStacheNavLink[];
}

@Injectable()
export class StacheRouteService {
  #activeRoutes: StacheNavLink[] | undefined;
  #router: Router;
  #configSvc: SkyAppConfig;
  #routeMetadataSvc: StacheRouteMetadataService;

  constructor(
    router: Router,
    configSvc: SkyAppConfig,
    routeMetadataSvc: StacheRouteMetadataService
  ) {
    this.#router = router;
    this.#configSvc = configSvc;
    this.#routeMetadataSvc = routeMetadataSvc;

    router.events.subscribe((val) => {
      if (val instanceof NavigationStart) {
        this.clearActiveRoutes();
      }
    });
  }

  public getActiveRoutes(): StacheNavLink[] {
    if (this.#activeRoutes) {
      return this.#activeRoutes;
    }

    const rootPath = this.getActiveUrl().replace(/^\//, '').split('/')[0];

    const appRoutes = this.#clone(
      (this.#configSvc.runtime?.routes as SkyAppConfigRoutes[]) || []
    );

    const activeChildRoutes: UnformattedStacheNavLink[] = appRoutes
      .filter((route) => route.routePath.indexOf(rootPath) === 0)
      .map((route) => ({
        segments: route.routePath.split('/'),
        path: route.routePath,
      }));

    const activeRoutes: UnformattedStacheNavLink[] = [
      {
        path: rootPath,
        segments: [rootPath],
        children: this.#assignChildren(activeChildRoutes, rootPath),
      },
    ];

    this.#activeRoutes = this.#formatRoutes(activeRoutes);

    return this.#clone(this.#activeRoutes);
  }

  public getActiveUrl(): string {
    return this.#router.url.split('?')[0].split('#')[0];
  }

  public clearActiveRoutes(): void {
    this.#activeRoutes = undefined;
  }

  #clone<T>(thing: T): T {
    return JSON.parse(JSON.stringify(thing));
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
        return Object.assign(
          {},
          {
            path: route.path,
            children: route.children
              ? this.#formatRoutes(route.children)
              : undefined,
            name: this.#getNameFromPath(
              route.segments[route.segments.length - 1]
            ),
          },
          pathMetadata
        ) as StacheNavLink;
      })
      .filter((route) => route.showInNav !== false);

    return this.#sortRoutes(formatted) as StacheNavLink[];
  }

  #getMetadata(
    route: UnformattedStacheNavLink
  ): Partial<StacheRouteMetadataConfig> {
    const allMetadata = this.#routeMetadataSvc.metadata;

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
      const positionPreviouslyAssigned = (): boolean =>
        (sortedRoutes[newIdx].order || 9999) <= order;

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
