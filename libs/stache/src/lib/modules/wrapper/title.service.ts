import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SkyAppConfig } from '@skyux/config';

@Injectable()
export class StacheTitleService {
  constructor(
    private title: Title,
    private configService: SkyAppConfig,
  ) {}

  public setTitle(...parts: string[]): void {
    let windowTitle = this.configService.skyux.app.title;

    if (parts && parts.length > 0) {
      parts.push(windowTitle);
      const validParts = parts.filter((part: string) => !!part && part.trim());
      windowTitle = validParts.join(' - ');
    }

    this.title.setTitle(windowTitle);
  }
}
