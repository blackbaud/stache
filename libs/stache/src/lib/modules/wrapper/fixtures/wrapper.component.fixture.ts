import { Component, ViewChild } from '@angular/core';

import { StacheNavLink } from '../../nav/nav-link';
import { StacheWrapperComponent } from '../wrapper.component';

@Component({
  selector: 'stache-test-component',
  templateUrl: './wrapper.component.fixture.html',
})
export class StacheWrapperTestComponent {
  public heading = 'Second Heading';

  @ViewChild('testWrapper', {
    read: StacheWrapperComponent,
    static: false,
  })
  public testWrapper!: StacheWrapperComponent;

  public inPageRoutes: StacheNavLink[] | undefined;
}
