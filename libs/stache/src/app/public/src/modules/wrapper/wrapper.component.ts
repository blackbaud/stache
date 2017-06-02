/* tslint:disable:component-selector-name */
import { Component, OnInit, Input, AfterContentInit, ContentChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { StacheTitleService } from './title.service';
import { StachePageAnchorComponent } from '../page-anchor/page-anchor.component';
import { StacheNavLink } from '../nav/nav-link';
import { StacheWindowRef } from '../shared';

@Component({
  selector: 'stache',
  templateUrl: './wrapper.component.html'
})
export class StacheWrapperComponent implements OnInit, AfterContentInit {
  @Input()
  public pageTitle: string;

  @Input()
  public windowTitle: string;

  @Input()
  public navTitle: string;

  @Input()
  public layout = 'sidebar';

  @Input()
  public sidebarRoutes: StacheNavLink[];

  @Input()
  public breadcrumbsRoutes: StacheNavLink[];

  @Input()
  public showBreadcrumbs: boolean = true;

  @Input()
  public showTableOfContents: boolean = false;

  @Input()
  public showBackToTop: boolean = true;

  public inPageRoutes: StacheNavLink[] = [];

  @ContentChildren(StachePageAnchorComponent)
  private pageAnchors: any;

  public constructor(
    private titleService: StacheTitleService,
    private route: ActivatedRoute,
    private windowRef: StacheWindowRef) { }

  public ngOnInit(): void {
    this.titleService.setTitle(this.windowTitle || this.pageTitle);

    this.route.fragment.subscribe(fragment => {
      return Promise.resolve().then(() => {
        const element = this.windowRef.nativeWindow.document.getElementById(fragment);
        if (element) {
          element.scrollIntoView();
        }
      });
    });
  }

  public ngAfterContentInit(): void {
    this.pageAnchors.forEach((anchor: StacheNavLink) => {
      this.inPageRoutes.push(anchor);
    });
  }
}
