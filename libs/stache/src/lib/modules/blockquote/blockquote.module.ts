import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';

import { StacheBlockquoteComponent } from './blockquote.component';

@NgModule({
  declarations: [StacheBlockquoteComponent],
  imports: [CommonModule, SkyIconModule],
  exports: [StacheBlockquoteComponent],
})
export class StacheBlockquoteModule {}
