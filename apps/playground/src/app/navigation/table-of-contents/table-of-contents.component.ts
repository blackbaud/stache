import { Component } from '@angular/core';

import { sideNavRoutes } from '../side-nav-routes';

@Component({
  selector: 'app-table-of-contents',
  templateUrl: './table-of-contents.component.html',
})
export class TableOfContentsComponent {
  public readonly sideNavRoutes = sideNavRoutes;
}
