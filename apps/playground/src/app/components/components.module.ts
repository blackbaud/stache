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
import { StacheModule, StacheRouterModule } from '@blackbaud/skyux-lib-stache';

import { CodeBlockPlaygroundComponent } from './code-block/code-block-playground.component';
import { ComponentsPlaygroundComponent } from './components.component';
import { HeroPlaygroundComponent } from './media/hero-playground.component';
import { ImagePlaygroundComponent } from './media/image-playground.component';
import { MediaPlaygroundComponent } from './media/media.component';
import { VideoPlaygroundComponent } from './media/video-playground.component';
import { StachePlaygroundComponent } from './stache/stache-playground.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ComponentsPlaygroundComponent,
        data: {
          stache: {
            name: 'Components',
          },
        },
      },
      {
        path: 'code-block/code-block',
        component: CodeBlockPlaygroundComponent,
        data: {
          stache: {
            name: 'Code block',
          },
        },
      },
      {
        path: 'media',
        component: MediaPlaygroundComponent,
        data: {
          stache: {
            name: 'Media',
          },
        },
      },
      {
        path: 'media/hero',
        component: HeroPlaygroundComponent,
        data: {
          stache: {
            name: 'Hero',
          },
        },
      },
      {
        path: 'media/image',
        component: ImagePlaygroundComponent,
        data: {
          stache: {
            name: 'Image',
          },
        },
      },
      {
        path: 'media/video',
        component: VideoPlaygroundComponent,
        data: {
          stache: {
            name: 'Video',
          },
        },
      },
      {
        path: 'wrapper',
        component: StachePlaygroundComponent,
        data: {
          stache: {
            name: 'Wrapper',
          },
        },
      },
    ]),
  ],
})
class ComponentsPlaygroundRoutingModule {}

@NgModule({
  imports: [
    ComponentsPlaygroundRoutingModule,
    // This is needed for any top-level lazy-loaded modules.
    StacheRouterModule.forChild('components'),
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
    MediaPlaygroundComponent,
    StachePlaygroundComponent,
    VideoPlaygroundComponent,
  ],
})
export class ComponentsPlaygroundModule {}
