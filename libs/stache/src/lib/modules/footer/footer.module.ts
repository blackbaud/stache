import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StacheNavModule } from '../nav/nav.module';
import { SkyStacheResourcesModule } from '../shared/sky-stache-resources.module';

import { StacheFooterComponent } from './footer.component';

@NgModule({
  imports: [CommonModule, SkyStacheResourcesModule, StacheNavModule],
  declarations: [StacheFooterComponent],
  exports: [StacheFooterComponent],
})
export class StacheFooterModule {}
