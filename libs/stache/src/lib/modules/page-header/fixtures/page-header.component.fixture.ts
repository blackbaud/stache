import { Component, Input } from '@angular/core';

@Component({
  selector: 'stache-test-component',
  templateUrl: './page-header.component.fixture.html',
  standalone: false,
})
export class StachePageHeaderTestComponent {
  @Input()
  public headerText: string | undefined;
}
