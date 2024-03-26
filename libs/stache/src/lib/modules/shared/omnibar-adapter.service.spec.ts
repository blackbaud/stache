import { RendererFactory2 } from '@angular/core';

import { StacheOmnibarAdapterService } from './omnibar-adapter.service';
import { StacheWindowRef } from './window-ref';

let mockEnabled = false;

let mockElement: HTMLElement;

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
      querySelector() {
        if (mockEnabled) {
          mockElement = document.createElement('div');
          return mockElement;
        }
        return undefined;
      },
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

describe('StacheOmnibarAdapterService', () => {
  const className = 'stache-omnibar-enabled';
  let omnibarService: StacheOmnibarAdapterService;
  let mockWindowService: MockWindowService;
  let mockRendererFactory: MockRendererFactory;

  beforeEach(() => {
    mockEnabled = false;
    mockWindowService = new MockWindowService();
    mockRendererFactory = new MockRendererFactory();
  });

  it('should return 0 for the height of the omnibar if it does not exist', () => {
    omnibarService = new StacheOmnibarAdapterService(
      mockWindowService as StacheWindowRef,
      mockRendererFactory as RendererFactory2,
    );
    const testHeight = omnibarService.getHeight();
    expect(testHeight).toBe(0);
  });

  it('should return the expected height of the omnibar if it does exist', () => {
    mockEnabled = true;
    omnibarService = new StacheOmnibarAdapterService(
      mockWindowService as StacheWindowRef,
      mockRendererFactory as RendererFactory2,
    );
    const testHeight = omnibarService.getHeight();
    expect(testHeight).toBe(50);
  });

  it('should add the class stache-omnibar-enabled to the body if omnibar exists', () => {
    mockEnabled = true;
    omnibarService = new StacheOmnibarAdapterService(
      mockWindowService as StacheWindowRef,
      mockRendererFactory as RendererFactory2,
    );
    omnibarService.checkForOmnibar();
    expect(mockWindowService.nativeWindow.document.body.classList).toContain(
      className,
    );
  });

  it('should not add the class stache-omnibar-enabled to the body if omnibar exists', () => {
    mockEnabled = false;
    omnibarService = new StacheOmnibarAdapterService(
      mockWindowService as StacheWindowRef,
      mockRendererFactory as RendererFactory2,
    );
    omnibarService.checkForOmnibar();
    expect(
      mockWindowService.nativeWindow.document.body.classList,
    ).not.toContain(className);
  });

  it('should return false if the omnibar does not exist', () => {
    omnibarService = new StacheOmnibarAdapterService(
      mockWindowService as StacheWindowRef,
      mockRendererFactory as RendererFactory2,
    );
    expect(omnibarService.omnibarEnabled()).toBe(false);
  });

  it('should return true if the omnibar exists', () => {
    mockEnabled = true;
    omnibarService = new StacheOmnibarAdapterService(
      mockWindowService as StacheWindowRef,
      mockRendererFactory as RendererFactory2,
    );
    expect(omnibarService.omnibarEnabled()).toBe(true);
  });
});
