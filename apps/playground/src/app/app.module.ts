import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StacheModule } from '@blackbaud/skyux-lib-stache';
import { SkyAppConfig } from '@skyux/config';
import { SkyThemeService } from '@skyux/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DesignPlaygroundModule } from './design/design.module';
import { HomeComponent } from './home.component';
import { NotFoundComponent } from './not-found.component';
import { SkyThemeSelectorComponent } from './shared/theme-selector/theme-selector.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, NotFoundComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    DesignPlaygroundModule,
    SkyThemeSelectorComponent,
    StacheModule,
  ],
  providers: [
    SkyThemeService,
    {
      provide: SkyAppConfig,
      useValue: {
        skyux: {
          app: { title: 'Stache Playground' },
          appSettings: {
            stache: {
              editButton: { url: '/edit' },
              footer: {
                copyrightLabel: 'My Company, Inc.',
                nav: {
                  items: [
                    {
                      title: 'Privacy Policy',
                      route: '/privacy-policy',
                    },
                    {
                      title: 'Terms of Use',
                      route: '/terms-of-use',
                    },
                  ],
                },
              },
            },
          },
        },
        runtime: { app: { base: '/' } },
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
