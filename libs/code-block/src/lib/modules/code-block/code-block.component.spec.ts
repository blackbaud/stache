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
    element = fixture.nativeElement;
  });

  it('should accept a string of code in the [code] attribute', () => {
    const code = '<p>asdf</p>';
    fixture.componentRef.setInput('code', code);
    fixture.detectChanges();
    expect(element.querySelector('.sky-code-output')).toHaveText(code);
  });

  it('should not honor angular bindings in the [code] attribute', () => {
    const code = '<p>{{asdf}}</p>';
    fixture.componentRef.setInput('code', code);
    fixture.detectChanges();
    expect(element.querySelector('.sky-code-output')).toHaveText(code);
  });

  it('should handle dynamically changing input via the code input property', fakeAsync(() => {
    const code = '{ "foo": "bar" }';
    fixture.componentRef.setInput('code', code);
    fixture.detectChanges();
    expect(element.querySelector('.sky-code-output')?.textContent).toContain(
      code,
    );

    const newCode = '{ "foo": "baz" }';
    fixture.componentRef.setInput('code', newCode);
    fixture.detectChanges();
    expect(element.querySelector('.sky-code-output')?.textContent).toContain(
      newCode,
    );
  }));

  it('should convert inner HTML to a string', () => {
    const code = '<p>Hello, {{name}}!</p>';
    fixture.componentRef.setInput('codeAsInnerContent', code);
    fixture.detectChanges();
    expect(element.querySelector('.sky-code-output')?.textContent).toContain(
      code,
    );
  });

  it('should not honor angular bindings in the inner HTML', () => {
    const code = '<p>Hello, {{name}}!</p>';
    fixture.componentRef.setInput('codeAsInnerContent', code);
    fixture.detectChanges();
    expect(element.querySelector('.sky-code-output')?.textContent).toContain(
      code,
    );
  });

  it('should handle invalid language types', () => {
    const code = '<p></p>';
    fixture.componentRef.setInput('code', code);
    fixture.detectChanges();
    expect(element.querySelector('code.language-markup')).toExist();

    fixture.componentRef.setInput('languageType', 'invalidType');
    fixture.detectChanges();
    expect(element.querySelector('code.language-markup')).toExist();

    fixture.componentRef.setInput('languageType', 'javascript');
    fixture.detectChanges();
    expect(element.querySelector('code.language-javascript')).toExist();

    fixture.componentRef.setInput('languageType', undefined);
    fixture.detectChanges();
    expect(element.querySelector('code.language-markup')).toExist();
  });

  it('should show copy to clipboard button', () => {
    const code = '<p></p>';
    fixture.componentRef.setInput('code', code);
    fixture.detectChanges();
    expect(element.querySelector('sky-copy-to-clipboard')).toExist();
  });

  it('should hide copy to clipboard button', () => {
    const code = '<p></p>';
    fixture.componentRef.setInput('code', code);
    fixture.componentRef.setInput('hideCopyToClipboard', true);
    fixture.detectChanges();
    expect(element.querySelector('sky-copy-to-clipboard')).not.toExist();
  });

  it('should show the header if languageType is defined', () => {
    const code = '<p></p>';
    fixture.componentRef.setInput('code', code);
    fixture.componentRef.setInput('languageType', 'csharp');
    fixture.detectChanges();
    expect(element.querySelector('.sky-code-block-header')).toExist();
  });

  it('should show the header if copyToClipboard is shown', () => {
    const code = '<p></p>';
    fixture.componentRef.setInput('code', code);
    fixture.componentRef.setInput('hideCopyToClipboard', false);
    fixture.detectChanges();
    expect(element.querySelector('.sky-code-block-header')).toExist();
  });

  it('should hide the header if hideHeader is true', () => {
    const code = '<p></p>';
    fixture.componentRef.setInput('code', code);
    fixture.componentRef.setInput('hideHeader', true);
    fixture.detectChanges();
    expect(element.querySelector('.sky-code-block-header')).not.toExist();
  });

  it('should hide the header if copyToClipboard is false, and languageType and fileName are undefined', () => {
    const code = '<p></p>';
    fixture.componentRef.setInput('code', code);
    fixture.componentRef.setInput('hideCopyToClipboard', true);
    fixture.componentRef.setInput('languageType', undefined);
    fixture.componentRef.setInput('fileName', undefined);
    fixture.detectChanges();
    expect(element.querySelector('.sky-code-block-header')).not.toExist();
  });

  it('should update header visibility when inputs change', () => {
    fixture.componentRef.setInput('code', '<p></p>');
    fixture.componentRef.setInput('hideHeader', true);
    fixture.detectChanges();
    expect(element.querySelector('.sky-code-block-header')).not.toExist();
    fixture.componentRef.setInput('hideHeader', false);
    fixture.componentRef.setInput('fileName', 'foo.txt');
    fixture.detectChanges();
    expect(element.querySelector('.sky-code-block-header')).toExist();
  });

  it('should handle undefined code', () => {
    fixture.componentRef.setInput('code', undefined);
    fixture.componentRef.setInput('codeAsInnerContent', undefined);
    fixture.detectChanges();
    expect(element.querySelector('.sky-code-output')?.textContent).toEqual('');
  });

  it('should pass accessibility', async () => {
    const code = '<p></p>';
    fixture.componentRef.setInput('code', code);
    fixture.detectChanges();
    await expectAsync(element).toBeAccessible();
  });
});
