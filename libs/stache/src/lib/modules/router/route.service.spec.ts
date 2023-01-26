import { Component, NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  NavigationEnd,
  PreloadAllModules,
  Route,
  Router,
  RouterModule,
  RouterPreloader,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable, of as observableOf, of } from 'rxjs';

import { StacheRouteService } from './route.service';

class MockRouterPreloader {
  public preload(): Observable<any> {
    return observableOf({});
  }
}

@Component({ template: '' })
class MockComponent {}

@NgModule({
  imports: [
    RouterModule.forChild([{ path: 'async', component: MockComponent }]),
  ],
  exports: [RouterModule],
})
class MockRouterModule {}

const mockRoutes: Route[] = [
  {
    path: 'other-parent',
    component: MockComponent,
    data: {
      stache: {
        name: 'Custom Route Name',
      },
    },
    children: [
      {
        path: 'sub',
        component: MockComponent,
        data: {
          stache: {
            name: 'Subby McSubface',
          },
        },
      },
    ],
  },
  {
    path: 'order-routes',
    component: MockComponent,
    data: {
      stache: {
        name: 'Order Routes',
      },
    },
  },
  {
    path: 'order-routes/first',
    component: MockComponent,
    data: {
      stache: {
        name: 'A First',
      },
    },
  },
  {
    path: 'order-routes/first/order-two',
    component: MockComponent,
    data: {
      stache: {
        name: 'B Three',
        order: 2,
      },
    },
  },
  {
    path: 'order-routes/first/order-one',
    component: MockComponent,
    data: {
      stache: {
        name: 'Order One',
        order: 1,
      },
    },
  },
  {
    path: 'order-routes/first/order-five',
    component: MockComponent,
    data: {
      stache: {
        name: 'A',
      },
    },
  },
  {
    path: 'order-routes/first/order-three',
    component: MockComponent,
    data: {
      stache: {
        name: 'B Three',
        order: 3,
      },
    },
  },
  {
    path: 'order-routes/hidden-child',
    component: MockComponent,
    data: {
      stache: {
        name: 'Z Hidden Route',
        showInNav: false,
      },
    },
  },
  {
    path: 'order-routes/shown-child',
    component: MockComponent,
    data: {
      stache: {
        name: 'Z Shown route',
        showInNav: true,
      },
    },
  },
  {
    path: 'order-routes/third',
    component: MockComponent,
    data: {
      stache: {
        name: 'C Third',
      },
    },
  },
  {
    path: 'order-routes/second',
    component: MockComponent,
    data: {
      stache: {
        name: 'B Second',
      },
    },
  },
  {
    path: 'order-routes/fourth',
    component: MockComponent,
    data: {
      stache: {
        name: 'fourth route',
        order: 4,
      },
    },
  },
  {
    path: 'order-routes/first/hidden-child',
    component: MockComponent,
    data: {
      stache: {
        name: 'Hidden grandchild route',
        showInNav: false,
        order: 9999,
      },
    },
  },
  {
    path: 'order-routes/first/shown-child',
    component: MockComponent,
    data: {
      stache: {
        name: 'Shown grandchild route',
        showInNav: true,
        order: 99999,
      },
    },
  },
  {
    path: 'order-routes/first/sample',
    component: MockComponent,
    data: {
      stache: {
        name: 'A Three',
        order: 4,
      },
    },
  },
  {
    path: 'order-routes/first/order-four',
    component: MockComponent,
    data: {
      stache: {
        name: 'A Three',
        order: 3,
      },
    },
  },
  {
    path: 'order-routes/first/sample-two',
    component: MockComponent,
    data: {
      stache: {
        name: 'A Three',
        order: 999,
      },
    },
  },
  {
    path: 'order-routes/async',
    loadChildren: () => Promise.resolve(MockRouterModule),
  },
];

