import { StacheNavLink } from '../nav/nav-link';

export interface StacheLayout {
  pageTitle?: string;
  breadcrumbsRoutes?: StacheNavLink[];
  inPageRoutes?: StacheNavLink[];
  showBackToTop?: boolean | string;
  showBreadcrumbs?: boolean | string;
  showEditButton?: boolean | string;
  showTableOfContents?: boolean | string;
  sidebarRoutes?: StacheNavLink[];
}
