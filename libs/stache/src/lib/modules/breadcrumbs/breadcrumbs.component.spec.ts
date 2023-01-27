import { Component, NgModule } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@skyux-sdk/testing';

import { StacheBreadcrumbsComponent } from './breadcrumbs.component';
import { StacheBreadcrumbsModule } from './breadcrumbs.module';

@Component({ template: '' })
class TestComponent {}

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'async',
        component: TestComponent,
        data: { stache: { name: 'Async' } },
      },
    ]),
  ],
  exports: [RouterModule],
})
class TestModule {}

describe('StacheBreadcrumbsComponent', () => {
  let component: StacheBreadcrumbsComponent;
  let fixture: ComponentFixture<StacheBreadcrumbsComponent>;
  const baseRoutes = [
    {
      path: '',
      component: TestComponent,
      data: {
        stache: {
          name: 'Top Level',
        },
      },
      children: [
        {
          path: 'parent',
          component: TestComponent,
          data: {
            stache: {
              name: 'Parent Level',
            },
          },
          children: [
            {
              path: 'child',
              component: TestComponent,
              data: {
                stache: {
                  name: 'Child Level',
                },
              },
              children: [
                {
                  path: 'grandchild',
                  component: TestComponent,
                  data: {
                    stache: {
                      name: 'Grandchild Level',
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        RouterTestingModule.withRoutes(baseRoutes, {
          initialNavigation: 'disabled',
        }),
        StacheBreadcrumbsModule,
      ],
    });

    fixture = TestBed.createComponent(StacheBreadcrumbsComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should only have one route on base root path', () => {
    component.routes = undefined;
    TestBed.inject(Router).resetConfig([
      {
        path: '',
        children: [],
      },
    ]);
    fixture.detectChanges();
    const links = fixture.debugElement.queryAll(By.css('.stache-nav-anchor'));

    expect(links.length).toBe(1);
  });

  it('should display navigation links', () => {
    component.routes = [
      { name: 'Test 1', path: [] },
      { name: 'Test 2', path: [] },
    ];

    fixture.detectChanges();
    const links = fixture.debugElement.queryAll(By.css('.stache-nav-anchor'));

    expect(links.length).toBe(2);
  });

  it('should generate child routes from Router', async () => {
    const router = TestBed.inject(Router);
    router.resetConfig(baseRoutes[0].children);
    await fixture.ngZone.run(() => router.navigateByUrl('/parent/child'));
    component.ngOnInit();
    expect(component.routes?.length).toBe(3);
  });

  it('should not generate routes beyond the current path', async () => {
    const router = TestBed.inject(Router);
    await fixture.ngZone.run(() => router.navigateByUrl('/parent/child'));
    component.ngOnInit();
    expect(component.routes?.length).toBe(3);
  });

  it('should generate grandchild routes from Router', async () => {
    const router = TestBed.inject(Router);
    router.resetConfig(baseRoutes[0].children);
    await fixture.ngZone.run(() =>
      router.navigateByUrl('/parent/child/grandchild')
    );
    component.ngOnInit();
    expect(component.routes?.length).toBe(4);
  });

  it('should add a link to the home page', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.routes?.[0].name).toBe('Home');
  });

  it('should receive updates from route service', async () => {
    const router = TestBed.inject(Router);
    router.resetConfig([
      {
        ...baseRoutes[0],
        children: undefined,
        loadChildren: () => TestModule,
      },
    ]);
    await fixture.ngZone.run(() => router.navigateByUrl('/async'));
    component.ngOnInit();
    expect(component.routes?.length).toBe(2);
  });
});
