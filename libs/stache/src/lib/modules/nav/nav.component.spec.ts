import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@skyux-sdk/testing';

import { BehaviorSubject } from 'rxjs';

import { StacheAuthService } from '../auth/auth.service';
import { StacheRouteService } from '../router/route.service';
import { StacheWindowRef } from '../shared/window-ref';

import { StacheNavTestComponent } from './fixtures/nav.component.fixture';
import { StacheNavComponent } from './nav.component';
import { StacheNavModule } from './nav.module';

describe('StacheNavComponent', () => {
  let component: StacheNavComponent;
  let fixture: ComponentFixture<StacheNavComponent>;
  let mockWindowService: any;
  let mockRouteService: any;
  let activeUrl: string;
  let mockRestrictedViewAuthService: MockRestrictedViewAuthService;

  class MockWindowService {
    public nativeWindow = {
      document: {
        getElementById: jasmine
          .createSpy('getElementById')
          .and.callFake((id: any) => {
            if (id === 'some-header') {
              return this.testElement;
            }
            return undefined;
          }),
      },
      location: {
        href: '',
      },
    };

    public testElement = {
      getBoundingClientRect(): { y: number } {
        return { y: 0 };
      },
    };
  }

  class MockRouteService {
    public getActiveUrl(): string {
      return activeUrl;
    }
  }

  class MockRestrictedViewAuthService {
    public isAuthenticated = new BehaviorSubject<boolean>(false);
  }

  beforeEach(() => {
    activeUrl = '/test';
    mockWindowService = new MockWindowService();
    mockRouteService = new MockRouteService();
    mockRestrictedViewAuthService = new MockRestrictedViewAuthService();

    TestBed.configureTestingModule({
      declarations: [StacheNavTestComponent],
      imports: [RouterTestingModule, StacheNavModule],
      providers: [
        { provide: StacheRouteService, useValue: mockRouteService },
        { provide: StacheWindowRef, useValue: mockWindowService },
        { provide: StacheAuthService, useValue: mockRestrictedViewAuthService },
      ],
    });

    fixture = TestBed.createComponent(StacheNavComponent);
    component = fixture.componentInstance;
  });

  it('should have the given inputs', () => {
    component.routes = [{ name: 'Test', path: '/test' }];
    component.navType = 'sidebar';

    fixture.detectChanges();

    expect(component.routes[0].name).toBe('Test');
    expect(component.navType).toBe('sidebar');
  });

  it('should return true if the component has routes', () => {
    component.routes = [{ name: 'Test', path: '/test' }];

    fixture.detectChanges();

    expect(component.hasRoutes()).toBe(true);
  });

  it('should return false if the component has no routes', () => {
    component.routes = [];

    fixture.detectChanges();

    expect(component.hasRoutes()).toBe(false);
  });

  it('should return true if a given route has child routes', () => {
    component.routes = [
      {
        name: 'Test',
        path: '/test',
        children: [{ name: 'Child', path: '/test/child' }],
      },
      { name: 'No Child', path: '/no-child' },
    ];

    const route = component.routes[0];
    const route2 = component.routes[1];

    fixture.detectChanges();

    expect(component.hasChildRoutes(route)).toBe(true);
    expect(component.hasChildRoutes(route2)).toBe(false);
  });

  it('should return true if a given route is active', () => {
    component.routes = [{ name: 'Test', path: 'test' }];
    const route = component.routes[0];

    fixture.detectChanges();

    expect(route.isActive).toBe(true);
  });

  it('should support routes that change after init', () => {
    component.routes = [
      { name: 'Test', path: 'test' },
      { name: 'Foo', path: 'foo' },
    ];

    fixture.detectChanges();

    expect(component.routes[0].isActive).toBe(true);
    expect(component.routes[1].isActive).toBe(false);

    activeUrl = '/foo';
    component.routes = [
      { name: 'Test', path: 'test' },
      { name: 'Foo', path: 'foo' },
    ];

    fixture.detectChanges();

    expect(component.routes[0].isActive).toBe(false);
    expect(component.routes[1].isActive).toBe(true);
  });

  it('should return true if a given route is current', () => {
    component.routes = [{ name: 'Test', path: 'test' }];
    const route = component.routes[0];

    fixture.detectChanges();

    expect(route.isCurrent).toBe(true);
  });

  it('should set the className based on the navType on init', () => {
    component.navType = 'sidebar';

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.className).toBe('stache-nav-sidebar');
  });

  it('should reset the className with an undefined navType', () => {
    component.navType = undefined;
    fixture.detectChanges();
    expect(component.className).toBeUndefined();
  });

  it('should filter out restricted routes when the restricted property is true', () => {
    component.routes = [
      {
        name: 'Test',
        path: '/',
        restricted: true,
      },
    ];
    fixture.detectChanges();

    const listItems = fixture.nativeElement.querySelectorAll(
      '.stache-nav-list-item'
    );

    expect(listItems.length).toEqual(0);
  });

  it('should not filter out routes when the restricted property is false or undefined', () => {
    component.routes = [
      {
        name: 'Test 1',
        path: '/one',
        restricted: false,
      },
      {
        name: 'Test 2',
        path: '/two',
      },
    ];
    fixture.detectChanges();

    const listItems = fixture.nativeElement.querySelectorAll(
      '.stache-nav-list-item'
    );

    expect(listItems.length).toEqual(2);
  });

  it('should show restricted routes when user is an authenticated BB user', () => {
    mockRestrictedViewAuthService.isAuthenticated =
      new BehaviorSubject<boolean>(true);

    component.routes = [
      {
        name: 'Test 1',
        path: '/foo',
      },
      {
        name: 'Restricted route',
        path: '/bar',
        restricted: true,
      },
      {
        name: 'Test 2',
        path: '/baz',
      },
    ];
    fixture.detectChanges();

    const listItems = fixture.nativeElement.querySelectorAll(
      '.stache-nav-list-item'
    );

    expect(listItems.length).toEqual(3);
  });
});
