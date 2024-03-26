import { SkyCopyToClipboardService } from './clipboard.service';

describe('SkyCopyToClipboardService', () => {
  let clipboardService: SkyCopyToClipboardService;
  const testContent = 'Test demo content';
  const testElement = document.createElement('div');
  let mockText: string;
  testElement.innerText = testContent;

  beforeEach(() => {
    const mockWindowRef = {
      nativeWindow: {
        navigator: {
          clipboard: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            writeText(_: string): void {
              /* */
            },
          },
        },
      },
    };

    clipboardService = new SkyCopyToClipboardService(mockWindowRef);

    spyOn(
      mockWindowRef.nativeWindow.navigator.clipboard,
      'writeText',
    ).and.callFake((text: string) => {
      mockText = text;
      return Promise.resolve();
    });
  });

  it('should exist', () => {
    expect(clipboardService).toBeDefined();
  });

  it('should copy text from a textarea element', () => {
    const textareaElement = document.createElement('textarea');
    textareaElement.value = 'test string value';
    clipboardService.copyContent(textareaElement);
    expect(mockText).toEqual('test string value');
  });

  it('should copy text from an input element', () => {
    const inputElement = document.createElement('input');
    inputElement.value = 'test string value';
    clipboardService.copyContent(inputElement);
    expect(mockText).toEqual('test string value');
  });

  it('should copy text from html elements', () => {
    const htmlElement = document.createElement('div');
    htmlElement.innerText = 'test string value';
    clipboardService.copyContent(htmlElement);
    expect(mockText).toEqual('test string value');
  });

  it('should copy text from nested html elements', () => {
    const htmlElement = document.createElement('div');
    htmlElement.innerHTML = '<p>test string value</p>';
    clipboardService.copyContent(htmlElement);
    expect(mockText).toEqual('test string value');
  });

  it('should copy text from nested html elements in multiple teirs', () => {
    const htmlElement = document.createElement('div');
    htmlElement.innerHTML = `
    <div>
      upper test string
      <p>
        lower test string
      </p>
    </div>`;
    clipboardService.copyContent(htmlElement);
    expect(mockText).toContain('upper test string');
    expect(mockText).toContain('lower test string');
    expect(mockText).not.toContain('<p>');
    expect(mockText).not.toContain('</p>');
    expect(mockText).not.toContain('<div>');
    expect(mockText).not.toContain('</div>');
  });
});
