/* istanbul ignore file */

/**
 * NOTICE: DO NOT MODIFY THIS FILE!
 * The contents of this file were automatically generated by
 * the 'ng generate @skyux/i18n:lib-resources-module lib/modules/shared/sky-code-block' schematic.
 * To update this file, simply rerun the command.
 */
import { NgModule } from '@angular/core';
import {
  SKY_LIB_RESOURCES_PROVIDERS,
  SkyAppLocaleInfo,
  SkyI18nModule,
  SkyLibResources,
  SkyLibResourcesProvider,
  SkyLibResourcesService,
  getLibStringForLocale,
} from '@skyux/i18n';

const RESOURCES: Record<string, SkyLibResources> = {
  'EN-US': {"sky_copy_to_clipboard_button_title":{"message":"Copy to clipboard"},"sky_copy_to_clipboard_button":{"message":"Copy"},"sky_copy_to_clipboard_button_success":{"message":"Copied!"}},
};

SkyLibResourcesService.addResources(RESOURCES);

export class SkyCodeBlockResourcesProvider implements SkyLibResourcesProvider {
  public getString(
    localeInfo: SkyAppLocaleInfo,
    name: string,
  ): string | undefined {
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
      useClass: SkyCodeBlockResourcesProvider,
      multi: true
    }
  ]
})
export class SkyCodeBlockResourcesModule {}
