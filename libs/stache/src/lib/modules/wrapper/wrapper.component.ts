import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SkyAppConfig } from '@skyux/config';

import lodashGet from 'lodash.get';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { StacheNavLink } from '../nav/nav-link';
import { StachePageAnchorService } from '../page-anchor/page-anchor.service';
import { StacheOmnibarAdapterService } from '../shared/omnibar-adapter.service';
import { StacheWindowRef } from '../shared/window-ref';

import { StacheTitleService } from './title.service';

const DEFAULT_LAYOUT = 'sidebar';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'stache',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss'],
})
export class StacheWrapperComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input()
  public pageTitle: string | undefined;

  @Input()
  public windowTitle: string | undefined;

  @Input()
  public navTitle: string | undefined;

  @Input()
  public set layout(value: string | undefined) {
    this.#_layout = value || DEFAULT_LAYOUT;
  }
  public get layout(): string {
    return this.#_layout;
  }

  @Input()
  public sidebarRoutes: StacheNavLink[] | undefined;

  @Input()
  public breadcrumbsRoutes: StacheNavLink[] | undefined;

  @Input()
  public set showBreadcrumbs(value: boolean | undefined) {
    this.#_showBreadcrumbs = value !== false;
  }
  public get showBreadcrumbs(): boolean {
    return this.#_showBreadcrumbs;
  }

  @Input()
  public set showEditButton(value: boolean | undefined) {
    this.#_showEditButton = value ?? this.#checkEditButtonUrl();
  }
  public get showEditButton(): boolean {
    return this.#_showEditButton;
  }

  @Input()
  public set showFooter(value: boolean | undefined) {
    this.#_showFooter = value ?? this.#checkFooterData();
  }
  public get showFooter(): boolean {
    return this.#_showFooter;
  }

  @Input()
  public showTableOfContents: boolean | undefined = false;

  @Input()
  public set showBackToTop(value: boolean | undefined) {
    this.#_showBackToTop = value !== false;
  }
  public get showBackToTop(): boolean {
    return this.#_showBackToTop;
  }

  @Input()
  public set showInNav(value: boolean | undefined) {
    this.#_showInNav = value !== false;
  }
  public get showInNav(): boolean {
    return this.#_showInNav;
  }

  @Input()
  public inPageRoutes: StacheNavLink[] | undefined;

  #_layout = DEFAULT_LAYOUT;
  #_showBackToTop = true;
  #_showInNav = true;
  #_showBreadcrumbs = true;
  #_showEditButton = false;
  #_showFooter = false;
  #ngUnsubscribe = new Subject<void>();
  #config: SkyAppConfig;
  #pageAnchorSvc: StachePageAnchorService;
  #titleSvc: StacheTitleService;
  #route: ActivatedRoute;
  #windowRef: StacheWindowRef;
  #changeDetectorRef: ChangeDetectorRef;
  #omnibarSvc: StacheOmnibarAdapterService;

  constructor(
    config: SkyAppConfig,
    pageAnchorSvc: StachePageAnchorService,
    titleSvc: StacheTitleService,
    route: ActivatedRoute,
    windowRef: StacheWindowRef,
    changeDetectorRef: ChangeDetectorRef,
    omnibarSvc: StacheOmnibarAdapterService
  ) {
    this.#config = config;
    this.#pageAnchorSvc = pageAnchorSvc;
    this.#titleSvc = titleSvc;
    this.#route = route;
    this.#windowRef = windowRef;
    this.#changeDetectorRef = changeDetectorRef;
    this.#omnibarSvc = omnibarSvc;
  }

  public ngOnInit(): void {
    this.#omnibarSvc.checkForOmnibar();
    if (!this.inPageRoutes) {
      this.#pageAnchorSvc.pageAnchorsStream
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((anchors: StacheNavLink[]) => {
          this.inPageRoutes = anchors;
          this.#checkRouteHash();
          this.#changeDetectorRef.detectChanges();
        });
    }
  }

  public ngAfterViewInit(): void {
    const preferredDocumentTitle = this.#getPreferredDocumentTitle();
    if (preferredDocumentTitle) {
      this.#titleSvc.setTitle(preferredDocumentTitle);
    }
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  #getPreferredDocumentTitle(): string | undefined {
    return (
      this.windowTitle ||
      this.pageTitle ||
      this.navTitle ||
      this.#getTutorialHeader()
    );
  }

  #getTutorialHeader(): string | undefined {
    const currentTutorialHeader =
      this.#windowRef.nativeWindow.document.querySelector(
        `.stache-tutorial-heading`
      );
    if (currentTutorialHeader && currentTutorialHeader.textContent) {
      return currentTutorialHeader.textContent.trim();
    }
    return;
  }

  #checkEditButtonUrl(): boolean {
    const url = lodashGet(
      this.#config,
      'skyux.appSettings.stache.editButton.url'
    );
    return url !== undefined;
  }

  #checkFooterData(): boolean {
    const footerData = lodashGet(
      this.#config,
      'skyux.appSettings.stache.footer'
    );
    return footerData !== undefined;
  }

  #checkRouteHash(): void {
    this.#route.fragment.pipe(take(1)).subscribe((fragment) => {
      if (fragment) {
        this.#pageAnchorSvc.scrollToAnchor(fragment);
      }
    });
  }
}
