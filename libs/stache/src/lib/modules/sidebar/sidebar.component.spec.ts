import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyAppConfig } from '@skyux/config';
import {
  SkyMediaQueryTestingController,
  provideSkyMediaQueryTesting,
} from '@skyux/core/testing';

import { SidebarFixtureComponent } from './fixtures/sidebar.component.fixture';
import { SidebarFixtureModule } from './fixtures/sidebar.module.fixture';

describe('Sidebar', () => {
  let component: SidebarFixtureComponent;
  let fixture: ComponentFixture<SidebarFixtureComponent>;
  let mediaQueryController: SkyMediaQueryTestingController;

  const mockConfig = {
    runtime: {
      routes: [
        {
          routePath: '/home',
        },
      ],
    },
    skyux: {},
  } as unknown as Partial<SkyAppConfig>;

  function detectChanges(): void {
    fixture.detectChanges();
    tick();
  }

  function getToggleButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.stache-sidebar-button');
  }

  function getHeadingElement(): HTMLHeadingElement {
    return fixture.nativeElement.querySelector('.stache-sidebar-heading');
  }

  function verifyOpened(): void {
    expect(
      fixture.nativeElement.querySelector('.stache-sidebar-open'),
    ).toBeTruthy();
    expect(
      fixture.componentInstance.sidebarWrapperComponent.sidebarOpen,
    ).toEqual(true);
  }

  function verifyClosed(): void {
    expect(
      fixture.nativeElement.querySelector('.stache-sidebar-closed'),
    ).toBeTruthy();
    expect(
      fixture.componentInstance.sidebarWrapperComponent.sidebarOpen,
    ).toEqual(false);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SidebarFixtureModule],
      providers: [
        {
          provide: SkyAppConfig,
          useValue: mockConfig,
        },
        provideSkyMediaQueryTesting(),
      ],
    });

    fixture = TestBed.createComponent(SidebarFixtureComponent);
    component = fixture.componentInstance;
    mediaQueryController = TestBed.inject(SkyMediaQueryTestingController);
  });

  it('should set defaults', fakeAsync(() => {
    mediaQueryController.setBreakpoint('lg');

    detectChanges();

    const sidebar = component.sidebarWrapperComponent;

    expect(sidebar.elementId).toBeDefined();
    expect(sidebar.sidebarLabel).toEqual('Click to open sidebar');
    expect(sidebar.sidebarOpen).toEqual(true);
    expect(sidebar.sidebarRoutes).toBeUndefined();
  }));

  it('should display navigation links', fakeAsync(() => {
    mediaQueryController.setBreakpoint('lg');

    component.routes = [
      {
        name: 'Header',
        path: '/',
        children: [
          { name: 'Test 1', path: [] },
          { name: 'Test 2', path: [] },
        ],
      },
    ];

    detectChanges();

    const links = fixture.nativeElement.querySelectorAll('.stache-nav-anchor');

    expect(links.length).toBe(2);
  }));

  it('should support array route paths', fakeAsync(() => {
    mediaQueryController.setBreakpoint('lg');

    component.routes = [
      {
        name: 'Header',
        path: ['foo', 'bar', 'baz'],
      },
    ];

    detectChanges();

    const heading = getHeadingElement();
    const anchor = heading.querySelector('a');

    expect(anchor?.getAttribute('href')).toEqual('/foo/bar/baz');
  }));

  it('should add a / to a heading route when one is not present', fakeAsync(() => {
    mediaQueryController.setBreakpoint('lg');

    component.routes = [
      {
        name: 'Header',
        path: '',
        children: [],
      },
    ];

    detectChanges();

    const heading = getHeadingElement();
    const anchor = heading.querySelector('a');

    expect(heading.textContent?.trim()).toEqual('Header');
    expect(anchor?.getAttribute('href')).toEqual('/');
  }));

  it('should not add a / to a heading route when one is present', fakeAsync(() => {
    mediaQueryController.setBreakpoint('lg');

    component.routes = [
      {
        name: 'Header',
        path: '/',
        children: [],
      },
    ];

    detectChanges();

    const heading = getHeadingElement();
    const anchor = heading.querySelector('a');

    expect(heading.textContent?.trim()).toEqual('Header');
    expect(anchor?.getAttribute('href')).toEqual('/');
  }));

  it('should allow an external heading route', fakeAsync(() => {
    mediaQueryController.setBreakpoint('lg');

    component.routes = [
      {
        name: 'Header',
        path: 'https://example.org',
        children: [],
      },
    ];

    detectChanges();

    const heading = getHeadingElement();
    const anchor = heading.querySelector('a');

    expect(heading.textContent?.trim()).toEqual('Header');
    expect(anchor?.getAttribute('href')).toEqual('https://example.org');
  }));

  it('should open and close the sidebar', fakeAsync(() => {
    mediaQueryController.setBreakpoint('lg');

    detectChanges();

    verifyOpened();

    const button = getToggleButton();
    button.click();
    detectChanges();

    verifyClosed();
  }));

  it('should add a CSS class to the body', fakeAsync(() => {
    mediaQueryController.setBreakpoint('lg');

    detectChanges();

    expect(
      document.body.className.indexOf('stache-sidebar-enabled') > -1,
    ).toEqual(true);
  }));

  it('should remove the CSS class from the body on destroy', fakeAsync(() => {
    mediaQueryController.setBreakpoint('lg');

    detectChanges();

    expect(
      document.body.className.indexOf('stache-sidebar-enabled') > -1,
    ).toEqual(true);

    fixture.destroy();

    expect(
      document.body.className.indexOf('stache-sidebar-enabled') > -1,
    ).toEqual(false);
  }));

  it('should be accessible', async () => {
    mediaQueryController.setBreakpoint('lg');

    fixture.detectChanges();

    await expectAsync(fixture.debugElement.nativeElement).toBeAccessible();
  });

  it('should collapse the sidebar on small screens', fakeAsync(() => {
    mediaQueryController.setBreakpoint('lg');

    detectChanges();

    verifyOpened();

    mediaQueryController.setBreakpoint('xs');

    detectChanges();

    verifyClosed();
  }));
});
