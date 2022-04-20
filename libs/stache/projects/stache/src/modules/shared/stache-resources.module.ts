/**
 * NOTICE: DO NOT MODIFY THIS FILE!
 * The contents of this file were automatically generated by
 * the 'ng generate @skyux/i18n:lib-resources-module modules/shared/stache' schematic.
 * To update this file, simply rerun the command.
 */

import { NgModule } from '@angular/core';
import {
  getLibStringForLocale,
  SkyAppLocaleInfo,
  SkyI18nModule,
  SkyLibResources,
  SkyLibResourcesProvider,
  SKY_LIB_RESOURCES_PROVIDERS,
} from '@skyux/i18n';

const RESOURCES: { [locale: string]: SkyLibResources } = {
  'EN-US': {
    stache_copyright_label: { message: 'Blackbaud, Inc. All rights reserved.' },
    stache_sidebar_label: { message: 'Sidebar Navigation' },
    stache_sidebar_toggle_button: { message: 'Toggle sidebar' },
    stache_back_to_top_button: {
      message: 'Scroll back to the top of the page',
    },
  },
};

export class StacheResourcesProvider implements SkyLibResourcesProvider {
  public getString(localeInfo: SkyAppLocaleInfo, name: string): string {
    return getLibStringForLocale(RESOURCES, localeInfo.locale, name);
  }
}

/**
 * Import into any component library module that needs to use resource strings.
 */
@NgModule({
  exports: [SkyI18nModule],
  providers: [
    {
      provide: SKY_LIB_RESOURCES_PROVIDERS,
      useClass: StacheResourcesProvider,
      multi: true,
    },
  ],
})
export class StacheResourcesModule {}
