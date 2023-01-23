import { NgModule } from '@angular/core';

import { StacheRouteMetadataService } from './route-metadata.service';
import { StacheRouteService } from './route.service';

@NgModule({
  providers: [StacheRouteService, StacheRouteMetadataService],
})
export class StacheRouterModule {}
