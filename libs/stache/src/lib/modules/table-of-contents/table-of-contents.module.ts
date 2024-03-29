import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StacheAffixModule } from '../affix/affix.module';
import { StacheNavModule } from '../nav/nav.module';
import { SkyStacheResourcesModule } from '../shared/sky-stache-resources.module';
import { StacheWindowRef } from '../shared/window-ref';

import { StacheTableOfContentsWrapperComponent } from './table-of-contents-wrapper.component';
import { StacheTableOfContentsComponent } from './table-of-contents.component';

@NgModule({
  declarations: [
    StacheTableOfContentsWrapperComponent,
    StacheTableOfContentsComponent,
  ],
  imports: [
    CommonModule,
    StacheNavModule,
    StacheAffixModule,
    SkyStacheResourcesModule,
  ],
  exports: [
    StacheTableOfContentsWrapperComponent,
    StacheTableOfContentsComponent,
  ],
  providers: [StacheWindowRef],
})
export class StacheTableOfContentsModule {}
