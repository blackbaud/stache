import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  SkyCodeBlockModule,
  SkyCodeModule,
} from '@blackbaud/skyux-lib-code-block';

import { CodeBlockPlaygroundComponent } from './code-block-playground.component';

const routes: Routes = [
  { path: 'code-block', component: CodeBlockPlaygroundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
class CodeBlockPlaygroundRoutingModule {}

@NgModule({
  declarations: [CodeBlockPlaygroundComponent],
  imports: [
    CodeBlockPlaygroundRoutingModule,
    CommonModule,
    SkyCodeModule,
    SkyCodeBlockModule,
  ],
})
export class CodeBlockPlaygroundModule {}
