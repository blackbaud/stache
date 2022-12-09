import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  SkyHeroModule,
  SkyImageModule,
  SkyVideoModule,
} from '@blackbaud/skyux-lib-media';

import { HeroPlaygroundComponent } from './hero-playground.component';
import { ImagePlaygroundComponent } from './image-playground.component';
import { MediaPlaygroundComponent } from './index.component';
import { VideoPlaygroundComponent } from './video-playground.component';

const routes: Routes = [
  {
    path: 'hero',
    component: HeroPlaygroundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
class MediaPlaygroundRoutingModule {}

@NgModule({
  declarations: [
    HeroPlaygroundComponent,
    ImagePlaygroundComponent,
    MediaPlaygroundComponent,
    VideoPlaygroundComponent,
  ],
  imports: [
    CommonModule,
    MediaPlaygroundRoutingModule,
    SkyHeroModule,
    SkyImageModule,
    SkyVideoModule,
  ],
})
export class MediaPlaygroundModule {}
