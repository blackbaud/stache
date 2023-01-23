import { Injectable, OnDestroy } from '@angular/core';
import { Route, Router, RouterPreloader } from '@angular/router';

import { Subscription } from 'rxjs';

import { numberConverter } from '../shared/input-converter';

import { StacheRouteMetadataConfig } from './route-metadata-config';
import { StacheRouteMetadataConfigJson } from './route-metadata-config-json';

/**
 * Returns metadata describing all routes that include `<stache>` tags, for the current SPA.
 * This metadata is used to construct all navigation components on the page (e.g. sidebar, breadcrumbs, etc.).
 */
@Injectable()
export class StacheRouteMetadataService implements OnDestroy {
  public metadata: StacheRouteMetadataConfig[] = [];
  public get routes(): Route[] {
    return this.#router.config;
  }

  #router: Router;
  #subscriptions = new Subscription();

  constructor(router: Router, preloader: RouterPreloader) {
    this.#router = router;
    this.#updateMetadata();
    this.#subscriptions.add(
      preloader.preload().subscribe(() => {
        this.#updateMetadata();
      })
    );
  }

  public ngOnDestroy(): void {
    this.#subscriptions.unsubscribe();
  }

  #updateMetadata(): void {
    const metadata: StacheRouteMetadataConfig[] = [];
    this.#router.config.forEach((route) => {
      this.#addRouteMetadata(metadata, route);
    });
    this.metadata = metadata;
  }

  #validateNavOrder(
    json: StacheRouteMetadataConfigJson
  ): StacheRouteMetadataConfig {
    if ('order' in json) {
      const order: number = numberConverter(json.order);
      json.order = order;
      if (order === undefined || order <= 0) {
        delete json.order;
      }
    }

    return json as StacheRouteMetadataConfig;
  }

  #addRouteMetadata(
    metadata: StacheRouteMetadataConfig[],
    route: Route,
    basePath = ''
  ): void {
    const path = basePath + route.path;
    const data: StacheRouteMetadataConfigJson = {
      path,
      ...route.data?.stache,
    };
    if (data) {
      const json = this.#validateNavOrder(data);
      json.path = path;
      metadata.push(json);
    }

    if (route.children) {
      route.children.forEach((childRoute) => {
        this.#addRouteMetadata(metadata, childRoute, path ? path + '/' : '');
      });
    }
  }
}
