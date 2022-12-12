import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StacheModule } from '@blackbaud/skyux-lib-stache';

import { StachePlaygroundRoutingModule } from './stache-playground-routing.module';
import { StachePlaygroundComponent } from './stache-playground.component';

@NgModule({
  declarations: [StachePlaygroundComponent],
  imports: [CommonModule, StacheModule, StachePlaygroundRoutingModule],
})
export class StachePlaygroundModule {}
