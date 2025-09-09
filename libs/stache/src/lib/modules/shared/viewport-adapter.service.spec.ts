import { RendererFactory2 } from '@angular/core';

import { StacheViewportAdapterService } from './viewport-adapter.service';
import { StacheWindowRef } from './window-ref';

let mockEnabled = false;

class MockRenderer {
  public data: unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public addClass(el: any, className: string): void {
    el.classList.push(className);
  }
}

class MockWindowService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public nativeWindow: any = {
    document: {
      documentElement: {},
      body: {
        classList: [],
      },
    },
  };
}

class MockRendererFactory {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  public createRenderer(a: any, b: any): MockRenderer {
    return new MockRenderer();
  }
}

describe('StacheViewportAdapterService', () => {
  const className = 'stache-viewport-adjusted';
  let omnibarService: StacheViewportAdapterService;
  let mockWindowService: MockWindowService;
  let mockRendererFactory: MockRendererFactory;

  beforeEach(() => {
    mockEnabled = false;
    mockWindowService = new MockWindowService();
    mockRendererFactory = new MockRendererFactory();
    spyOn(window, 'getComputedStyle').and.callFake(() => {
      return {
        getPropertyValue(): string {
          return mockEnabled ? '50px' : undefined;
        },
      } as unknown as CSSStyleDeclaration;
    });
  });

  it('should return 0 for the adjustment height if it does not exist', () => {
    omnibarService = new StacheViewportAdapterService(
      mockWindowService as StacheWindowRef,
      mockRendererFactory as RendererFactory2,
    );
    const testHeight = omnibarService.getHeight();
    expect(testHeight).toBe(0);
  });

  it('should return the expected height of the viewport adjustment if it does exist', () => {
    mockEnabled = true;
    omnibarService = new StacheViewportAdapterService(
      mockWindowService as StacheWindowRef,
      mockRendererFactory as RendererFactory2,
    );
    const testHeight = omnibarService.getHeight();
    expect(testHeight).toBe(50);
  });

  it('should add the class stache-viewport-adjusted to the body if a viewport adjustment exists', () => {
    mockEnabled = true;
    omnibarService = new StacheViewportAdapterService(
      mockWindowService as StacheWindowRef,
      mockRendererFactory as RendererFactory2,
    );
    omnibarService.checkForViewportAdjustment();
    expect(mockWindowService.nativeWindow.document.body.classList).toContain(
      className,
    );
  });

  it('should not add the class stache-viewport-adjusted to the body if no viewport adjustment exists', () => {
    mockEnabled = false;
    omnibarService = new StacheViewportAdapterService(
      mockWindowService as StacheWindowRef,
      mockRendererFactory as RendererFactory2,
    );
    omnibarService.checkForViewportAdjustment();
    expect(
      mockWindowService.nativeWindow.document.body.classList,
    ).not.toContain(className);
  });

  it('should return false if a viewport adjustment does not exist', () => {
    omnibarService = new StacheViewportAdapterService(
      mockWindowService as StacheWindowRef,
      mockRendererFactory as RendererFactory2,
    );
    expect(omnibarService.viewportAdjusted()).toBe(false);
  });

  it('should return true if a viewport adjustment exists', () => {
    mockEnabled = true;
    omnibarService = new StacheViewportAdapterService(
      mockWindowService as StacheWindowRef,
      mockRendererFactory as RendererFactory2,
    );
    expect(omnibarService.viewportAdjusted()).toBe(true);
  });
});
