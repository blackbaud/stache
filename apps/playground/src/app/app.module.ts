import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SkyAppConfig } from '@skyux/config';
import { SkyThemeService } from '@skyux/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [AppRoutingModule, BrowserAnimationsModule, BrowserModule],
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
