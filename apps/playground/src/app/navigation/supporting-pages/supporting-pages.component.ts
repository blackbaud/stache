import { Component } from '@angular/core';

import { sideNavRoutes } from '../side-nav-routes';

@Component({
  selector: 'app-supporting-pages',
  templateUrl: './supporting-pages.component.html',
})
export class SupportingPagesComponent {
  public readonly sideNavRoutes = sideNavRoutes;
}
