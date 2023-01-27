import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StacheModule } from '@blackbaud/skyux-lib-stache';

import { DesignPlaygroundComponent } from './design.component';
import { GuidelinesPlaygroundComponent } from './guidelines/guidelines.component';
import { PrinciplesPlaygroundComponent } from './principles/principles.component';
import { StylesPlaygroundComponent } from './styles/styles.component';

@NgModule({
  imports: [CommonModule, StacheModule],
  declarations: [
    DesignPlaygroundComponent,
    GuidelinesPlaygroundComponent,
    PrinciplesPlaygroundComponent,
    StylesPlaygroundComponent,
  ],
})
export class DesignPlaygroundModule {}
