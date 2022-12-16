import { Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { of as observableOf } from 'rxjs';

import { StacheNavModule } from '../nav/nav.module';
import { StacheRouteService } from '../router/route.service';
import { StacheOmnibarAdapterService } from '../shared/omnibar-adapter.service';
import { StacheWindowRef } from '../shared/window-ref';

import { StacheTableOfContentsWrapperComponent } from './table-of-contents-wrapper.component';
import { StacheTableOfContentsModule } from './table-of-contents.module';

class MockWindowService {
  public nativeWindow = {
    document: {
      querySelector: (): void => {
        /* */
      },
      body: {
        classList: {
          add: (): void => {
            /* */
          },
          remove: (): void => {
            /* */
          },
        },
      },
    },
    innerWidth: 100,
  };
  public scrollEventStream = observableOf(true);
}

class MockStacheRouteService {
  public getActiveUrl = (): string => '';
}

class MockRenderer {
  public classList: string[] = [];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public addClass = (el: Element, className: string): void => {
    /* */
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public removeClass = (el: Element, className: string): void => {
    /* */
  };
}

const route = {
  name: 'string',
  path: '/string',
  offsetTop: 123,
  isCurrent: false,
};

class MockOmnibarService {
  public getHeight = (): number => 50;
}

describe('Table of Contents Wrapper Component', () => {
  let component: StacheTableOfContentsWrapperComponent;
  let fixture: ComponentFixture<StacheTableOfContentsWrapperComponent>;
  let mockWindowService: MockWindowService;
  let mockStacheRouteService: MockStacheRouteService;
  let mockRenderer: MockRenderer;
  let mockOmnibarAdapterService: MockOmnibarService;

  beforeEach(() => {
    mockWindowService = new MockWindowService();
    mockStacheRouteService = new MockStacheRouteService();
    mockRenderer = new MockRenderer();
    mockOmnibarAdapterService = new MockOmnibarService();

    TestBed.configureTestingModule({
      imports: [
        StacheNavModule,
        StacheTableOfContentsModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: StacheRouteService, useValue: mockStacheRouteService },
        { provide: StacheWindowRef, useValue: mockWindowService },
        { provide: Renderer2, useValue: mockRenderer },
        {
          provide: StacheOmnibarAdapterService,
          useValue: mockOmnibarAdapterService,
        },
      ],
    });

    fixture = TestBed.createComponent(StacheTableOfContentsWrapperComponent);
    component = fixture.componentInstance;

    component.tocRoutes = [route];
  });

  it('should exist', () => {
    expect(fixture).toExist();
  });

  it('should pass accessibility', async () => {
    fixture.detectChanges();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});
