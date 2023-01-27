import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { StacheRouteService } from './route.service';

@Component({
  selector: 'stache-route-test',
  template: `<router-outlet></router-outlet>`,
})
class MockRouteComponent {}

describe('StacheRouteService', () => {
  async function navigateToRoute(route: string): Promise<void> {
    TestBed.inject(Router).navigate([route]);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    await fixture.whenStable();
  }

  let fixture: ComponentFixture<MockRouteComponent>;
  let routeService: StacheRouteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockRouteComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: '',
            component: MockRouteComponent,
          },
          {
            path: 'order-routes',
            component: MockRouteComponent,
          },
          {
            path: 'order-routes/first',
            component: MockRouteComponent,
            data: {
              stache: {
                name: 'A First',
              },
            },
          },
          {
            path: 'order-routes/first/order-one',
            component: MockRouteComponent,
            data: {
              stache: {
                order: 1,
                name: 'Order One',
              },
            },
          },
          {
            path: 'order-routes/first/order-two',
            component: MockRouteComponent,
            data: {
              stache: {
                order: 2,
                name: 'B Three',
              },
            },
          },
          {
            path: 'order-routes/first/order-three',
            component: MockRouteComponent,
            data: {
              stache: {
                order: 3,
                name: 'B Three',
              },
            },
          },
          {
            path: 'order-routes/first/order-four',
            component: MockRouteComponent,
            data: {
              stache: {
                order: 3,
                name: 'A Three',
              },
            },
          },
          {
            path: 'order-routes/first/order-five',
            component: MockRouteComponent,
            data: {
              stache: {
                name: 'A',
              },
            },
          },
          {
            path: 'order-routes/first/sample',
            component: MockRouteComponent,
            data: {
              stache: {
                order: 4,
                name: 'A Three',
              },
            },
          },
          {
            path: 'order-routes/first/sample-two',
            component: MockRouteComponent,
            data: {
              stache: {
                order: 999,
                name: 'A Three',
              },
            },
          },
          {
            path: 'order-routes/first/hidden-child',
            component: MockRouteComponent,
            data: {
              stache: {
                showInNav: false,
                name: 'Hidden grandchild route',
                order: 9999,
              },
            },
          },
          {
            path: 'order-routes/first/shown-child',
            component: MockRouteComponent,
            data: {
              stache: {
                showInNav: true,
                name: 'Shown grandchild route',
                order: 99999,
              },
            },
          },
          {
            path: 'order-routes/third',
            component: MockRouteComponent,
            data: {
              stache: {
                name: 'C Third',
              },
            },
          },
          {
            path: 'order-routes/second',
            component: MockRouteComponent,
            data: {
              stache: {
                name: 'B Second',
              },
            },
          },
          {
            path: 'order-routes/fourth',
            component: MockRouteComponent,
            data: {
              stache: {
                name: 'fourth route',
                order: 4,
              },
            },
          },
          {
            path: 'order-routes/shown-child',
            component: MockRouteComponent,
            data: {
              stache: {
                showInNav: true,
                name: 'Z Shown route',
              },
            },
          },
          {
            path: 'order-routes/hidden-child',
            component: MockRouteComponent,
            data: {
              stache: {
                showInNav: false,
                name: 'Z Hidden Route',
              },
            },
          },
          {
            path: 'parent',
            component: MockRouteComponent,
          },
          {
            path: 'parent/child',
            component: MockRouteComponent,
          },
          {
            path: 'parent/child/grandchild',
            component: MockRouteComponent,
          },
          {
            path: 'parent/child/grandchild/grand-grandchild',
            component: MockRouteComponent,
          },
          {
            path: 'other-parent',
            component: MockRouteComponent,
            data: {
              stache: {
                name: 'Custom Route Name',
              },
            },
          },
          {
            path: 'other-parent/other-child',
            component: MockRouteComponent,
          },
          {
            path: 'other-parent/other-child/other-grandchild',
            component: MockRouteComponent,
          },
          {
            path: 'testing-children',
            component: MockRouteComponent,
          },
          {
            path: 'testing-children/child',
            component: MockRouteComponent,
          },
          {
            path: 'testing-children1',
            component: MockRouteComponent,
          },
          {
            path: 'testing-children1/child',
            component: MockRouteComponent,
          },
          {
            path: 'testing-children2',
            component: MockRouteComponent,
          },
          {
            path: 'testing-children2/child',
            component: MockRouteComponent,
          },
        ]),
      ],
      providers: [StacheRouteService],
    });

    fixture = TestBed.createComponent(MockRouteComponent);
    routeService = TestBed.inject(StacheRouteService);
  });

  it('should not include child routes from similar parents (a, a1, a2)', async () => {
    await navigateToRoute('testing-children');
    const activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].children?.length).toBe(1);
  });

  it('should return the active URL', async () => {
    await navigateToRoute('testing-children/child');
    const url = routeService.getActiveUrl();
    expect(url).toBe('/testing-children/child');
  });

  it('should order routes in hierarchies', async () => {
    await navigateToRoute('parent');
    const activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].path).toBe('parent');
    expect(activeRoutes[0].children?.[0].path).toBe('parent/child');
    expect(activeRoutes[0].children?.[0].children?.[0].path).toBe(
      'parent/child/grandchild'
    );
  });

  it("should create the route's name from the path by default", async () => {
    await navigateToRoute('parent');
    const activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].name).toBe('Parent');
    expect(activeRoutes[0].children?.[0].name).toBe('Child');
    expect(activeRoutes[0].children?.[0].children?.[0].name).toBe('Grandchild');
  });

  it("should use the route's name provided in route metadata service", async () => {
    await navigateToRoute('other-parent');
    const activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].name).toBe('Custom Route Name');
  });

  it('should order routes alphabetically by name', async () => {
    await navigateToRoute('order-routes');
    const activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].children?.[0].name).toBe('A First');
    expect(activeRoutes[0].children?.[2].name).toBe('C Third');
  });

  it('should filter out routes with showInNav: false', async () => {
    await navigateToRoute('order-routes');
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
    await navigateToRoute('order-routes');
    const activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].children?.[0].children?.[0].name).toBe('Order One');
    expect(activeRoutes[0].children?.[0].children?.[6].name).toBe('A Three');
  });

  it('should filter out all descendant routes containing showInNav: true', async () => {
    await navigateToRoute('order-routes');
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
    await navigateToRoute('order-routes');
    const activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].children?.[0].children?.[2].name).toBe('A Three');
    expect(activeRoutes[0].children?.[0].children?.[2].order).toBe(3);
    expect(activeRoutes[0].children?.[0].children?.[3].name).toBe('B Three');
    expect(activeRoutes[0].children?.[0].children?.[3].order).toBe(3);
  });

  it('should place routes in their assigned order, skipping non ordered routes', async () => {
    await navigateToRoute('order-routes');
    const activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].children?.[0].children?.[5].name).toBe('A');
    expect(activeRoutes[0].children?.[0].children?.[5].order).toBe(undefined);
    expect(activeRoutes[0].children?.[0].children?.[6].name).toBe('A Three');
    expect(activeRoutes[0].children?.[0].children?.[6].order).toBe(999);
  });
});
