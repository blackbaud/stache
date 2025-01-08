import { Component, Input } from '@angular/core';

import { StacheNavLink } from '../nav-link';

@Component({
  selector: 'stache-test-component',
  templateUrl: './nav.component.fixture.html',
  standalone: false,
})
export class StacheNavTestComponent {
  @Input()
  public routes: StacheNavLink[] = [];
}
