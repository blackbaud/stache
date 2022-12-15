import { Component, Input } from '@angular/core';

import { StacheNav } from '../nav/nav';
import { StacheNavLink } from '../nav/nav-link';
import { StacheNavService } from '../nav/nav.service';
import { StacheRouteService } from '../router/route.service';

let uniqueId = 0;

@Component({
  selector: 'stache-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class StacheSidebarComponent implements StacheNav {
  @Input()
  public set routes(value: StacheNavLink[] | undefined) {
    if (!value || !value.length || !Array.isArray(value)) {
      this.#_routes = this.#routeSvc.getActiveRoutes();
    } else {
      this.#_routes = value;
    }

    this.childRoutes = this.#filterRoutes(this.#_routes);
  }

  public childRoutes: StacheNavLink[] | undefined;
  public heading: string | undefined;
  public headingRoute: string | string[] | undefined;
  public sidebarHeadingElementId = `stache-sidebar-heading-${uniqueId++}`;

  #_routes: StacheNavLink[] = [];
  #routeSvc: StacheRouteService;
  #navSvc: StacheNavService;

  constructor(routeSvc: StacheRouteService, navSvc: StacheNavService) {
    this.#routeSvc = routeSvc;
    this.#navSvc = navSvc;
  }

  public isHeadingActive(): boolean {
    const url = this.#routeSvc.getActiveUrl();
    return url === this.headingRoute;
  }

  #filterRoutes(routes: StacheNavLink[]): StacheNavLink[] {
    const root = routes[0];

    let headingPath = Array.isArray(root.path)
      ? root.path.join('/')
      : root.path;
    headingPath = headingPath.replace(/^\//, '');

    this.heading = root.name;

    const prefix = this.#navSvc.isExternal(headingPath) ? '' : '/';
    this.headingRoute = `${prefix}${headingPath}`;

    return root.children || [];
  }
}
