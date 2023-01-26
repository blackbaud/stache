import { Component } from '@angular/core';

import { sideNavRoutes } from './side-nav-routes';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  preserveWhitespaces: true,
})
export class NavigationComponent {
  public readonly sideNavRoutes = sideNavRoutes;
}
