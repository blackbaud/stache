import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@skyux-sdk/testing';

import { StacheRouteMetadataService } from './route-metadata.service';

@Component({ template: '' })
class TestComponent {}

describe('StacheRouteMetadataService', () => {
  let routeMetadataService: StacheRouteMetadataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: '',
            component: TestComponent,
            data: {
              stache: {
                name: 'foo',
                order: '1',
              },
            },
          },
          {
            path: '',
            component: TestComponent,
            data: {
              stache: {
                name: 'bar',
              },
            },
          },
          {
            path: 'one',
            component: TestComponent,
            data: {
              stache: {
                name: 'one',
                order: '-100',
              },
            },
          },
          {
            path: 'two',
            component: TestComponent,
            data: {
              stache: {
                name: 'two',
                order: 0,
              },
            },
          },
        ]),
      ],
      providers: [StacheRouteMetadataService],
    });

    routeMetadataService = TestBed.inject(StacheRouteMetadataService);
  });

  it('should have a routes property', () => {
    expect(routeMetadataService.metadata).toBeDefined();
  });

  it('should convert values to appropriate type', () => {
    expect(typeof routeMetadataService.metadata[0].order).toBe('number');
    expect(typeof routeMetadataService.metadata[0].name).toBe('string');
  });

  it('should remove the order attribute for non valid inputs', () => {
    expect(routeMetadataService.metadata[2].order).toBe(undefined);
    expect(routeMetadataService.metadata[0].order).toBe(1);
    expect(routeMetadataService.metadata[3].order).toBe(undefined);
  });
});
