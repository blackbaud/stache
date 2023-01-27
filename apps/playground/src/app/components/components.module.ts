import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  SkyCodeBlockModule,
  SkyCodeModule,
} from '@blackbaud/skyux-lib-code-block';
import {
  SkyHeroModule,
  SkyImageModule,
  SkyVideoModule,
} from '@blackbaud/skyux-lib-media';
import { StacheModule } from '@blackbaud/skyux-lib-stache';

import { CodeBlockPlaygroundComponent } from './code-block/code-block-playground.component';
import { ComponentsPlaygroundComponent } from './components.component';
import { HeroPlaygroundComponent } from './media/hero-playground.component';
import { ImagePlaygroundComponent } from './media/image-playground.component';
import { VideoPlaygroundComponent } from './media/video-playground.component';
import { StachePlaygroundComponent } from './stache/stache-playground.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ComponentsPlaygroundComponent,
      },
      {
        path: 'code-block/code-block',
        component: CodeBlockPlaygroundComponent,
      },
      {
        path: 'media/hero',
        component: HeroPlaygroundComponent,
      },
      { path: 'media/image', component: ImagePlaygroundComponent },
      { path: 'media/video', component: VideoPlaygroundComponent },
      { path: 'stache/wrapper', component: StachePlaygroundComponent },
    ]),
  ],
})
class ComponentsPlaygroundRoutingModule {}

@NgModule({
  imports: [
    ComponentsPlaygroundRoutingModule,
    CommonModule,
    SkyCodeBlockModule,
    SkyCodeModule,
    SkyHeroModule,
    SkyImageModule,
    SkyVideoModule,
    StacheModule,
  ],
  declarations: [
    CodeBlockPlaygroundComponent,
    ComponentsPlaygroundComponent,
    HeroPlaygroundComponent,
    ImagePlaygroundComponent,
    StachePlaygroundComponent,
    VideoPlaygroundComponent,
  ],
})
export class ComponentsPlaygroundModule {}
