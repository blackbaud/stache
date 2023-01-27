import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StachePlaygroundComponent } from './stache-playground.component';

const routes: Routes = [{ path: '', component: StachePlaygroundComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StachePlaygroundRoutingModule {}
