import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';

import { StacheNavModule } from '../nav/nav.module';
import { SkyStacheResourcesModule } from '../shared/sky-stache-resources.module';
import { StacheWindowRef } from '../shared/window-ref';

import { StacheSidebarWrapperComponent } from './sidebar-wrapper.component';
import { StacheSidebarComponent } from './sidebar.component';

@NgModule({
  declarations: [StacheSidebarComponent, StacheSidebarWrapperComponent],
  imports: [
    CommonModule,
    StacheNavModule,
    SkyIconModule,
    SkyStacheResourcesModule,
  ],
  exports: [StacheSidebarComponent, StacheSidebarWrapperComponent],
  providers: [StacheWindowRef],
})
export class StacheSidebarModule {}
