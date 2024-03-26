import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyAppConfig, SkyuxConfig } from '@skyux/config';

import { StacheRouteService } from '../router/route.service';

import { StacheFooterComponent } from './footer.component';
import { StacheFooterModule } from './footer.module';

describe('StacheFooterComponent', () => {
  let component: StacheFooterComponent;
  let fixture: ComponentFixture<StacheFooterComponent>;
  let mockConfigService: MockConfigService;
  let mockRouterService: MockRouterService;

  const footerConfig = {
    nav: {
      items: [
        {
          title: 'Privacy Policy',
          route: '/demos/privacy-policy',
        },
        {
          title: 'Terms of Use',
          route: '/demos/anchor-link',
        },
      ],
    },
    copyrightLabel: 'test copyright',
  };

  class MockConfigService {
    public skyux: SkyuxConfig = {
      app: {
        title: 'Some Name',
      },
      appSettings: {
        stache: {
          footer: footerConfig,
        },
      },
    };
  }

  class MockRouterService {
    public getActiveUrl(): string {
      return '';
    }
  }

  beforeEach(() => {
    mockConfigService = new MockConfigService();
    mockRouterService = new MockRouterService();
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, StacheFooterModule],
      providers: [
        { provide: StacheRouteService, useValue: mockRouterService },
        { provide: SkyAppConfig, useValue: mockConfigService },
      ],
    });

    fixture = TestBed.createComponent(StacheFooterComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should update the footer settings based on the skyux config', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.footerLinks).toExist();
    expect(component.copyrightLabel).toBe(footerConfig.copyrightLabel);
    expect(component.siteName).toBe(mockConfigService.skyux.app.title);
  });

  it('should map the footerLinks from the skyux config to stacheNavLinks', () => {
    component.ngOnInit();
    fixture.detectChanges();

    const mappedFooterLinks = footerConfig.nav.items.map((navItem) => {
      return {
        name: navItem.title,
        path: navItem.route,
        isActive: false,
        isCurrent: false,
      };
    });

    expect(component.footerLinks).toEqual(mappedFooterLinks);
  });

  it('should provide defaults if no values are supplied', () => {
    mockConfigService.skyux.appSettings.stache.footer = {};
    mockConfigService.skyux.app.title = undefined;
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.footerLinks).toEqual([]);

    expect(component.copyrightLabel).not.toEqual(footerConfig.copyrightLabel);
    expect(component.copyrightLabel).toEqual(
      'Blackbaud, Inc. All rights reserved.',
    );

    expect(component.siteName).toBe(undefined);
  });

  it('should be accessible', async () => {
    fixture.detectChanges();
    await expectAsync(fixture.debugElement.nativeElement).toBeAccessible();
  });
});
