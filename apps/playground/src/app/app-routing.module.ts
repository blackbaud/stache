import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DesignPlaygroundComponent } from './design/design.component';
import { GuidelinesPlaygroundComponent } from './design/guidelines/guidelines.component';
import { PrinciplesPlaygroundComponent } from './design/principles/principles.component';
import { StylesPlaygroundComponent } from './design/styles/styles.component';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    // Used to test lazy-loaded routes.
    path: 'components',
    loadChildren: () =>
      import('./components/components.module').then(
        (m) => m.ComponentsPlaygroundModule
      ),
  },
  // Used to test eagerly-loaded routes.
  {
    path: 'design',
    component: DesignPlaygroundComponent,
    data: {
      stache: {
        name: 'Design',
      },
    },
  },
  {
    path: 'design/guidelines',
    component: GuidelinesPlaygroundComponent,
    data: {
      stache: {
        name: 'Guidelines',
      },
    },
  },
  {
    path: 'design/principles',
    component: PrinciplesPlaygroundComponent,
    data: {
      stache: {
        name: 'Principles',
      },
    },
  },
  {
    path: 'design/styles',
    component: StylesPlaygroundComponent,
    data: {
      stache: {
        name: 'Styles',
      },
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
