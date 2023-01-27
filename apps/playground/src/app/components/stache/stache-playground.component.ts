import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StacheNavLink } from '@blackbaud/skyux-lib-stache';

@Component({
  selector: 'app-stache-playground',
  templateUrl: './stache-playground.component.html',
  styleUrls: ['./stache-playground.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StachePlaygroundComponent {
  public actionButtonRoutes: StacheNavLink[] = [
    {
      icon: 'thumbs-up',
      name: 'Action button 1',
      path: '/foobar-1',
    },
    {
      icon: 'thumbs-down',
      name: 'Action button 2',
      path: '/foobar-2',
    },
    {
      icon: 'file',
      name: 'Action button 3',
      path: '/foobar-3',
    },
  ];

  public breadcrumbsRoutes: StacheNavLink[] = [
    {
      name: 'Home',
      path: '/',
    },
    {
      name: 'Foo',
      path: '/foo',
    },
    {
      name: 'Bar',
      path: '/foo/bar',
    },
  ];

  public sidebarRoutes: StacheNavLink[] = [
    {
      name: 'Home',
      path: '/',
      children: [
        {
          name: 'Foobar 1',
          path: '/foobar-1',
        },
        {
          name: 'Foobar 2',
          path: '/foobar-2',
        },
      ],
    },
  ];
}
