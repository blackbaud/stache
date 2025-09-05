import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyAppWindowRef } from '@skyux/core';
import { SkyIconModule } from '@skyux/icon';

import { SkyClipboardResourcesModule } from '../shared/sky-clipboard-resources.module';

import { SkyCopyToClipboardComponent } from './clipboard.component';
import { SkyCopyToClipboardService } from './clipboard.service';

@NgModule({
  declarations: [SkyCopyToClipboardComponent],
  imports: [CommonModule, SkyClipboardResourcesModule, SkyIconModule],
  exports: [SkyCopyToClipboardComponent],
  providers: [SkyCopyToClipboardService, SkyAppWindowRef],
})
export class SkyClipboardModule {}
