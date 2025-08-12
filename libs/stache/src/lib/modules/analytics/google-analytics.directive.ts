import { CSP_NONCE, Directive, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SkyAppConfig } from '@skyux/config';

import { StacheWindowRef } from '../shared/window-ref';

@Directive({
  selector: '[stacheGoogleAnalytics]',
  standalone: false,
})
export class StacheGoogleAnalyticsDirective implements OnInit {
  readonly #nonce = inject(CSP_NONCE, { optional: true });

  private tagManagerContainerId = 'GTM-W56QP9';
  private analyticsClientId = 'UA-2418840-1';
  private isEnabled = true;
  private appName: string;

  constructor(
    private windowRef: StacheWindowRef,
    private configService: SkyAppConfig,
    private router: Router,
  ) {}

  public ngOnInit(): void {
    const isLoaded = this.windowRef.nativeWindow.ga;
    const isProduction = this.configService.runtime.command === 'build';

    this.updateDefaultConfigs();

    if (this.isEnabled && isProduction && !isLoaded) {
      this.addGoogleTagManagerScript();
      this.initGoogleAnalytics();
      this.bindPageViewsToRouter();
    }
  }

  public addGoogleTagManagerScript(): void {
    const win = this.windowRef.nativeWindow as {
      dataLayer?: unknown[];
      document: Document;
    };

    win.dataLayer ??= [];
    win.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js',
    });

    const script = win.document.createElement('script');
    script.setAttribute('async', 'async');
    script.setAttribute(
      'src',
      `https://www.googletagmanager.com/gtm.js?id=${this.tagManagerContainerId}`,
    );

    if (this.#nonce) {
      script.setAttribute('nonce', this.#nonce);
    }

    win.document.head.appendChild(script);
  }

  /**
   * Because GTM adds the Google Analytics script to the page outside of our control,
   * instead of loading the GA script twice, we extract the 'ga' window method out so we can
   * subscribe to our router events and track SPA page views.
   */
  public initGoogleAnalytics(): void {
    const win = this.windowRef.nativeWindow;

    win['GoogleAnalyticsObject'] = 'ga';

    win.ga =
      win.ga ||
      function (...args: unknown[]): void {
        (win.ga.q = win.ga.q || []).push(args);
      };

    win.ga.l = new Date().getTime();

    win.ga('create', this.analyticsClientId, 'auto');
  }

  public bindPageViewsToRouter(): void {
    this.router.events.subscribe((event) => {
      /* istanbul ignore else*/
      if (event instanceof NavigationEnd) {
        const ga = this.windowRef.nativeWindow.ga;

        ga('set', 'page', `${this.appName}${event.urlAfterRedirects}`);
        ga('send', 'pageview');
      }
    });
  }

  private updateDefaultConfigs(): void {
    // TODO: the config service should handle defaults!
    const appSettings = this.configService.skyux.appSettings || {};
    appSettings.stache = appSettings.stache || {};
    appSettings.stache.googleAnalytics =
      appSettings.stache.googleAnalytics || {};

    if (appSettings.stache.googleAnalytics.tagManagerContainerId) {
      this.tagManagerContainerId =
        appSettings.stache.googleAnalytics.tagManagerContainerId;
    }

    if (appSettings.stache.googleAnalytics.clientId) {
      this.analyticsClientId = appSettings.stache.googleAnalytics.clientId;
    }

    this.appName = this.configService.runtime.app.base.replace(/^\/|\/$/g, '');

    switch (appSettings.stache.googleAnalytics.enabled) {
      case false:
      case 'false':
        this.isEnabled = false;
        break;
      default:
        break;
    }
  }
}
