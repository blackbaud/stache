import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StacheModule } from '@blackbaud/skyux-lib-stache';
import { SkyAppConfig } from '@skyux/config';
import { SkyThemeService } from '@skyux/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DesignPlaygroundModule } from './design/design.module';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    DesignPlaygroundModule,
    StacheModule,
  ],
  providers: [
    SkyThemeService,
    {
      provide: SkyAppConfig,
      useValue: {
        skyux: { app: { title: 'Stache Playground' } },
        runtime: { app: { base: '/' } },
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
