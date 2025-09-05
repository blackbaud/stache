import { Component } from '@angular/core';
import { StacheNavLink } from '@blackbaud/skyux-lib-stache';

@Component({
  selector: 'app-components-playground',
  templateUrl: './components.component.html',
  standalone: false,
})
export class ComponentsPlaygroundComponent {
  public actionButtonRoutes: StacheNavLink[] = [
    {
      icon: 'code',
      name: 'Code block',
      path: 'components/code-block/code-block',
    },
    {
      icon: 'window-header-horizontal',
      name: 'Hero',
      path: 'components/media/hero',
    },
    {
      icon: 'shapes',
      name: 'Image',
      path: 'components/media/image',
    },
    {
      icon: 'video',
      name: 'Video',
      path: 'components/media/video',
    },
    {
      icon: 'gift',
      name: 'Wrapper',
      path: 'components/wrapper',
    },
  ];
}
