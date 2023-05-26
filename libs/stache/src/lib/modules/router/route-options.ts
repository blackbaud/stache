import { InjectionToken } from '@angular/core';

export const STACHE_ROUTE_OPTIONS = new InjectionToken<StacheRouteOptions>(
  'StacheRouteOptions'
);

export interface StacheRouteOptions {
  basePath?: string;
}
