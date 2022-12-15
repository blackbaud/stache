import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { StacheNavLink } from '../nav/nav-link';
import { StacheRouteService } from '../router/route.service';

import { StachePageAnchorService } from './page-anchor.service';

@Component({
  selector: 'stache-page-anchor',
  templateUrl: './page-anchor.component.html',
  styleUrls: ['./page-anchor.component.scss'],
})
export class StachePageAnchorComponent
  implements
    StacheNavLink,
    OnDestroy,
    AfterViewInit,
    OnInit,
    AfterViewChecked,
    AfterContentInit
{
  @Input()
  public anchorId: string | undefined;

  public name = '';
  public fragment = '';
  public path: string[] = [];
  public offsetTop = 0;
  public anchorStream = new BehaviorSubject<StacheNavLink>({
    name: this.name,
    path: '/',
  });

  #textContent = '';
  #ngUnsubscribe = new Subject<void>();
  #elementRef: ElementRef;
  #anchorSvc: StachePageAnchorService;
  #changeDetectorRef: ChangeDetectorRef;
  #routeSvc: StacheRouteService;

  public constructor(
    elementRef: ElementRef,
    anchorSvc: StachePageAnchorService,
    changeDetectorRef: ChangeDetectorRef,
    routeSvc: StacheRouteService
  ) {
    this.#elementRef = elementRef;
    this.#anchorSvc = anchorSvc;
    this.#changeDetectorRef = changeDetectorRef;
    this.#routeSvc = routeSvc;
  }

  public ngOnInit(): void {
    this.#anchorSvc.refreshRequestedStream
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        this.#updatePageAnchor();
      });
  }

  public ngAfterViewInit(): void {
    this.path = [this.#routeSvc.getActiveUrl()];
    this.#updatePageAnchor();
    this.#anchorSvc.addAnchor(this.anchorStream);
    this.#changeDetectorRef.detectChanges();
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
    this.anchorStream.complete();
  }

  public ngAfterContentInit(): void {
    this.#textContent = this.#elementRef.nativeElement.textContent;
    this.offsetTop = this.#getOffset(this.#elementRef.nativeElement);
  }

  public ngAfterViewChecked(): void {
    const currentContent = this.#elementRef.nativeElement.textContent;
    const currentOffset = this.#getOffset(this.#elementRef.nativeElement);

    if (
      currentContent !== this.#textContent ||
      currentOffset !== this.offsetTop
    ) {
      this.#textContent = currentContent;
      this.#updatePageAnchor();
    }
  }

  public scrollToAnchor(): void {
    this.#anchorSvc.scrollToAnchor(this.fragment);
  }

  #setValues(): void {
    const element = this.#elementRef.nativeElement;
    this.name = this.#getName(element);
    this.fragment = this.anchorId || this.#getFragment(this.name);
    this.offsetTop = this.#getOffset(element);
  }

  #updatePageAnchor(): void {
    this.#setValues();
    this.anchorStream.next({
      path: this.path,
      name: this.name,
      fragment: this.fragment,
      offsetTop: this.offsetTop,
    });
    this.#changeDetectorRef.detectChanges();
  }

  #getOffset(element: HTMLElement): number {
    let offset = element.offsetTop;
    let el = element;

    while (el.offsetParent) {
      const parent = el.offsetParent as HTMLElement;
      offset += parent.offsetTop;
      el = parent;
    }

    return offset;
  }

  #getName(element: HTMLElement): string {
    /*istanbul ignore else*/
    if (element.textContent) {
      return element.textContent.trim();
    }

    return '';
  }

  #getFragment(name: string): string {
    return name
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }
}
