import { Component } from '@angular/core';

import { sideNavRoutes } from '../../side-nav-routes';

@Component({
  selector: 'app-recursion',
  templateUrl: './recursion.component.html',
  preserveWhitespaces: true,
})
export class RecursionComponent {
  public readonly sideNavRoutes = sideNavRoutes;
}
