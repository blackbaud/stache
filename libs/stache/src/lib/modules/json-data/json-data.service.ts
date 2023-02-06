import { Inject, Injectable, Optional } from '@angular/core';

import { STACHE_JSON_DATA_SERVICE_CONFIG } from './json-data-service-config-token';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JSON_DATA = any;

@Injectable({ providedIn: 'root' })
export class StacheJsonDataService {
  #jsonData: JSON_DATA;

  constructor(
    @Optional()
    @Inject(STACHE_JSON_DATA_SERVICE_CONFIG)
    jsonData?: JSON_DATA
  ) {
    this.#jsonData = jsonData || {};
  }

  public getAll(): JSON_DATA {
    return this.#jsonData;
  }

  public getByName(name: string): JSON_DATA {
    if (name.includes('.')) {
      const keys = name.split('.');
      return this.getNestedData(keys);
    }

    if (!this.#jsonData[name]) {
      return;
    }

    return this.#jsonData[name];
  }

  public getNestedData(keys: string[]): JSON_DATA | undefined {
    let baseData = this.#jsonData;

    for (let i = 0; i < keys.length; i++) {
      if (baseData[keys[i]] === undefined) {
        baseData = undefined;
        return;
      }

      baseData = baseData[keys[i]];
    }

    return baseData;
  }
}
