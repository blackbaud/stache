import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@skyux-sdk/testing';
import { SkyAppConfig } from '@skyux/config';

import { of as observableOf } from 'rxjs';

import { StacheWindowRef } from '../shared/window-ref';

import { StacheAnalyticsModule } from './analytics.module';
import { StacheGoogleAnalyticsTestComponent } from './fixtures/google-analytics.component.fixture';
import { StacheGoogleAnalyticsDirective } from './google-analytics.directive';

describe('StacheGoogleAnalyticsDirective', () => {
  // function verifyGoogleAnalyticsSetup(options: {
  //   tagManagerContainerId: string;
  //   analyticsClientId: string;
  //   isEnabled: boolean;
  // }): void {
  //   expect(evalSpy).toHaveBeenCalledWith(`
  //   (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  //   new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  //   j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  //   'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  //   })(window,document,'script','dataLayer','${options.tagManagerContainerId}');
  // `);

  //   expect(gaScriptSpy).toHaveBeenCalledWith();
  // }

  let mockWindowService: MockWindowService;
  let mockConfigService: MockConfigService;
  let mockRouter: MockRouter;

  class MockWindowService {
    public nativeWindow = {
      eval(): void {
        /* */
      },
      document: {
        getElementById: jasmine
          .createSpy('getElementById')
          .and.callFake(() => false),
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
            enabled: 'false',
            tagManagerContainerId: '',
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
      imports: [StacheAnalyticsModule, RouterTestingModule],
      providers: [
        { provide: SkyAppConfig, useValue: mockConfigService },
        { provide: StacheWindowRef, useValue: mockWindowService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  function setupTest(): {
    directiveInstance: StacheGoogleAnalyticsDirective;
    fixture: ComponentFixture<StacheGoogleAnalyticsTestComponent>;
    spies: { eval: jasmine.Spy };
  } {
    const windowRef = TestBed.inject(StacheWindowRef);

    const spies = { eval: spyOn(windowRef.nativeWindow, 'eval') };

    const fixture = TestBed.createComponent(StacheGoogleAnalyticsTestComponent);

    const directiveElement = fixture.debugElement.query(
      By.directive(StacheGoogleAnalyticsDirective)
    );

    const directiveInstance = directiveElement.injector.get(
      StacheGoogleAnalyticsDirective
    );

    return { directiveInstance, fixture, spies };
  }

  function verifyTagManagerScript(
    evalSpy: jasmine.Spy,
    tagManagerContainerId: string
  ): void {
    expect(evalSpy).toHaveBeenCalledWith(`
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${tagManagerContainerId}');
  `);
  }

  it('should use config settings over defaults', () => {
    const { fixture, spies } = setupTest();

    fixture.detectChanges();

    // Confirm defaults are set.
    verifyTagManagerScript(spies.eval, 'GTM-W56QP9');
    // verifyTagManagerScript({
    //   tagManagerContainerId: 'GTM-W56QP9',
    //   analyticsClientId: 'UA-2418840-1',
    //   isEnabled: true,
    // });

    // mockConfigService.skyux.appSettings = {
    //   stache: {
    //     googleAnalytics: {
    //       tagManagerContainerId: '1',
    //       clientId: '2',
    //       enabled: 'false',
    //     },
    //   },
    // };

    // directiveInstance.ngOnInit();
    // fixture.detectChanges();

    // verifyTagManagerScript(spies.eval, '1');
    // verifyGoogleAnalyticsSetup({
    //   tagManagerContainerId: '1',
    //   analyticsClientId: '2',
    //   isEnabled: false,
    // });
  });

  //   it('should format and store the appName from the runtime.base', () => {
  //     const directiveInstance = directiveElement.injector.get(
  //       StacheGoogleAnalyticsDirective
  //     );
  //     directiveInstance.updateDefaultConfigs();
  //     expect(directiveInstance['configService'].runtime.app.base).toEqual(
  //       '/test-base/'
  //     );
  //     expect(directiveInstance['appName']).toEqual('test-base');
  //   });

  //   it('should add the Google Tag Manager script if it does not exist, from ngOnInit', () => {
  //     const directiveInstance = directiveElement.injector.get(
  //       StacheGoogleAnalyticsDirective
  //     );
  //     spyOn(directiveInstance, 'addGoogleTagManagerScript').and.callThrough();
  //     directiveInstance.ngOnInit();
  //     expect(directiveInstance.addGoogleTagManagerScript).toHaveBeenCalled();
  //   });

  //   it('should run none of the other methods if the GTM script exists already', () => {
  //     const directiveInstance = directiveElement.injector.get(
  //       StacheGoogleAnalyticsDirective
  //     );
  //     spyOn(directiveInstance, 'addGoogleTagManagerScript').and.callThrough();
  //     mockWindowService.nativeWindow.ga = () => true;
  //     directiveInstance.ngOnInit();
  //     expect(directiveInstance.addGoogleTagManagerScript).not.toHaveBeenCalled();
  //   });

  //   it('should handle empty stache config in skyuxconfig.json', () => {
  //     const directiveInstance = directiveElement.injector.get(
  //       StacheGoogleAnalyticsDirective
  //     );
  //     mockConfigService.skyux.appSettings = undefined;
  //     spyOn(directiveInstance, 'addGoogleTagManagerScript').and.callThrough();
  //     directiveInstance.ngOnInit();
  //     expect(directiveInstance.addGoogleTagManagerScript).toHaveBeenCalled();
  //   });

  //   it('should not run if enabled is set to `false`', () => {
  //     const directiveInstance = directiveElement.injector.get(
  //       StacheGoogleAnalyticsDirective
  //     );
  //     mockConfigService.skyux.appSettings.stache.googleAnalytics.enabled =
  //       'false';
  //     spyOn(directiveInstance, 'addGoogleTagManagerScript').and.callThrough();
  //     directiveInstance.ngOnInit();
  //     expect(directiveInstance.addGoogleTagManagerScript).not.toHaveBeenCalled();
  //   });

  //   it("should not run if enabled is set to `'false'`", () => {
  //     const directiveInstance = directiveElement.injector.get(
  //       StacheGoogleAnalyticsDirective
  //     );
  //     mockConfigService.skyux.appSettings.stache.googleAnalytics.enabled = false;
  //     spyOn(directiveInstance, 'addGoogleTagManagerScript').and.callThrough();
  //     directiveInstance.ngOnInit();
  //     expect(directiveInstance.addGoogleTagManagerScript).not.toHaveBeenCalled();
  //   });

  //   it('should not run if in development mode', () => {
  //     const directiveInstance = directiveElement.injector.get(
  //       StacheGoogleAnalyticsDirective
  //     );
  //     mockConfigService.runtime.command = 'none';
  //     spyOn(directiveInstance, 'addGoogleTagManagerScript').and.callThrough();
  //     fixture.detectChanges();
  //     expect(directiveInstance.addGoogleTagManagerScript).not.toHaveBeenCalled();
  //   });
});
