import { CSP_NONCE } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { expect } from '@skyux-sdk/testing';
import { SkyAppConfig } from '@skyux/config';

import { of as observableOf } from 'rxjs';

import { StacheWindowRef } from '../shared/window-ref';

import { StacheAnalyticsModule } from './analytics.module';
import { StacheGoogleAnalyticsTestComponent } from './fixtures/google-analytics.component.fixture';
import { StacheGoogleAnalyticsDirective } from './google-analytics.directive';

describe('StacheGoogleAnalyticsDirective', () => {
  let fixture: ComponentFixture<StacheGoogleAnalyticsTestComponent>;
  let mockWindowService: any;
  let mockConfigService: any;
  let mockRouter: any;
  let directiveElement: any;

  class MockWindowService {
    public nativeWindow = {
      ga: false,
      dataLayer: undefined,
      document: {
        getElementById: jasmine
          .createSpy('getElementById')
          .and.callFake(function () {
            return false;
          }),
        createElement: jasmine
          .createSpy('createElement')
          .and.callFake(function () {
            const element = {
              textContent: '',
              src: '',
              async: false,
              setAttribute: jasmine.createSpy('setAttribute'),
            };
            return element;
          }),
        head: {
          appendChild: jasmine.createSpy('appendChild'),
        },
      },
    };
  }

  class MockConfigService {
    public runtime = {
      command: 'build',
      app: {
        base: '/test-base/',
      },
    };
    public skyux = {
      appSettings: {
        stache: {
          googleAnalytics: {
            clientId: '',
          },
        },
      },
    };
  }

  class MockRouter {
    public events = observableOf(new NavigationEnd(0, '', ''));
  }

  beforeEach(() => {
    mockWindowService = new MockWindowService();
    mockConfigService = new MockConfigService();
    mockRouter = new MockRouter();

    TestBed.configureTestingModule({
      declarations: [StacheGoogleAnalyticsTestComponent],
      imports: [StacheAnalyticsModule],
      providers: [
        { provide: SkyAppConfig, useValue: mockConfigService },
        { provide: StacheWindowRef, useValue: mockWindowService },
        { provide: Router, useValue: mockRouter },
        { provide: CSP_NONCE, useValue: null },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StacheGoogleAnalyticsTestComponent);
    directiveElement = fixture.debugElement.query(
      By.directive(StacheGoogleAnalyticsDirective),
    );
  });

  it('should use config settings over defaults', () => {
    const directiveInstance = directiveElement.injector.get(
      StacheGoogleAnalyticsDirective,
    );

    expect(directiveInstance['tagManagerContainerId']).toEqual('GTM-W56QP9');
    expect(directiveInstance['analyticsClientId']).toEqual('UA-2418840-1');
    expect(directiveInstance['isEnabled']).toEqual(true);

    mockConfigService.skyux.appSettings = {
      stache: {
        googleAnalytics: {
          tagManagerContainerId: '1',
          clientId: '2',
          enabled: 'false',
        },
      },
    };

    directiveInstance.updateDefaultConfigs();

    expect(directiveInstance['tagManagerContainerId']).toEqual('1');
    expect(directiveInstance['analyticsClientId']).toEqual('2');
    expect(directiveInstance['isEnabled']).toEqual(false);
  });

  it('should format and store the appName from the runtime.base', () => {
    const directiveInstance = directiveElement.injector.get(
      StacheGoogleAnalyticsDirective,
    );
    directiveInstance.updateDefaultConfigs();
    expect(directiveInstance['configService'].runtime.app.base).toEqual(
      '/test-base/',
    );
    expect(directiveInstance['appName']).toEqual('test-base');
  });

  it('should add the Google Tag Manager script if it does not exist, from ngOnInit', () => {
    const directiveInstance = directiveElement.injector.get(
      StacheGoogleAnalyticsDirective,
    );
    spyOn(directiveInstance, 'addGoogleTagManagerScript').and.callThrough();
    directiveInstance.ngOnInit();
    expect(directiveInstance.addGoogleTagManagerScript).toHaveBeenCalled();
  });

  it('should run none of the other methods if the GTM script exists already', () => {
    const directiveInstance = directiveElement.injector.get(
      StacheGoogleAnalyticsDirective,
    );
    spyOn(directiveInstance, 'addGoogleTagManagerScript').and.callThrough();
    mockWindowService.nativeWindow.ga = () => true;
    directiveInstance.ngOnInit();
    expect(directiveInstance.addGoogleTagManagerScript).not.toHaveBeenCalled();
  });

  it('should handle empty stache config in skyuxconfig.json', () => {
    const directiveInstance = directiveElement.injector.get(
      StacheGoogleAnalyticsDirective,
    );
    mockConfigService.skyux.appSettings = undefined;
    spyOn(directiveInstance, 'addGoogleTagManagerScript').and.callThrough();
    directiveInstance.ngOnInit();
    expect(directiveInstance.addGoogleTagManagerScript).toHaveBeenCalled();
  });

  it('should not run if enabled is set to `false`', () => {
    const directiveInstance = directiveElement.injector.get(
      StacheGoogleAnalyticsDirective,
    );
    mockConfigService.skyux.appSettings.stache.googleAnalytics.enabled =
      'false';
    spyOn(directiveInstance, 'addGoogleTagManagerScript').and.callThrough();
    directiveInstance.ngOnInit();
    expect(directiveInstance.addGoogleTagManagerScript).not.toHaveBeenCalled();
  });

  it("should not run if enabled is set to `'false'`", () => {
    const directiveInstance = directiveElement.injector.get(
      StacheGoogleAnalyticsDirective,
    );
    mockConfigService.skyux.appSettings.stache.googleAnalytics.enabled = false;
    spyOn(directiveInstance, 'addGoogleTagManagerScript').and.callThrough();
    directiveInstance.ngOnInit();
    expect(directiveInstance.addGoogleTagManagerScript).not.toHaveBeenCalled();
  });

  it('should not run if in development mode', () => {
    const directiveInstance = directiveElement.injector.get(
      StacheGoogleAnalyticsDirective,
    );
    mockConfigService.runtime.command = 'none';
    spyOn(directiveInstance, 'addGoogleTagManagerScript').and.callThrough();
    fixture.detectChanges();
    expect(directiveInstance.addGoogleTagManagerScript).not.toHaveBeenCalled();
  });

  it('should create and append script tag with correct attributes', () => {
    const directiveInstance = directiveElement.injector.get(
      StacheGoogleAnalyticsDirective,
    );
    const mockScript = {
      src: '',
      async: false,
      setAttribute: jasmine.createSpy('setAttribute'),
    };
    mockWindowService.nativeWindow.document.createElement.and.returnValue(
      mockScript,
    );

    directiveInstance.addGoogleTagManagerScript();

    expect(
      mockWindowService.nativeWindow.document.createElement,
    ).toHaveBeenCalledWith('script');
    expect(mockScript.src).toContain('GTM-W56QP9');
    expect(mockScript.src).toContain('googletagmanager.com/gtm.js');
    expect(mockScript.async).toBe(true);
    expect(mockWindowService.nativeWindow.dataLayer).toBeDefined();
    expect(mockWindowService.nativeWindow.dataLayer.length).toBe(1);
    expect(
      mockWindowService.nativeWindow.dataLayer[0]['gtm.start'],
    ).toBeDefined();
    expect(mockWindowService.nativeWindow.dataLayer[0].event).toBe('gtm.js');
    expect(
      mockWindowService.nativeWindow.document.head.appendChild,
    ).toHaveBeenCalledWith(mockScript);
  });

  it('should set nonce attribute on script if CSP_NONCE is provided', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [StacheGoogleAnalyticsTestComponent],
      imports: [StacheAnalyticsModule],
      providers: [
        { provide: SkyAppConfig, useValue: mockConfigService },
        { provide: StacheWindowRef, useValue: mockWindowService },
        { provide: Router, useValue: mockRouter },
        { provide: CSP_NONCE, useValue: 'test-nonce-123' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StacheGoogleAnalyticsTestComponent);
    directiveElement = fixture.debugElement.query(
      By.directive(StacheGoogleAnalyticsDirective),
    );

    const directiveInstance = directiveElement.injector.get(
      StacheGoogleAnalyticsDirective,
    );
    const mockScript = {
      src: '',
      async: false,
      setAttribute: jasmine.createSpy('setAttribute'),
    };
    mockWindowService.nativeWindow.document.createElement.and.returnValue(
      mockScript,
    );

    directiveInstance.addGoogleTagManagerScript();

    expect(mockScript.setAttribute).toHaveBeenCalledWith(
      'nonce',
      'test-nonce-123',
    );
  });

  it('should not set nonce attribute on script if CSP_NONCE is null', () => {
    const directiveInstance = directiveElement.injector.get(
      StacheGoogleAnalyticsDirective,
    );
    const mockScript = {
      src: '',
      async: false,
      setAttribute: jasmine.createSpy('setAttribute'),
    };
    mockWindowService.nativeWindow.document.createElement.and.returnValue(
      mockScript,
    );

    directiveInstance.addGoogleTagManagerScript();

    expect(mockScript.setAttribute).not.toHaveBeenCalledWith(
      'nonce',
      jasmine.any(String),
    );
  });

  it('should use custom tagManagerContainerId in script src', () => {
    const directiveInstance = directiveElement.injector.get(
      StacheGoogleAnalyticsDirective,
    );
    mockConfigService.skyux.appSettings = {
      stache: {
        googleAnalytics: {
          tagManagerContainerId: 'GTM-CUSTOM',
        },
      },
    };
    directiveInstance.updateDefaultConfigs();

    const mockScript = {
      src: '',
      async: false,
      setAttribute: jasmine.createSpy('setAttribute'),
    };
    mockWindowService.nativeWindow.document.createElement.and.returnValue(
      mockScript,
    );

    directiveInstance.addGoogleTagManagerScript();

    expect(mockScript.src).toContain('GTM-CUSTOM');
  });

  it('should call initGoogleAnalytics and bindPageViewsToRouter when conditions are met', () => {
    const directiveInstance = directiveElement.injector.get(
      StacheGoogleAnalyticsDirective,
    );
    spyOn(directiveInstance, 'addGoogleTagManagerScript').and.callThrough();
    spyOn(directiveInstance, 'initGoogleAnalytics').and.callThrough();
    spyOn(directiveInstance, 'bindPageViewsToRouter').and.callThrough();

    directiveInstance.ngOnInit();

    expect(directiveInstance.addGoogleTagManagerScript).toHaveBeenCalled();
    expect(directiveInstance.initGoogleAnalytics).toHaveBeenCalled();
    expect(directiveInstance.bindPageViewsToRouter).toHaveBeenCalled();
  });

  it('should initialize Google Analytics without using eval', () => {
    const directiveInstance = directiveElement.injector.get(
      StacheGoogleAnalyticsDirective,
    );
    mockWindowService.nativeWindow.ga = undefined;
    mockWindowService.nativeWindow['GoogleAnalyticsObject'] = undefined;

    directiveInstance.initGoogleAnalytics();

    expect(mockWindowService.nativeWindow['GoogleAnalyticsObject']).toBe('ga');
    expect(mockWindowService.nativeWindow.ga).toBeDefined();
    expect(typeof mockWindowService.nativeWindow.ga).toBe('function');
    expect(mockWindowService.nativeWindow.ga.l).toEqual(jasmine.any(Number));
    expect(mockWindowService.nativeWindow.ga.q).toEqual(jasmine.any(Array));
  });

  it('should call ga create after initializing Google Analytics', () => {
    const directiveInstance = directiveElement.injector.get(
      StacheGoogleAnalyticsDirective,
    );
    mockWindowService.nativeWindow.ga = undefined;
    mockWindowService.nativeWindow['GoogleAnalyticsObject'] = undefined;

    directiveInstance.initGoogleAnalytics();

    // The ga function should have been called with create
    expect(mockWindowService.nativeWindow.ga.q.length).toBeGreaterThan(0);
    const firstCall = mockWindowService.nativeWindow.ga.q[0];
    expect(firstCall[0]).toBe('create');
    expect(firstCall[1]).toBe('UA-2418840-1');
    expect(firstCall[2]).toBe('auto');
  });

  it('should track page views for NavigationEnd events', () => {
    const directiveInstance = directiveElement.injector.get(
      StacheGoogleAnalyticsDirective,
    );
    mockWindowService.nativeWindow.ga = jasmine.createSpy('ga');
    directiveInstance['appName'] = 'test-app';

    directiveInstance.bindPageViewsToRouter();

    // Simulate a NavigationEnd event
    const navigationEndEvent = new NavigationEnd(1, '/test-url', '/test-url');
    mockRouter.events = observableOf(navigationEndEvent);
    directiveInstance.bindPageViewsToRouter();

    expect(mockWindowService.nativeWindow.ga).toHaveBeenCalledWith(
      'set',
      'page',
      'test-app/test-url',
    );
    expect(mockWindowService.nativeWindow.ga).toHaveBeenCalledWith(
      'send',
      'pageview',
    );
  });

  it('should handle enabled setting as boolean false', () => {
    const directiveInstance = directiveElement.injector.get(
      StacheGoogleAnalyticsDirective,
    );
    mockConfigService.skyux.appSettings = {
      stache: {
        googleAnalytics: {
          enabled: false,
        },
      },
    };

    directiveInstance.updateDefaultConfigs();

    expect(directiveInstance['isEnabled']).toBe(false);
  });

  it('should handle enabled setting as string "false"', () => {
    const directiveInstance = directiveElement.injector.get(
      StacheGoogleAnalyticsDirective,
    );
    mockConfigService.skyux.appSettings = {
      stache: {
        googleAnalytics: {
          enabled: 'false',
        },
      },
    };

    directiveInstance.updateDefaultConfigs();

    expect(directiveInstance['isEnabled']).toBe(false);
  });

  it('should keep enabled as true for other values', () => {
    const directiveInstance = directiveElement.injector.get(
      StacheGoogleAnalyticsDirective,
    );
    mockConfigService.skyux.appSettings = {
      stache: {
        googleAnalytics: {
          enabled: 'true',
        },
      },
    };

    directiveInstance.updateDefaultConfigs();

    expect(directiveInstance['isEnabled']).toBe(true);
  });
});
