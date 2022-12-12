import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
