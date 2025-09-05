import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';

import { StacheEditButtonComponent } from './edit-button.component';

@NgModule({
  declarations: [StacheEditButtonComponent],
  imports: [CommonModule, SkyIconModule],
  exports: [StacheEditButtonComponent],
})
export class StacheEditButtonModule {}
