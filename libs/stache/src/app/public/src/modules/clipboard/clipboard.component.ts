import { Component, Input, OnInit } from '@angular/core';
import { StacheCopyToClipboardService } from './clipboard.service';
import { StacheWindowRef } from '../shared';

@Component({
  selector: 'stache-copy-to-clipboard',
  templateUrl: './clipboard.component.html'
})
export class StacheCopyToClipboardComponent implements OnInit {
  @Input()
  public copyTarget: HTMLElement;

  @Input()
  public buttonText: string;

  @Input()
  public buttonClickedText: string;

  public buttonActive: boolean = false;
  public enabled: boolean = false;
  private timeout: any;
  private window: Window;

  constructor(
    private clipboardService: StacheCopyToClipboardService,
    private windowRef: StacheWindowRef
  ) {
    this.window = this.windowRef.nativeWindow;
  }

  public ngOnInit() {
    this.enabled = this.clipboardService.verifyCopyCommandBrowserSupport();
  }

  public copyToClipboard() {
    this.buttonActive = true;
    this.clipboardService.copyContent(this.copyTarget);

    if (this.timeout) {
      this.window.clearTimeout(this.timeout);
    }

    this.timeout = this.window.setTimeout(() => {
      this.buttonActive = false;
    }, 1000);
  }
}
