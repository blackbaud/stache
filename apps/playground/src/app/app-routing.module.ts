import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DesignPlaygroundComponent } from './design/design.component';
import { GuidelinesButtonsAndLinksPlaygroundComponent } from './design/guidelines/buttons-and-links/principles/buttons-and-links.component';
import { GuidelinesPlaygroundComponent } from './design/guidelines/guidelines.component';
import { PrinciplesPlaygroundComponent } from './design/principles/principles.component';
import { StylesPlaygroundComponent } from './design/styles/styles.component';
import { HomeComponent } from './home.component';
import { NotFoundComponent } from './not-found.component';

const routes: Routes = [
  {
    path: '',
    children: [
      // Used to test eagerly-loaded routes.
      { path: '', component: HomeComponent },
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
        path: 'design/guidelines/buttons-and-links',
        component: GuidelinesButtonsAndLinksPlaygroundComponent,
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
    ],
  },
  {
    // Used to test lazy-loaded routes.
    path: 'components',
    loadChildren: () =>
      import('./components/components.module').then(
        (m) => m.ComponentsPlaygroundModule,
      ),
  },
  {
    path: 'navigation',
    loadChildren: () =>
      import('./navigation/navigation.module').then((m) => m.NavigationModule),
  },
  {
    path: '**',
    component: NotFoundComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
