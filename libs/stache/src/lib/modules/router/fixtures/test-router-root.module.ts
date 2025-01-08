import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

@Component({
  template: '',
  standalone: false,
})
export class TestRouterRootComponent {}

const routes: Routes = [
  {
    path: '',
    component: TestRouterRootComponent,
    data: {
      stache: {
        name: 'Home',
        order: 1,
      },
    },
  },
  {
    path: 'test',
    component: TestRouterRootComponent,
    children: [
      {
        path: 'root-child-1',
        component: TestRouterRootComponent,
        data: {
          stache: {
            name: 'Root Child 1',
            order: '-11',
          },
        },
      },
      {
        path: 'root-child-2',
        component: TestRouterRootComponent,
        data: {
          stache: {
            name: 'Root Child 2',
            order: 'word',
          },
        },
      },
    ],
  },
  {
    path: 'child',
    loadChildren: () => {
      console.log('loadChildren');
      return import('./test-router-child.module').then((m) => {
        console.log('return m.TestRouterChildModule');
        return m.TestRouterChildModule;
      });
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class TestRouterRootRoutingModule {}

@NgModule({
  declarations: [TestRouterRootComponent],
  imports: [CommonModule, TestRouterRootRoutingModule],
})
export class TestRouterRootModule {}
