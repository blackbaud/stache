import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'code-block',
    loadChildren: () =>
      import('./code-block/code-block-playground.module').then(
        (m) => m.CodeBlockPlaygroundModule
      ),
  },
  {
    path: 'media',
    loadChildren: () =>
      import('./media/media-playground.module').then(
        (m) => m.MediaPlaygroundModule
      ),
  },
  {
    path: 'stache',
    loadChildren: () =>
      import('./stache/stache-playground.module').then(
        (m) => m.StachePlaygroundModule
      ),
  },
  {
    path: 'navigation',
    loadChildren: () =>
      import('./navigation/navigation.module').then((m) => m.NavigationModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
