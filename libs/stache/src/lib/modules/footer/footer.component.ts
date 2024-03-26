import { Component, OnInit } from '@angular/core';
import { SkyAppConfig } from '@skyux/config';
import { SkyLibResourcesService } from '@skyux/i18n';

import lodashGet from 'lodash.get';
import { first } from 'rxjs/operators';

import { StacheNavLink } from '../nav/nav-link';

@Component({
  selector: 'stache-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class StacheFooterComponent implements OnInit {
  public copyrightDate: Date | undefined;
  public copyrightLabel: string | undefined;
  public siteName: string | undefined;
  public footerLinks: StacheNavLink[] | undefined;

  #configSvc: SkyAppConfig;
  #resourcesSvc: SkyLibResourcesService;

  constructor(configSvc: SkyAppConfig, resourcesSvc: SkyLibResourcesService) {
    this.#configSvc = configSvc;
    this.#resourcesSvc = resourcesSvc;
  }

  public ngOnInit(): void {
    this.copyrightDate = new Date();
    this.#setFooterData();
  }

  #setFooterData(): void {
    const navItems = lodashGet(
      this.#configSvc,
      'skyux.appSettings.stache.footer.nav.items',
      [],
    ) as { title: string; route: string }[];

    this.footerLinks = navItems.map((link) => {
      return {
        name: link.title,
        path: link.route,
      } as StacheNavLink;
    });

    this.#resourcesSvc
      .getString('stache_copyright_label')
      .pipe(first())
      .subscribe((value) => {
        this.copyrightLabel = lodashGet(
          this.#configSvc,
          'skyux.appSettings.stache.footer.copyrightLabel',
          value,
        );
      });

    this.siteName = lodashGet(this.#configSvc, 'skyux.app.title');
  }
}
