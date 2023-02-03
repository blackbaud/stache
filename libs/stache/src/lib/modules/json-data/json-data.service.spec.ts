import { TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { STACHE_JSON_DATA_SERVICE_CONFIG } from './json-data-service-config-token';
import { StacheJsonDataService } from './json-data.service';

describe('StacheJsonDataService', () => {
  let defaultJsonData: Record<string, unknown>;

  function setupTest(options?: { jsonData: Record<string, unknown> }): {
    dataService: StacheJsonDataService;
  } {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        {
          provide: STACHE_JSON_DATA_SERVICE_CONFIG,
          useValue: options?.jsonData,
        },
        { provide: StacheJsonDataService, useClass: StacheJsonDataService },
      ],
    });

    return { dataService: new StacheJsonDataService(options?.jsonData) };
  }

  beforeEach(() => {
    defaultJsonData = {
      global: {
        productNameLong: 'Stache 2',
      },
      parent: {
        child: {
          grandChild: {
            name: 'grand child',
          },
          childList: [
            {
              name: 'list child 1',
            },
            {
              name: 'list child 2',
            },
          ],
        },
      },
    };
  });

  it('should return all data', () => {
    const { dataService } = setupTest({ jsonData: defaultJsonData });
    const data = dataService.getAll();
    expect(data.global.productNameLong).toBe('Stache 2');
  });

  it('should return data from a specific name', () => {
    const { dataService } = setupTest({ jsonData: defaultJsonData });
    const data = dataService.getByName('global');
    expect(data.productNameLong).toBe('Stache 2');
  });

  it('should return nested data from a string', () => {
    const { dataService } = setupTest({ jsonData: defaultJsonData });
    const data = dataService.getByName('parent.child.grandChild.name');
    expect(data).toBe('grand child');
  });

  it('should return nested data from an array', () => {
    const { dataService } = setupTest({ jsonData: defaultJsonData });
    const data = dataService.getNestedData([
      'parent',
      'child',
      'grandChild',
      'name',
    ]);
    expect(data).toBe('grand child');
  });

  it('should return nested data in an array from a string', () => {
    const { dataService } = setupTest({ jsonData: defaultJsonData });
    const data = dataService.getByName('parent.child.childList.1.name');
    expect(data).toBe('list child 2');
  });

  it('should return undefined if nested data does not exist', () => {
    const { dataService } = setupTest({ jsonData: defaultJsonData });
    const data = dataService.getByName('parent.child.foo.1.name');
    expect(data).not.toBeDefined();
  });

  it('should return undefined if the name does not exist', () => {
    const { dataService } = setupTest({ jsonData: defaultJsonData });
    const data = dataService.getByName('invalid');
    expect(data).not.toBeDefined();
  });

  it('should handle undefined JSON data', () => {
    const { dataService } = setupTest({ jsonData: undefined });
    const data = dataService.getByName('foobar');
    expect(data).not.toBeDefined();
  });
});
