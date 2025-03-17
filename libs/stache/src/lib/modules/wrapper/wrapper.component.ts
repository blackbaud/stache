/* tslint:disable:component-selector */
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  booleanAttribute,
  input,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SkyAppConfig } from '@skyux/config';

import lodashGet from 'lodash.get';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { StacheJsonDataService } from '../json-data/json-data.service';
import { StacheLayoutType } from '../layout/layout-type';
import { StacheNavLink } from '../nav/nav-link';
import { StacheNavService } from '../nav/nav.service';
import { StachePageAnchorService } from '../page-anchor/page-anchor.service';
import { booleanConverter } from '../shared/input-converter';
import { StacheOmnibarAdapterService } from '../shared/omnibar-adapter.service';
import { StacheWindowRef } from '../shared/window-ref';

import { StacheTitleService } from './title.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'stache',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss'],
  standalone: false,
})
export class StacheWrapperComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input()
  public pageTitle: string;

  @Input()
  public windowTitle: string;

  @Input()
  public navTitle: string;

  @Input()
  public layout: StacheLayoutType = 'sidebar';

  @Input()
  public sidebarRoutes: StacheNavLink[];

  @Input()
  public breadcrumbsRoutes: StacheNavLink[];

  public showBreadcrumbs = input(true, { transform: booleanAttribute });

  @Input()
  public showEditButton: boolean = this.checkEditButtonUrl();

  @Input()
  public set showFooter(value: boolean | string | undefined) {
    this.#_showFooter = booleanConverter(value);
  }

  public get showFooter(): boolean {
    return this.#_showFooter;
  }

  @Input()
  public showTableOfContents = false;

  @Input()
  public showBackToTop = true;

  @Input()
  public showInNav = true;

  @Input()
  public inPageRoutes: StacheNavLink[] | undefined;

  public jsonData: any;
  private ngUnsubscribe = new Subject<void>();

  #_showFooter = this.checkFooterData();

  public constructor(
    private config: SkyAppConfig,
    private dataService: StacheJsonDataService,
    private pageAnchorService: StachePageAnchorService,
    private titleService: StacheTitleService,
    private route: ActivatedRoute,
    private navService: StacheNavService,
    private windowRef: StacheWindowRef,
    private changeDetectorRef: ChangeDetectorRef,
    private omnibarService: StacheOmnibarAdapterService,
  ) {}

  public ngOnInit(): void {
    this.omnibarService.checkForOmnibar();
    this.jsonData = this.dataService.getAll();
    if (!this.inPageRoutes) {
      this.pageAnchorService.pageAnchorsStream
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((anchors: StacheNavLink[]) => {
          this.inPageRoutes = anchors;
          this.checkRouteHash();
          this.changeDetectorRef.detectChanges();
        });
    }
  }

  public ngAfterViewInit() {
    const preferredDocumentTitle = this.getPreferredDocumentTitle();
    this.titleService.setTitle(preferredDocumentTitle);
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private getPreferredDocumentTitle(): string {
    return (
      this.windowTitle ||
      this.pageTitle ||
      this.navTitle ||
      this.getTutorialHeader()
    );
  }

  private getTutorialHeader(): string {
    const currentTutorialHeader =
      this.windowRef.nativeWindow.document.querySelector(
        `.stache-tutorial-heading`,
      );
    if (currentTutorialHeader && currentTutorialHeader.textContent) {
      return currentTutorialHeader.textContent.trim();
    }
  }

  private checkEditButtonUrl(): boolean {
    const url = lodashGet(
      this.config,
      'skyux.appSettings.stache.editButton.url',
    );
    return url !== undefined;
  }

  private checkFooterData(): boolean {
    const footerData = lodashGet(
      this.config,
      'skyux.appSettings.stache.footer',
    );
    return footerData !== undefined;
  }

  private checkRouteHash(): void {
    this.route.fragment.pipe(take(1)).subscribe((fragment) => {
      if (fragment) {
        this.pageAnchorService.scrollToAnchor(fragment);
      }
    });
  }
}
