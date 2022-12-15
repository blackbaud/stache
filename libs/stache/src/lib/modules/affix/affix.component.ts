import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import { Subscription } from 'rxjs';

import { StacheWindowRef } from '../shared/window-ref';

import { StacheAffixTopDirective } from './affix-top.directive';

@Component({
  selector: 'stache-affix',
  templateUrl: './affix.component.html',
  styleUrls: ['./affix.component.scss'],
})
export class StacheAffixComponent implements AfterViewInit, OnDestroy {
  @ViewChild('stacheAffixWrapper', {
    read: ElementRef,
    static: false,
  })
  public wrapper: ElementRef | undefined;

  public minHeightFormatted: string | undefined;

  public maxWidthFormatted: string | undefined;

  @ViewChild(StacheAffixTopDirective, {
    read: StacheAffixTopDirective,
    static: true,
  })
  public affixTopDirective: StacheAffixTopDirective | undefined;

  #windowRef: StacheWindowRef;
  #windowSubscription: Subscription;
  #changeDetector: ChangeDetectorRef;

  public constructor(
    windowRef: StacheWindowRef,
    changeDetector: ChangeDetectorRef
  ) {
    this.#windowRef = windowRef;
    this.#changeDetector = changeDetector;
    this.#windowSubscription = this.#windowRef.onResizeStream.subscribe(() => {
      this.#setElementRefDimensions();
    });
  }

  public ngAfterViewInit(): void {
    this.#setElementRefDimensions();
    this.#changeDetector.detectChanges();
  }

  public ngOnDestroy(): void {
    this.#windowSubscription.unsubscribe();
  }

  public getStyles(): Record<string, string | undefined> {
    return {
      'min-height': this.#getCssMinHeight(),
      'max-width': this.#getCssMaxWidth(),
      position: this.#getCssPosition(),
    };
  }

  #setElementRefDimensions(): void {
    /* istanbul ignore else */
    if (this.wrapper) {
      this.minHeightFormatted = `${this.wrapper.nativeElement.offsetHeight}px`;
      this.maxWidthFormatted = `${this.wrapper.nativeElement.offsetWidth}px`;
    }
  }

  #getCssPosition(): string {
    if (this.affixTopDirective?.isAffixed) {
      return 'relative';
    }

    return 'static';
  }

  #getCssMinHeight(): string | undefined {
    if (this.affixTopDirective?.isAffixed) {
      return this.minHeightFormatted;
    }

    return 'auto';
  }

  #getCssMaxWidth(): string | undefined {
    if (this.affixTopDirective?.isAffixed) {
      return this.maxWidthFormatted;
    }

    return '100%';
  }
}
