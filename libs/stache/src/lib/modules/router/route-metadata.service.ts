import { Inject, Injectable } from '@angular/core';

import { numberConverter } from '../shared/input-converter';

import { StacheRouteMetadataConfig } from './route-metadata-config';
import { STACHE_ROUTE_METADATA_SERVICE_CONFIG } from './route-metadata-service-config-token';

@Injectable()
export class StacheRouteMetadataService {
  constructor(
    @Inject(STACHE_ROUTE_METADATA_SERVICE_CONFIG)
    public metadata: StacheRouteMetadataConfig[]
  ) {
    this.metadata.forEach((route) => this.validateNavOrder(route));
  }

  private validateNavOrder(route: StacheRouteMetadataConfig): void {
    if ('order' in route) {
      route.order = numberConverter(route.order);
      if (route.order === undefined || route.order <= 0) {
        delete route.order;
      }
    }
  }
}
