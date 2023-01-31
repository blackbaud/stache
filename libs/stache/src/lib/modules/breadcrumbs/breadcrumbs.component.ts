import { Component, Input, OnInit } from '@angular/core';

import { StacheNav } from '../nav/nav';
import { StacheNavLink } from '../nav/nav-link';
import { StacheRouteService } from '../router/route.service';

@Component({
  selector: 'stache-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class StacheBreadcrumbsComponent implements StacheNav, OnInit {
  @Input()
  public routes: StacheNavLink[] | undefined;

  #routeSvc: StacheRouteService;

  constructor(routeSvc: StacheRouteService) {
    this.#routeSvc = routeSvc;
  }

  public ngOnInit(): void {
    if (!this.routes) {
      const activeRoutes = this.#routeSvc.getActiveRoutes();
      this.routes = this.#filterRoutes(activeRoutes);
    }
  }

  #filterRoutes(activeRoutes: StacheNavLink[]): StacheNavLink[] {
    const root = activeRoutes[0];
    const breadcrumbRoutes: StacheNavLink[] = [];

    breadcrumbRoutes.push({
      name: 'Home',
      path: '/',
    });

    if (!root) {
      return breadcrumbRoutes;
    }

    if (root.path !== '') {
      breadcrumbRoutes.push({
        name: root.name,
        path: root.path,
      });
    }

    const addRoute = (route: StacheNavLink): void => {
      breadcrumbRoutes.push({
        name: route.name,
        path: route.path,
      });

      if (route.children && route.children.length) {
        this.#findActiveBranch(route.children, addRoute);
      }
    };

    if (root.children) {
      this.#findActiveBranch(root.children, addRoute);
    }

    return breadcrumbRoutes;
  }

  #findActiveBranch(
    routes: StacheNavLink[],
    callback: (navLink: StacheNavLink) => void
  ): void {
    const activeUrl = `${this.#routeSvc.getActiveUrl()}/`;
    routes.forEach((route: StacheNavLink) => {
      if (activeUrl.indexOf(`/${route.path}/`) === 0) {
        callback(route);
      }
    });
  }
}
