import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Route, Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of as observableOf } from 'rxjs';

import { StacheRouteService } from './route.service';
import { StacheRouterModule } from './router.module';

@Component({
  template: '',
  standalone: false,
})
class MockComponent {}

const mockRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'foobar',
        component: MockComponent,
      },
    ],
  },
  {
    path: 'a',
    component: MockComponent,
    data: {
      stache: {
        name: 'A',
      },
    },
  },
  {
    path: 'a1',
    component: MockComponent,
    data: {
      stache: {
        name: 'A1',
      },
    },
  },
  {
    path: 'a2',
    component: MockComponent,
    data: {
      stache: {
        name: 'A2',
      },
    },
  },
  {
    path: 'order-routes-other',
    component: MockComponent,
    data: {
      stache: {
        name: 'Custom Route Name',
        order: 'woah',
      },
    },
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
        name: 'B Two',
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
        order: 444444,
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
];

describe('StacheRouteService', () => {
  let routeService: StacheRouteService;
  let router: Router;

  async function setupTest(
    options: { routes?: Routes | undefined } = {},
  ): Promise<void> {
    const routes: Routes | undefined =
      'routes' in options ? options.routes : mockRoutes;
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([].concat(...(routes || []))),
        StacheRouterModule,
      ],
    });
    router = TestBed.inject(Router);
    routeService = new StacheRouteService(router as Router, routes);
    await router.navigateByUrl('/order-routes/first/sample-two');
  }

  it('should not include child routes from similar parents (a, a1, a2)', async () => {
    await setupTest();
    spyOn(StacheRouteService.prototype, 'clearActiveRoutes');
    await router.navigateByUrl('/a');
    expect(StacheRouteService.prototype.clearActiveRoutes).toHaveBeenCalled();
    const activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].name).toBe('A');
  });

  it('should locate the nearest branch that includes the root route', async () => {
    await setupTest();
    spyOn(StacheRouteService.prototype, 'clearActiveRoutes');
    await router.navigateByUrl('/foobar');
    expect(StacheRouteService.prototype.clearActiveRoutes).toHaveBeenCalled();
    expect(routeService.getActiveRoutes()).toEqual([
      { path: 'foobar', name: 'Foobar', showInNav: true, children: [] },
    ]);
  });

  it('should only assemble the active routes once', async () => {
    await setupTest();
    let activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].children?.length).toBe(5);

    const router = TestBed.inject(Router);
    router.resetConfig([]);

    activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].children?.length).toBe(5);
  });

  it('should not unset the active routes on NavigationEnd', async () => {
    await setupTest();
    spyOn(StacheRouteService.prototype, 'clearActiveRoutes');
    await router.navigate(['a']);
    expect(
      StacheRouteService.prototype.clearActiveRoutes,
    ).toHaveBeenCalledTimes(1);
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
      'order-routes/first/order-one',
    );
  });

  it('should handle child routes of a single "root" route', async () => {
    const rootRoute: Route = {
      path: '',
      children: mockRoutes,
    };

    await setupTest({
      routes: [rootRoute],
    });

    await router.navigateByUrl('/order-routes/first/order-one');

    const activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].path).toBe('order-routes');
    expect(activeRoutes[0].children?.[0].path).toBe('order-routes/first');
    expect(activeRoutes[0].children?.[0].children?.[0].path).toBe(
      'order-routes/first/order-one',
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
    await router.navigateByUrl('/order-routes-other');
    const activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].name).toBe('Custom Route Name');
  });

  it('should order routes alphabetically by name', async () => {
    await setupTest();
    await router.navigateByUrl('/order-routes');
    const activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].children.map((c) => c.name)).toEqual([
      'A First',
      'B Second',
      'C Third',
      'Z Shown route',
      'fourth route',
    ]);
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

  it('should create without routes', () => {
    router = TestBed.inject(Router);
    routeService = new StacheRouteService(router as Router);
    expect(routeService).toBeTruthy();
  });

  it('should create with options', async () => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(mockRoutes)],
    });
    router = TestBed.inject(Router);
    routeService = new StacheRouteService(router as Router, mockRoutes, {
      basePath: 'order-routes',
    });
    expect(routeService).toBeTruthy();
    await router.navigateByUrl('/order-routes');
    const activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].name).toBe('Order Routes');
  });
});
