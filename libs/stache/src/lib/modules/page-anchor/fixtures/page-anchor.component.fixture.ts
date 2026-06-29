import { Component, input } from '@angular/core';

@Component({
  selector: 'stache-test-page-anchor',
  templateUrl: './page-anchor.component.fixture.html',
  standalone: false,
})
export class StachePageAnchorTestComponent {
  public anchorContent = input<string>('');

  public anchorId = input<string>('');
}