describe('StacheRouteService', () => {
  let routeService: StacheRouteService;
  let router: Router;
  let routerPreloader: MockRouterPreloader;

  async function setupTest(
    options: { routes?: Route[] | undefined } = {}
  ): Promise<void> {
    routerPreloader = new MockRouterPreloader();
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(
          'routes' in options ? options.routes : mockRoutes,
          { preloadingStrategy: PreloadAllModules }
        ),
      ],
      providers: [
        {
          provide: RouterPreloader,
          useValue: routerPreloader,
        },
      ],
    });
    router = TestBed.inject(Router);
    routeService = new StacheRouteService(
      router as Router,
      routerPreloader as RouterPreloader
    );
    await router.navigateByUrl('/other-parent');
  }

  it('should not include child routes from similar parents (a, a1, a2)', async () => {
    await setupTest();
    await router.navigateByUrl('/other-parent');
    const activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].children?.length).toBe(1);
  });

  it('should only assemble the active routes once', async () => {
    await setupTest();
    let activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].children?.length).toBe(1);

    const router = TestBed.inject(Router);
    router.resetConfig([]);

    activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].children?.length).toBe(1);
  });

  it('should not unset the active routes on NavigationEnd', async () => {
    await setupTest();
    (router as any).events = observableOf(new NavigationEnd(0, '', ''));
    spyOn(StacheRouteService.prototype, 'clearActiveRoutes');
    routeService = new StacheRouteService(
      router as Router,
      routerPreloader as RouterPreloader
    );
    expect(
      StacheRouteService.prototype.clearActiveRoutes
    ).not.toHaveBeenCalled();
  });

  it('should return the active URL', async () => {
    await setupTest();
    const url = routeService.getActiveUrl();
    expect(url).toBe(router.url);
  });

  it('should order routes in hierarchies', async () => {
    await setupTest();
    await router.navigateByUrl('/order-routes/first/order-one');
    const activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].path).toBe('order-routes');
    expect(activeRoutes[0].children?.[0].path).toBe('order-routes/first');
    expect(activeRoutes[0].children?.[0].children?.[0].path).toBe(
      'order-routes/first/order-one'
    );
  });

  it("should create the route's name from the path by default", async () => {
    await setupTest();
    await router.navigateByUrl('/order-routes/first/order-one');
    const activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].name).toBe('Order Routes');
    expect(activeRoutes[0].children?.[0].name).toBe('A First');
    expect(activeRoutes[0].children?.[0].children?.[0].name).toBe('Order One');
  });

  it("should use the route's name provided in route metadata service", async () => {
    await setupTest();
    await router.navigateByUrl('/other-parent');
    const activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].name).toBe('Custom Route Name');
  });

  it('should order routes alphabetically by name', async () => {
    await setupTest();
    await router.navigateByUrl('/order-routes');
    const activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].children?.[0].name).toBe('A First');
    expect(activeRoutes[0].children?.[2].name).toBe('C Third');
  });

  it('should filter out routes with showInNav: false', async () => {
    await setupTest();
    await router.navigateByUrl('/order-routes');
    const activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].children?.[0].name).toBe('A First');
    expect(activeRoutes[0].children?.[2].name).toBe('C Third');
    expect(activeRoutes[0].children).not.toContain({
      path: 'order-routes/hidden-child',
      children: [],
      name: 'Z Hidden Route',
      showInNav: false,
    });

    expect(activeRoutes[0].children).toContain({
      path: 'order-routes/shown-child',
      showInNav: true,
      name: 'Z Shown route',
      children: [],
    });
  });

  it('should arrange routes in their nav Order locations', async () => {
    await setupTest();
    await router.navigateByUrl('/order-routes');
    const activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].children?.[0].children?.[0].name).toBe('Order One');
    expect(activeRoutes[0].children?.[0].children?.[6].name).toBe('A Three');
  });

  it('should filter out all descendant routes containing showInNav: true', async () => {
    await setupTest();
    await router.navigateByUrl('/order-routes');
    const activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].children?.[0].children?.[0].name).toBe('Order One');
    expect(activeRoutes[0].children?.[0].children?.[6].name).toBe('A Three');
    expect(activeRoutes[0].children?.[0].children).not.toContain({
      path: 'order-routes/first/hidden-child',
      children: [],
      name: 'Hidden grandchild route',
      showInNav: true,
      order: 9999,
    });

    expect(activeRoutes[0].children?.[0].children).toContain({
      path: 'order-routes/first/shown-child',
      children: [],
      name: 'Shown grandchild route',
      showInNav: true,
      order: 99999,
    });
  });

  it('should order routes with the same navOrder alphabetically', async () => {
    await setupTest();
    await router.navigateByUrl('/order-routes');
    const activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].children?.[0].children?.[2].name).toBe('A Three');
    expect(activeRoutes[0].children?.[0].children?.[2].order).toBe(3);
    expect(activeRoutes[0].children?.[0].children?.[3].name).toBe('B Three');
    expect(activeRoutes[0].children?.[0].children?.[3].order).toBe(3);
  });

  it('should place routes in their assigned order, skipping non ordered routes', async () => {
    await setupTest();
    await router.navigateByUrl('/order-routes');
    const activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].children?.[0].children?.[5].name).toBe('A');
    expect(activeRoutes[0].children?.[0].children?.[5].order).toBe(undefined);
    expect(activeRoutes[0].children?.[0].children?.[6].name).toBe('A Three');
    expect(activeRoutes[0].children?.[0].children?.[6].order).toBe(999);
  });
});
