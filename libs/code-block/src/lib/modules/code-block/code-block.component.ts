import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import Prism from 'prismjs';
import 'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace';

import { prismLanguages } from './prism-languages';

const DEFAULT_LANGUAGE = 'markup';

@Component({
  selector: 'sky-code-block',
  templateUrl: './code-block.component.html',
  styleUrls: ['./code-block.component.scss'],
  standalone: false,
})
export class SkyCodeBlockComponent implements AfterViewInit, OnChanges {
  @Input()
  public set code(value: string | undefined) {
    if (value !== this.#_code) {
      this.#_code = value;
      this.#updateCodeBlockDisplay();
    }
  }

  public get code(): string | undefined {
    return this.#_code;
  }

  @Input()
  public fileName: string | undefined;

  @Input()
  public set languageType(value: string | undefined) {
    if (value && this.#validLanguages.indexOf(value) > -1) {
      this.#_languageType = value;
    } else {
      this.#_languageType = DEFAULT_LANGUAGE;
    }

    this.#setDisplayName(value);
    this.#updateCodeBlockClassName();
  }

  public get languageType(): string {
    return this.#_languageType;
  }

  @Input()
  public hideCopyToClipboard: boolean | undefined = false;

  @Input()
  public hideHeader: boolean | undefined;

  @ViewChild('codeFromContent', { read: ElementRef, static: true })
  public codeTemplateRef: ElementRef | undefined;

  public codeBlockClassName: string | undefined;
  public displayName: string | undefined;
  public output: SafeHtml;

  #_code: string | undefined;
  #_languageType: string = DEFAULT_LANGUAGE;
  #changeDetector: ChangeDetectorRef;
  #sanitizer: DomSanitizer;
  #validLanguages: string[];

  constructor(changeDetector: ChangeDetectorRef, sanitizer: DomSanitizer) {
    this.#changeDetector = changeDetector;
    this.#sanitizer = sanitizer;
    this.#validLanguages = Object.keys(Prism.languages);

    // Create an empty SafeHtml value on init since output cannot be undefined.
    this.output = sanitizer.bypassSecurityTrustHtml('');
  }

  public ngAfterViewInit(): void {
    this.#updateCodeBlockClassName();
    this.#updateCodeBlockDisplay();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['fileName'] ||
      changes['hideCopyToClipboard'] ||
      changes['hideHeader']
    ) {
      this.#updateHeaderVisibility();
    }
  }

  #updateHeaderVisibility(): void {
    this.hideHeader =
      this.hideHeader ||
      (!this.displayName && !this.fileName && this.hideCopyToClipboard);
  }

  #updateCodeBlockClassName(): void {
    this.codeBlockClassName = `language-${this.languageType}`;
    this.#changeDetector.markForCheck();
  }

  #setDisplayName(value = ''): void {
    this.displayName = value ? prismLanguages[value] : undefined;
    this.#changeDetector.markForCheck();
  }

  #formatCode(code: string): string {
    return Prism.plugins['NormalizeWhitespace'].normalize(code, {
      'remove-trailing': true,
      'remove-indent': true,
      'left-trim': true,
      'right-trim': true,
      indent: 0,
      'remove-initial-line-feed': true,
      'tabs-to-spaces': 2,
    });
  }

  #highlightCode(code: string): string {
    return Prism.highlight(
      code,
      Prism.languages[this.languageType],
      this.languageType,
    );
  }

  #updateCodeBlockDisplay(): void {
    if (this.codeTemplateRef) {
      const textContent = this.codeTemplateRef.nativeElement.textContent;
      let code = this.code || textContent;

      if (code) {
        code = this.#formatCode(code);
        code = this.#highlightCode(code);
      }

      this.output = this.#sanitizer.bypassSecurityTrustHtml(code);
      this.#changeDetector.detectChanges();
    }
  }
}
