import { Component, Input } from '@angular/core';

import { StacheNavLink } from '../../nav/nav-link';

@Component({
  selector: 'stache-toc-test',
  templateUrl: './toc-test.component.html',
  standalone: false,
})
export class TableOfContentsTestComponent {
  @Input()
  public tocRoutes: StacheNavLink[] | undefined;
}
