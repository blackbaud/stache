import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Route } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';
import { SkyAppConfig } from '@skyux/config';

import { StacheNavLink } from '../nav/nav-link';
import { StacheWindowRef } from '../shared/window-ref';

import { TableOfContentsTestComponent } from './fixtures/toc-test.component';
import { TableOfContentsTestModule } from './fixtures/toc-test.module';

describe('StacheTableOfContentsComponent', () => {
  function setupTest(options: {
    /**
     * The window's scroll offset.
     */
    pageYOffset?: number;
    /**
     * Routes to use in the table of contents component.
     */
    routes: StacheNavLink[];
  }): {
    fixture: ComponentFixture<TableOfContentsTestComponent>;
    windowRef: StacheWindowRef;
  } {
    options = { ...{ pageYOffset: 0 }, ...options };

    TestBed.configureTestingModule({
      imports: [
        TableOfContentsTestModule,
        RouterTestingModule.withRoutes(
          options.routes.map((route) => {
            return {
              path: route.path,
              component: TableOfContentsTestComponent,
              data: {
                stache: {
                  name: route.name,
                  order: route.order,
                  showInNav: route.showInNav,
                },
              },
            } as Route;
          }),
        ),
      ],
      providers: [{ provide: SkyAppConfig, useValue: {} }],
    });

    const fixture = TestBed.createComponent(TableOfContentsTestComponent);
    const windowRef = TestBed.inject(StacheWindowRef);

    spyOnProperty(windowRef.nativeWindow, 'pageYOffset').and.returnValue(
      options.pageYOffset,
    );

    fixture.componentInstance.tocRoutes = options.routes;

    return { fixture, windowRef };
  }

  function makeDocumentHeightGreaterThanViewportHeight(
    windowRef: StacheWindowRef,
  ): void {
    spyOnProperty(windowRef.nativeWindow, 'innerHeight').and.returnValue(900);
    spyOn(
      windowRef.nativeWindow.document.documentElement,
      'getBoundingClientRect',
    ).and.returnValue({ bottom: 5000 });
  }

  function makeDocumentHeightEqualToViewportHeight(
    windowRef: StacheWindowRef,
  ): void {
    const height = 200;
    spyOnProperty(windowRef.nativeWindow, 'innerHeight').and.returnValue(
      height,
    );
    spyOn(
      windowRef.nativeWindow.document.documentElement,
      'getBoundingClientRect',
    ).and.returnValue({ bottom: height });
  }

  function scrollWindow(
    fixture: ComponentFixture<unknown>,
    windowRef: StacheWindowRef,
  ): void {
    SkyAppTestUtility.fireDomEvent(windowRef.nativeWindow, 'scroll');
    fixture.detectChanges();
  }

  /**
   * Verifies if the given index represents the "current" route.
   * If 'undefined' is provided to the index value, then no routes should be "current".
   */
  function verifyCurrentRoute(
    tocRoutes: StacheNavLink[],
    index: number | undefined,
  ): void {
    let i = 0;
    for (const route of tocRoutes) {
      expect(route.isCurrent).toEqual(i === index);
      i++;
    }
  }

  it('should render the component', () => {
    const { fixture } = setupTest({
      routes: [],
    });

    expect(fixture).toExist();
  });

  it('should active routes when the window scrolls', () => {
    const routeOffsetTop = 100;

    const routes: StacheNavLink[] = [
      {
        name: 'Foo',
        path: '',
        fragment: '#foo',
        offsetTop: 0,
      },
      {
        name: 'Bar',
        path: '',
        fragment: '#bar',
        offsetTop: routeOffsetTop,
      },
      {
        name: 'Bar',
        path: '',
        fragment: '#bar',
        offsetTop: routeOffsetTop + 100,
      },
    ];

    const { fixture, windowRef } = setupTest({
      // Make sure scroll offsets are greater than the route's offset.
      pageYOffset: routeOffsetTop + 1,
      routes,
    });

    fixture.detectChanges();

    makeDocumentHeightGreaterThanViewportHeight(windowRef);
    scrollWindow(fixture, windowRef);
    verifyCurrentRoute(routes, 1);
  });

  it('should set last anchor as "current" if the scrollbar reaches the bottom of the document', () => {
    const lastRouteOffsetTop = 200;

    const routes: StacheNavLink[] = [
      {
        name: 'Foo',
        path: '',
        fragment: '#foo',
        offsetTop: 0,
      },
      {
        name: 'Bar',
        path: '',
        fragment: '#bar',
        offsetTop: 100,
      },
      {
        name: 'Baz',
        path: '',
        fragment: '#baz',
        offsetTop: lastRouteOffsetTop,
      },
    ];

    const { fixture, windowRef } = setupTest({
      // Scroll beyond the last route's offset.
      pageYOffset: lastRouteOffsetTop + 1,
      routes,
    });

    fixture.detectChanges();

    makeDocumentHeightEqualToViewportHeight(windowRef);
    scrollWindow(fixture, windowRef);
    verifyCurrentRoute(routes, routes.length - 1);
  });

  it('should handle routes without an offsetTop', () => {
    const routes: StacheNavLink[] = [
      {
        name: 'Foo',
        path: '',
        fragment: '#foo',
      },
      {
        name: 'Bar',
        path: '',
        fragment: '#bar',
      },
      {
        name: 'Baz',
        path: '',
        fragment: '#baz',
      },
    ];

    const { fixture, windowRef } = setupTest({
      pageYOffset: 200,
      routes,
    });

    fixture.detectChanges();

    makeDocumentHeightGreaterThanViewportHeight(windowRef);
    scrollWindow(fixture, windowRef);
    verifyCurrentRoute(routes, undefined);
  });

  it('should be accessible', async () => {
    const { fixture } = setupTest({
      routes: [
        {
          name: 'Foo',
          path: '',
          fragment: '#foo',
        },
        {
          name: 'Bar',
          path: '',
          fragment: '#bar',
        },
      ],
    });

    fixture.detectChanges();

    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});
