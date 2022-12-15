import { StaticProvider } from '@angular/core';

import { STACHE_JSON_DATA_SERVICE_CONFIG } from './json-data-service-config-token';
import { StacheJsonDataService } from './json-data.service';

export const STACHE_JSON_DATA_PROVIDERS: StaticProvider[] = [
  { provide: STACHE_JSON_DATA_SERVICE_CONFIG, useValue: {} },
  { provide: StacheJsonDataService, useClass: StacheJsonDataService },
];
