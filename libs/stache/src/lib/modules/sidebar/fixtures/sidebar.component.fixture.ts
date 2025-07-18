import { Component, Input, ViewChild } from '@angular/core';

import { StacheNavLink } from '../../nav/nav-link';
import { StacheSidebarWrapperComponent } from '../sidebar-wrapper.component';

@Component({
  selector: 'sidebar-test-cmp',
  templateUrl: './sidebar.component.fixture.html',
  standalone: false,
})
export class SidebarFixtureComponent {
  @Input()
  public routes: StacheNavLink[] | undefined;

  @ViewChild(StacheSidebarWrapperComponent, {
    read: StacheSidebarWrapperComponent,
    static: false,
  })
  public sidebarWrapperComponent!: StacheSidebarWrapperComponent;
}
