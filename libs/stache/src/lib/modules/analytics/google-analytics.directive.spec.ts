import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SkyAppConfig } from '@skyux/config';

import { BehaviorSubject } from 'rxjs';

import { StacheWindowRef } from '../shared/window-ref';

import { StacheAnalyticsModule } from './analytics.module';
import { StacheGoogleAnalyticsTestComponent } from './fixtures/google-analytics.component.fixture';

const DEFAULT_TAG_MANAGER_ID = 'GTM-W56QP9';
const DEFAULT_CLIENT_ID = 'UA-2418840-1';

describe('StacheGoogleAnalyticsDirective', () => {
  function setupTest(options: {
    appConfig: unknown;
    isGoogleAlreadySetup: boolean;
  }): {
    fixture: ComponentFixture<StacheGoogleAnalyticsTestComponent>;
    spies: { eval: jasmine.Spy; ga: jasmine.Spy };
    routerEvents$: BehaviorSubject<RouterEvent | undefined>;
  } {
    const routerEvents$ = new BehaviorSubject<RouterEvent | undefined>(
      undefined
    );

    const mockRouter = {
      events: routerEvents$.asObservable(),
    };

    TestBed.configureTestingModule({
      imports: [StacheAnalyticsModule, RouterTestingModule],
      declarations: [StacheGoogleAnalyticsTestComponent],
      providers: [
        { provide: SkyAppConfig, useValue: options.appConfig },
        { provide: Router, useValue: mockRouter },
      ],
    });

    const fixture = TestBed.createComponent(StacheGoogleAnalyticsTestComponent);
    const windowRef = TestBed.inject(StacheWindowRef);
    const gaSpy = jasmine.createSpy('ga');

    windowRef.nativeWindow.ga = options.isGoogleAlreadySetup
      ? gaSpy
      : undefined;

    const spies = {
      eval: spyOn(windowRef.nativeWindow, 'eval'),
      ga: gaSpy,
    };

    spies.eval.and.callFake(() => {
      windowRef.nativeWindow.ga = gaSpy;
    });

    return { fixture, spies, routerEvents$ };
  }

  function verifyGoogleAnalyticsSetup(
    tagManagerId: string,
    clientId: string,
    spies: { eval: jasmine.Spy; ga: jasmine.Spy }
  ): void {
    expect(spies.eval).toHaveBeenCalledWith(`
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${tagManagerId}');
`);
    expect(spies.ga).toHaveBeenCalledWith('create', clientId, 'auto');
  }

  it('should add the Google Tag Manager script', () => {
    const { fixture, spies } = setupTest({
      isGoogleAlreadySetup: false,
      appConfig: {
        runtime: {
          app: {
            base: '/test-base/',
          },
          command: 'build',
        },
        skyux: {
          appSettings: {},
        },
      },
    });

    fixture.detectChanges();

    verifyGoogleAnalyticsSetup(
      DEFAULT_TAG_MANAGER_ID,
      DEFAULT_CLIENT_ID,
      spies
    );
  });

  it('should use config settings over defaults', () => {
    const { fixture, spies } = setupTest({
      isGoogleAlreadySetup: false,
      appConfig: {
        runtime: {
          app: {
            base: '/test-base/',
          },
          command: 'build',
        },
        skyux: {
          appSettings: {
            stache: {
              googleAnalytics: {
                clientId: 'FOO_CLIENT_ID',
                tagManagerContainerId: 'FOO_TAG_MANAGER_ID',
              },
            },
          },
        },
      },
    });

    fixture.detectChanges();

    verifyGoogleAnalyticsSetup('FOO_TAG_MANAGER_ID', 'FOO_CLIENT_ID', spies);
  });

  it('should run none of the other methods if the GTM script exists already', () => {
    const { fixture, spies } = setupTest({
      isGoogleAlreadySetup: true,
      appConfig: {
        runtime: {
          app: {
            base: '/test-base/',
          },
          command: 'build',
        },
        skyux: {
          appSettings: {},
        },
      },
    });

    fixture.detectChanges();

    expect(spies.eval).not.toHaveBeenCalled();
    expect(spies.ga).not.toHaveBeenCalled();
  });

  it('should not run if enabled is set to `false`', () => {
    const { fixture, spies } = setupTest({
      isGoogleAlreadySetup: false,
      appConfig: {
        runtime: {
          app: {
            base: '/test-base/',
          },
          command: 'build',
        },
        skyux: {
          appSettings: {
            stache: {
              googleAnalytics: {
                enabled: false, // <--
              },
            },
          },
        },
      },
    });

    fixture.detectChanges();

    expect(spies.eval).not.toHaveBeenCalled();
    expect(spies.ga).not.toHaveBeenCalled();
  });

  it('should not run if in development mode', () => {
    const { fixture, spies } = setupTest({
      isGoogleAlreadySetup: false,
      appConfig: {
        runtime: {
          app: {
            base: '/test-base/',
          },
          command: 'serve', // <--
        },
        skyux: {
          appSettings: {},
        },
      },
    });

    fixture.detectChanges();

    expect(spies.eval).not.toHaveBeenCalled();
    expect(spies.ga).not.toHaveBeenCalled();
  });

  it('should handle empty appSettings in SkyAppConfig', () => {
    const { fixture, spies } = setupTest({
      isGoogleAlreadySetup: false,
      appConfig: {
        runtime: {
          app: {
            base: '/test-base/',
          },
          command: 'build',
        },
        skyux: {},
      },
    });

    fixture.detectChanges();

    expect(spies.eval).toHaveBeenCalled();
    expect(spies.ga).toHaveBeenCalled();
  });

  it('should log after navigating away from the current route', () => {
    const { fixture, spies, routerEvents$ } = setupTest({
      isGoogleAlreadySetup: false,
      appConfig: {
        runtime: {
          app: {
            base: '/test-base/',
          },
          command: 'build',
        },
        skyux: {
          appSettings: {},
        },
      },
    });

    fixture.detectChanges();

    routerEvents$.next(new NavigationEnd(1, 'foobar', '/baz'));

    fixture.detectChanges();

    expect(spies.ga).toHaveBeenCalledWith('set', 'page', 'test-base/baz');
    expect(spies.ga).toHaveBeenCalledWith('send', 'pageview');
  });
});
