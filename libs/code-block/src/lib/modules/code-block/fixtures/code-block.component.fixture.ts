import { Component, input } from '@angular/core';

@Component({
  selector: 'sky-test-component',
  templateUrl: './code-block.component.fixture.html',
  standalone: false,
})
export class SkyCodeBlockTestComponent {
  public code = input<string | undefined>(undefined);

  public codeAsInnerContent = input<string | undefined>(undefined);

  public fileName = input<string | undefined>(undefined);

  public hideCopyToClipboard = input<boolean | undefined>(undefined);

  public hideHeader = input<boolean | undefined>(undefined);

  public languageType = input<string | undefined>(undefined);
}
