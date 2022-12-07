import { Component, ViewChild } from '@angular/core';
import { SkyCopyToClipboardComponent } from '../clipboard.component';

@Component({
  selector: 'sky-clipboard-test',
  templateUrl: './clipboard.component.fixture.html'
})
export class SkyClipboardTestComponent {

  public ariaLabel: string | undefined;

  public ariaLabelledBy: string | undefined;

  @ViewChild(SkyCopyToClipboardComponent)
  public copyToClipboardComponent: SkyCopyToClipboardComponent;

  public title: string | undefined;

}
