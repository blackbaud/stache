import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import {
  SkyClipboardModule,
  SkyCopyToClipboardService,
} from '@blackbaud/skyux-lib-clipboard';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { SkyCodeBlockResourcesModule } from '../shared/sky-code-block-resources.module';

import { SkyCodeBlockComponent } from './code-block.component';
import { SkyCodeBlockTestComponent } from './fixtures/code-block.component.fixture';

class MockClipboardService {
  public copyContent(): void {
    /* */
  }
}

describe('SkyCodeBlockComponent', () => {
  let component: SkyCodeBlockTestComponent;
  let fixture: ComponentFixture<SkyCodeBlockTestComponent>;
  let element: HTMLElement;
  let mockClipboardService: MockClipboardService;

  beforeEach(() => {
    mockClipboardService = new MockClipboardService();

    TestBed.configureTestingModule({
      declarations: [SkyCodeBlockTestComponent, SkyCodeBlockComponent],
      providers: [
        { provide: SkyCopyToClipboardService, useValue: mockClipboardService },
      ],
      imports: [SkyClipboardModule, SkyCodeBlockResourcesModule],
    });

    fixture = TestBed.createComponent(SkyCodeBlockTestComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should accept a string of code in the [code] attribute', () => {
    const code = '<p>asdf</p>';
    component.code = code;
    fixture.detectChanges();
    expect(element.querySelector('.sky-code-output')).toHaveText(code);
  });

  it('should not honor angular bindings in the [code] attribute', () => {
    const code = '<p>{{asdf}}</p>';
    component.code = code;
    fixture.detectChanges();
    expect(element.querySelector('.sky-code-output')).toHaveText(code);
  });

  it('should handle dynamically changing input via the code input property', fakeAsync(() => {
    const code = '{ "foo": "bar" }';
    component.code = code;
    fixture.detectChanges();
    expect(element.querySelector('.sky-code-output')?.textContent).toContain(
      code
    );

    const newCode = '{ "foo": "baz" }';
    component.code = newCode;
    fixture.detectChanges();
    expect(element.querySelector('.sky-code-output')?.textContent).toContain(
      newCode
    );
  }));

  it('should convert inner HTML to a string', () => {
    const code = '<p>Hello, {{name}}!</p>';
    component.codeAsInnerContent = code;
    fixture.detectChanges();
    expect(element.querySelector('.sky-code-output')?.textContent).toContain(
      code
    );
  });

  it('should not honor angular bindings in the inner HTML', () => {
    const code = '<p>Hello, {{name}}!</p>';
    component.codeAsInnerContent = code;
    fixture.detectChanges();
    expect(element.querySelector('.sky-code-output')?.textContent).toContain(
      code
    );
  });

  it('should handle invalid language types', () => {
    const code = '<p></p>';
    component.code = code;
    fixture.detectChanges();
    expect(element.querySelector('code.language-markup')).toExist();

    component.languageType = 'invalidType';
    fixture.detectChanges();
    expect(element.querySelector('code.language-markup')).toExist();

    component.languageType = 'javascript';
    fixture.detectChanges();
    expect(element.querySelector('code.language-javascript')).toExist();

    component.languageType = undefined;
    fixture.detectChanges();
    expect(element.querySelector('code.language-markup')).toExist();
  });

  it('should show copy to clipboard button', () => {
    const code = '<p></p>';
    component.code = code;
    fixture.detectChanges();
    expect(element.querySelector('sky-copy-to-clipboard')).toExist();
  });

  it('should hide copy to clipboard button', () => {
    const code = '<p></p>';
    component.code = code;
    component.hideCopyToClipboard = true;
    fixture.detectChanges();
    expect(element.querySelector('sky-copy-to-clipboard')).not.toExist();
  });

  it('should show the header if languageType is defined', () => {
    const code = '<p></p>';
    component.code = code;
    component.languageType = 'csharp';
    fixture.detectChanges();
    expect(element.querySelector('.sky-code-block-header')).toExist();
  });

  it('should show the header if copyToClipboard is shown', () => {
    const code = '<p></p>';
    component.code = code;
    component.hideCopyToClipboard = false;
    fixture.detectChanges();
    expect(element.querySelector('.sky-code-block-header')).toExist();
  });

  it('should hide the header if hideHeader is true', () => {
    const code = '<p></p>';
    component.code = code;
    component.hideHeader = true;
    fixture.detectChanges();
    expect(element.querySelector('.sky-code-block-header')).not.toExist();
  });

  it('should hide the header if copyToClipboard is false, and languageType and fileName are undefined', () => {
    const code = '<p></p>';
    component.code = code;
    component.hideCopyToClipboard = true;
    component.languageType = undefined;
    component.fileName = undefined;
    fixture.detectChanges();
    expect(element.querySelector('.sky-code-block-header')).not.toExist();
  });

  it('should update header visibility when inputs change', () => {
    component.code = '<p></p>';
    component.hideHeader = true;
    fixture.detectChanges();
    expect(element.querySelector('.sky-code-block-header')).not.toExist();
    component.hideHeader = false;
    component.fileName = 'foo.txt';
    fixture.detectChanges();
    expect(element.querySelector('.sky-code-block-header')).toExist();
  });

  it('should handle undefined code', () => {
    component.code = undefined;
    component.codeAsInnerContent = undefined;
    fixture.detectChanges();
    expect(element.querySelector('.sky-code-output')?.textContent).toEqual('');
  });

  it('should pass accessibility', async () => {
    const code = '<p></p>';
    component.code = code;
    fixture.detectChanges();
    await expectAsync(element).toBeAccessible();
  });
});
