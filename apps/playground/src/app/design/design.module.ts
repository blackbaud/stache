import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StacheModule } from '@blackbaud/skyux-lib-stache';

import { DesignPlaygroundComponent } from './design.component';
import { GuidelinesButtonsAndLinksPlaygroundComponent } from './guidelines/buttons-and-links/principles/buttons-and-links.component';
import { GuidelinesPlaygroundComponent } from './guidelines/guidelines.component';
import { PrinciplesPlaygroundComponent } from './principles/principles.component';
import { StylesPlaygroundComponent } from './styles/styles.component';

@NgModule({
  imports: [CommonModule, StacheModule],
  declarations: [
    DesignPlaygroundComponent,
    GuidelinesPlaygroundComponent,
    GuidelinesButtonsAndLinksPlaygroundComponent,
    PrinciplesPlaygroundComponent,
    StylesPlaygroundComponent,
  ],
})
export class DesignPlaygroundModule {}
