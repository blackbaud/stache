import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SkyThemeService } from '@skyux/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [AppRoutingModule, BrowserModule],
  providers: [SkyThemeService],
  bootstrap: [AppComponent],
})
export class AppModule {}
