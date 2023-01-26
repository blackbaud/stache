import { StacheNavLink } from '@blackbaud/skyux-lib-stache';

export const sideNavRoutes: StacheNavLink[] = [
  {
    name: 'Navigation',
    path: '/navigation',
    children: [
      {
        name: 'Supporting Pages',
        path: '/navigation/supporting-pages',
        children: [
          {
            name: 'Recursion',
            path: '/navigation/supporting-pages/recursion',
          },
        ],
      },
      {
        name: 'Table of Contents',
        path: '/navigation/toc',
      },
    ],
  },
];
