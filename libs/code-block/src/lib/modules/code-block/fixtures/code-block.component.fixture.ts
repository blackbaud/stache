import { Component } from '@angular/core';

@Component({
  selector: 'sky-test-component',
  templateUrl: './code-block.component.fixture.html',
})
export class SkyCodeBlockTestComponent {
  public code: string | undefined;

  public codeAsInnerContent: string | undefined;

  public fileName: string | undefined;

  public hideCopyToClipboard: boolean | undefined;

  public hideHeader: boolean | undefined;

  public languageType: string | undefined;
}
