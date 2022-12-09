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
import { VideoPlaygroundComponent } from './video-playground.component';

const routes: Routes = [
  {
    path: 'hero',
    component: HeroPlaygroundComponent,
  },
  { path: 'image', component: ImagePlaygroundComponent },
  { path: 'video', component: VideoPlaygroundComponent },
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
