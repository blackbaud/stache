import { Component, Input } from '@angular/core';

import { StacheNavLink } from '../nav/nav-link';
import { InputConverter, booleanConverter } from '../shared/input-converter';

import { StacheLayout } from './layout';

@Component({
  selector: 'stache-layout-container',
  templateUrl: './layout-container.component.html',
})
export class StacheLayoutContainerComponent implements StacheLayout {
  @Input()
  public pageTitle: string | undefined;

  @Input()
  public breadcrumbsRoutes: StacheNavLink[] | undefined;

  @Input()
  public inPageRoutes: StacheNavLink[] | undefined;

  @Input()
  @InputConverter(booleanConverter)
  public showBackToTop: boolean | string | undefined;

  @Input()
  @InputConverter(booleanConverter)
  public showBreadcrumbs: boolean | string | undefined;

  @Input()
  @InputConverter(booleanConverter)
  public showEditButton: boolean | string | undefined;

  @Input()
  @InputConverter(booleanConverter)
  public showTableOfContents: boolean | string | undefined;
}
