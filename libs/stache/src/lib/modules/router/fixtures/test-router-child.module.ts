import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

@Component({ selector: 'stache-test-router-child', template: '' })
export class TestRouterChildComponent {}

const routes: Routes = [
  {
    path: '',
    component: TestRouterChildComponent,
    data: {
      stache: {
        name: 'Child router',
        order: 4,
      },
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestRouterChildRoutingModule {}

@NgModule({
  declarations: [TestRouterChildComponent],
  imports: [CommonModule, TestRouterChildRoutingModule],
})
export class TestRouterChildModule {}
