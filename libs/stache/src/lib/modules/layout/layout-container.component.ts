import { Component, Input } from '@angular/core';

import { StacheNavLink } from '../nav/nav-link';
import { booleanConverter } from '../shared/input-converter';

import { StacheLayout } from './layout';

@Component({
  selector: 'stache-layout-container',
  templateUrl: './layout-container.component.html',
  standalone: false,
})
export class StacheLayoutContainerComponent implements StacheLayout {
  @Input()
  public pageTitle: string | undefined;

  @Input()
  public breadcrumbsRoutes: StacheNavLink[] | undefined;

  @Input()
  public inPageRoutes: StacheNavLink[] | undefined;

  @Input()
  public set showBackToTop(value: boolean | string | undefined) {
    this.#_showBackToTop = booleanConverter(value);
  }

  public get showBackToTop(): boolean {
    return this.#_showBackToTop;
  }

  @Input()
  public set showBreadcrumbs(value: boolean | string | undefined) {
    this.#_showBreadcrumbs = booleanConverter(value);
  }

  public get showBreadcrumbs(): boolean {
    return this.#_showBreadcrumbs;
  }

  @Input()
  public set showEditButton(value: boolean | string | undefined) {
    this.#_showEditButton = booleanConverter(value);
  }

  public get showEditButton(): boolean {
    return this.#_showEditButton;
  }

  @Input()
  public set showTableOfContents(value: boolean | string | undefined) {
    this.#_showTableOfContents = booleanConverter(value);
  }

  public get showTableOfContents(): boolean {
    return this.#_showTableOfContents;
  }

  #_showBackToTop = false;
  #_showBreadcrumbs = false;
  #_showEditButton = false;
  #_showTableOfContents = false;
}
