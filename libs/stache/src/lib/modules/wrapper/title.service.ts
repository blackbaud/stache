import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SkyAppConfig } from '@skyux/config';

@Injectable()
export class StacheTitleService {
  #title: Title;
  #configSvc: SkyAppConfig;

  constructor(title: Title, configSvc: SkyAppConfig) {
    this.#title = title;
    this.#configSvc = configSvc;
  }

  public setTitle(...parts: string[]): void {
    const configuredTitle = this.#configSvc.skyux.app?.title;
    if (configuredTitle) {
      parts.push(configuredTitle);
    }

    const validParts = parts.filter((part) => !!part && part.trim());
    const title = validParts.join(' - ');

    this.#title.setTitle(title);
  }
}
