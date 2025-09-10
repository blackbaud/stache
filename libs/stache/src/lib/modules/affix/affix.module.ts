import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StacheViewportAdapterService } from '../shared/viewport-adapter.service';
import { StacheWindowRef } from '../shared/window-ref';

import { StacheAffixTopDirective } from './affix-top.directive';
import { StacheAffixComponent } from './affix.component';

@NgModule({
  declarations: [StacheAffixComponent, StacheAffixTopDirective],
  imports: [CommonModule],
  exports: [StacheAffixComponent, StacheAffixTopDirective],
  providers: [StacheViewportAdapterService, StacheWindowRef],
})
export class StacheAffixModule {}
