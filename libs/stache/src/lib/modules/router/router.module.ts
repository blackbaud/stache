import { ModuleWithProviders, NgModule } from '@angular/core';
import { ROUTES, Router, Routes } from '@angular/router';

import { StacheRouteOptions } from './route-options';
import { StacheRouteService } from './route.service';

@NgModule({
  providers: [StacheRouteService],
})
export class StacheRouterModule {
  public static forChild(
    basePath: string,
  ): ModuleWithProviders<StacheRouterModule> {
    return {
      ngModule: StacheRouterModule,
      providers: [
        {
          provide: StacheRouteService,
          useFactory: (router: Router, routes: Routes): StacheRouteService => {
            const options: StacheRouteOptions = {
              basePath,
            };

            return new StacheRouteService(router, routes, options);
          },
          deps: [Router, ROUTES],
        },
      ],
    };
  }
}
