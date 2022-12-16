import { Inject, Injectable } from '@angular/core';

import { numberConverter } from '../shared/input-converter';

import { StacheRouteMetadataConfig } from './route-metadata-config';
import { STACHE_ROUTE_METADATA_SERVICE_CONFIG } from './route-metadata-service-config-token';

/**
 * Returns metadata describing all routes that include `<stache>` tags, for the current SPA.
 * This metadata is used to construct all navigation components on the page (e.g. sidebar, breadcrumbs, etc.).
 * The `STACHE_ROUTE_METADATA_SERVICE_CONFIG` injection token is provided automatically by the Stache Builder plugin (SKY UX 4).
 * @see https://github.com/blackbaud/skyux-builder-plugin-stache/blob/master/src/plugins/route-metadata.js
 * The values are representative of all `<stache>` tags on the page and how they're configured.
 * For example, the following `<stache>` tag (on the 'src/app/foo/index.html' page) would produce the following metadata:
 * @example
 * ```html
 * <stache
 *   navTitle="Foo"
 *   [navOrder]="1"
 *   [showInNav]="true"
 *   >
 * ```
 * ```json
 * {
 *   "name": "Foo",
 *   "order": 1,
 *   "path": "/foo",
 *   "showInNav": true
 * }
 * ```
 */
@Injectable()
export class StacheRouteMetadataService {
  constructor(
    @Inject(STACHE_ROUTE_METADATA_SERVICE_CONFIG)
    public metadata: StacheRouteMetadataConfig[]
  ) {
    this.metadata.forEach((route) => this.#validateNavOrder(route));
  }

  #validateNavOrder(route: StacheRouteMetadataConfig): void {
    if ('order' in route) {
      const order: number = numberConverter(route.order);
      route.order = order;
      if (order === undefined || order <= 0) {
        delete route.order;
      }
    }
  }
}
