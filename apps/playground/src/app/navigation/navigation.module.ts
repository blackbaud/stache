import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  SkyCodeBlockModule,
  SkyCodeModule,
} from '@blackbaud/skyux-lib-code-block';
import { StacheModule } from '@blackbaud/skyux-lib-stache';

import { NavigationComponent } from './navigation.component';
import { RecursionComponent } from './supporting-pages/recursion/recursion.component';
import { SupportingPagesComponent } from './supporting-pages/supporting-pages.component';
import { TableOfContentsComponent } from './table-of-contents/table-of-contents.component';

const routes: Routes = [
  {
    path: '',
    component: NavigationComponent,
    data: {
      stache: {
        name: 'Navigation',
        order: 2,
      },
    },
  },
  {
    path: 'toc',
    component: TableOfContentsComponent,
    data: {
      stache: {
        name: 'Table of Contents',
        order: 1,
      },
    },
  },
  {
    path: 'supporting-pages',
    component: SupportingPagesComponent,
    data: {
      stache: {
        name: 'Supporting Pages',
        order: 3,
      },
    },
  },
  {
    path: 'supporting-pages/recursion',
    component: RecursionComponent,
    data: {
      stache: {
        name: 'Recursion',
      },
    },
  },
];

@NgModule({
  declarations: [
    NavigationComponent,
    SupportingPagesComponent,
    RecursionComponent,
    TableOfContentsComponent,
  ],
  imports: [
    CommonModule,
    StacheModule,
    SkyCodeBlockModule,
    SkyCodeModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class NavigationModule {}
