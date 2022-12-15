import {
  APP_BASE_HREF,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Routes } from '@angular/router';
import {
  SkyAppTestUtility,
  SkyAppTestUtilityDomEventOptions,
  expect,
} from '@skyux-sdk/testing';

import { StacheRouteService } from '../router/route.service';

import { StacheRouterLinkTestComponent } from './fixtures/link.component.fixture';
import { StacheRouterLinkDirective } from './link.directive';
import { StacheNavModule } from './nav.module';
import { StacheNavService } from './nav.service';

describe('StacheLinkDirective', () => {
  function clickAnchor(options: SkyAppTestUtilityDomEventOptions = {}): void {
    // First, remove href attribute to avoid a full-page reload.
    fixture.componentInstance.anchorEl.nativeElement.removeAttribute('href');
    SkyAppTestUtility.fireDomEvent(
      fixture.componentInstance.anchorEl.nativeElement,
      'click',
      options
    );
    fixture.detectChanges();
  }

  let directiveElement: DebugElement;
  let fixture: ComponentFixture<StacheRouterLinkTestComponent>;
  let mockNavService: MockNavService;
  let mockRouteService: MockRouteService;

  class MockNavService {
    public navigate = jasmine.createSpy('navigate').and.callFake(() => {
      /* */
    });

    public isExternal(route: unknown): boolean {
      const testPath = route;

      if (typeof testPath !== 'string') {
        return false;
      }

      return /^(https?|mailto|ftp):+|^(www)/.test(testPath);
    }
  }

  const mockRoutes = [
    {
      path: '',
      children: [
        {
          path: 'parent',
          children: [
            {
              path: 'parent/child',
              children: [
                {
                  path: 'parent/child/grandchild',
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  let mockActiveUrl = '';

  class MockRouteService {
    public getActiveRoutes(): Routes {
      return mockRoutes;
    }
    public getActiveUrl(): string {
      return mockActiveUrl;
    }
  }

  beforeEach(() => {
    mockNavService = new MockNavService();
    mockRouteService = new MockRouteService();

    TestBed.configureTestingModule({
      imports: [StacheNavModule],
      declarations: [StacheRouterLinkTestComponent],
      providers: [
        LocationStrategy,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: StacheNavService, useValue: mockNavService },
        { provide: StacheRouteService, useValue: mockRouteService },
      ],
    });

    fixture = TestBed.createComponent(StacheRouterLinkTestComponent);
    directiveElement = fixture.debugElement.query(
      By.directive(StacheRouterLinkDirective)
    );
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should have a route input', () => {
    fixture.componentInstance.routerLink = 'test-route';
    fixture.detectChanges();

    const directiveInstance = directiveElement.injector.get(
      StacheRouterLinkDirective
    );

    expect(directiveInstance.href).toBe('/test-route');
  });

  it('should have a fragment input', () => {
    fixture.componentInstance.fragment = 'test';
    fixture.detectChanges();

    const directiveInstance = directiveElement.injector.get(
      StacheRouterLinkDirective
    );

    expect(directiveInstance.fragment).toBe('test');
  });

  it('should call the navigate method when clicked', async () => {
    fixture.detectChanges();

    const directiveInstance = directiveElement.injector.get(
      StacheRouterLinkDirective
    );

    spyOn(directiveInstance, 'navigate');

    clickAnchor();
    await fixture.whenStable();

    expect(directiveInstance.navigate).toHaveBeenCalled();
  });

  it('should set stacheRouterLink input to internal urls', () => {
    fixture.componentInstance.routerLink = '/demos';
    fixture.detectChanges();

    const directiveInstance: StacheRouterLinkDirective =
      directiveElement.injector.get(StacheRouterLinkDirective);

    expect(directiveInstance.href).toBe('/demos');
  });

  it('should set stacheRouterLink input to same page urls', () => {
    mockActiveUrl = '/test-page';
    fixture.componentInstance.routerLink = '.';
    fixture.detectChanges();

    const directiveInstance = directiveElement.injector.get(
      StacheRouterLinkDirective
    );

    expect(directiveInstance.href).toBe('/test-page');
    mockActiveUrl = '';
  });

  it('should set stacheRouterLink input to external urls', () => {
    fixture.componentInstance.routerLink = 'https://www.google.com';
    fixture.detectChanges();

    const directiveInstance = directiveElement.injector.get(
      StacheRouterLinkDirective
    );

    expect(directiveInstance.href).toBe('https://www.google.com');
  });

  it('should set stacheRouterLink input to array of strings', () => {
    fixture.componentInstance.routerLink = ['foo', 'bar', 'baz'];
    fixture.detectChanges();

    const directiveInstance = directiveElement.injector.get(
      StacheRouterLinkDirective
    );

    expect(directiveInstance.href).toBe('/foo/bar/baz');
  });

  it('should open in new window when shift clicked', () => {
    fixture.detectChanges();

    clickAnchor({
      keyboardEventInit: {
        shiftKey: true,
      },
    });

    expect(mockNavService.navigate).not.toHaveBeenCalled();
  });

  it('should open in new window when meta (command) clicked', () => {
    fixture.detectChanges();

    clickAnchor({
      keyboardEventInit: {
        metaKey: true,
      },
    });

    expect(mockNavService.navigate).not.toHaveBeenCalled();
  });

  it('should pass the fragment to the navigate method if it exists', () => {
    fixture.componentInstance.routerLink = 'test-route';
    fixture.componentInstance.fragment = 'test';
    fixture.detectChanges();

    clickAnchor();

    expect(mockNavService.navigate).toHaveBeenCalledWith({
      path: 'test-route',
      fragment: 'test',
    });
  });

  it('should not pass a fragment if it does not exist', () => {
    fixture.componentInstance.routerLink = 'test-route';
    fixture.componentInstance.fragment = undefined;
    fixture.detectChanges();

    clickAnchor();

    expect(mockNavService.navigate).toHaveBeenCalledWith({
      path: 'test-route',
      fragment: undefined,
    });
  });
});
