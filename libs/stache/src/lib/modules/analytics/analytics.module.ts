import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { StacheWindowRef } from '../shared/window-ref';

import { StacheGoogleAnalyticsDirective } from './google-analytics.directive';

@NgModule({
  imports: [RouterModule],
  declarations: [StacheGoogleAnalyticsDirective],
  exports: [StacheGoogleAnalyticsDirective],
  providers: [StacheWindowRef],
})
export class StacheAnalyticsModule {}
