import { Component, OnInit } from '@angular/core';
import { SkyAppConfig } from '@skyux/config';

import lodashGet from 'lodash.get';

import { StacheRouteService } from '../router/route.service';

const GITHUB_FILE_PATH_ROOT = '/tree/master/src/app';
const ADO_BRANCH_SELECTOR = '&version=GBmaster';
const ADO_FILE_PATH_ROOT = '?path=%2Fsrc%2Fapp';

@Component({
  selector: 'stache-edit-button',
  templateUrl: './edit-button.component.html',
  styleUrls: ['./edit-button.component.scss'],
})
export class StacheEditButtonComponent implements OnInit {
  public editButtonText: string | undefined;
  public url: string | undefined;

  #config: SkyAppConfig;
  #routeSvc: StacheRouteService;

  constructor(config: SkyAppConfig, routeSvc: StacheRouteService) {
    this.#config = config;
    this.#routeSvc = routeSvc;
  }

  public ngOnInit(): void {
    this.url = this.#getUrl();
    this.editButtonText = lodashGet(
      this.#config,
      'skyux.appSettings.stache.editButton.text',
      'Edit'
    );
  }

  #getUrl(): string {
    const base = lodashGet(
      this.#config,
      'skyux.appSettings.stache.editButton.url'
    );
    if (!base) {
      return '';
    }
    const type =
      base.includes('visualstudio') || base.includes('azure')
        ? 'vsts'
        : 'github';
    const activeUrl = this.#routeSvc.getActiveUrl();
    const frag = encodeURIComponent(
      activeUrl === '/' ? activeUrl : activeUrl + '/'
    );

    if (type === 'vsts') {
      return (
        base + ADO_FILE_PATH_ROOT + frag + 'index.html' + ADO_BRANCH_SELECTOR
      );
    } else {
      return base + GITHUB_FILE_PATH_ROOT + frag + 'index.html';
    }
  }
}
