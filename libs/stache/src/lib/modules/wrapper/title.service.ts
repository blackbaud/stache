import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SkyAppConfig } from '@skyux/config';

@Injectable()
export class StacheTitleService {
  readonly #title = inject(Title);
  readonly #appConfig = inject(SkyAppConfig);

  public setTitle(...parts: string[]): void {
    const appTitle = this.#appConfig.skyux.app?.title;

    if (parts && parts.length > 0) {
      if (appTitle) {
        parts.push(appTitle);
      }

      const validParts = parts.filter((part) => !!part && part.trim());

      if (validParts.length > 0) {
        this.#title.setTitle(validParts.join(' - '));

        return;
      }
    }

    this.#title.setTitle(appTitle ?? 'Blackbaud');
  }
}
