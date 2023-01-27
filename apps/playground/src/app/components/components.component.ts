import { Component } from '@angular/core';
import { StacheNavLink } from '@blackbaud/skyux-lib-stache';

@Component({
  selector: 'app-components-playground',
  templateUrl: './components.component.html',
})
export class ComponentsPlaygroundComponent {
  public actionButtonRoutes: StacheNavLink[] = [
    {
      icon: 'code',
      name: 'Code block',
      path: 'components/code-block/code-block',
    },
    {
      icon: 'photo',
      name: 'Hero',
      path: 'components/media/hero',
    },
    {
      icon: 'photo',
      name: 'Image',
      path: 'components/media/image',
    },
    {
      icon: 'video-camera',
      name: 'Video',
      path: 'components/media/video',
    },
    {
      icon: 'gift',
      name: 'Wrapper',
      path: 'components/stache/wrapper',
    },
  ];
}
