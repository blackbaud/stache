import { NavigationExtras, Router } from '@angular/router';

import { StacheWindowRef } from '../shared/window-ref';

import { StacheNavService } from './nav.service';

class MockRouter {
  public url = '/internal#element-id';
  public navigate = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    path: string | string[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    extras: NavigationExtras,
  ): boolean => true;
}

let elementScrollCalled = false;

class MockWindowService {
  public testElement = {
    offsetTop: 20,
    getBoundingClientRect(): { y: number; bottom: number } {
      return {
        y: 0,
        bottom: 0,
      };
    },
    scrollIntoView(): void {
      elementScrollCalled = true;
      return;
    },
  };

  public nativeWindow = {
    pageYOffset: 0,
    innerHeight: 0,
    document: {
      getElementById: jasmine.createSpy('getElementById').and.callFake((id) => {
        return id === 'element-id' ? this.testElement : false;
      }),
      querySelector: jasmine.createSpy('querySelector').and.callFake(() => {
        return this.testElement;
      }),
      documentElement: this.testElement,
    },
    location: {
      href: '',
    },
    scroll: jasmine.createSpy('scroll'),
  };
}

describe('StacheNavService', () => {
  let navService: StacheNavService;
  let windowRef: MockWindowService;
  let router: MockRouter;

  beforeEach(() => {
    router = new MockRouter();
    windowRef = new MockWindowService();
    navService = new StacheNavService(
      router as unknown as Router,
      windowRef as unknown as StacheWindowRef,
    );
    elementScrollCalled = false;
  });

  it('should return true if a given route is external www', () => {
    const www = navService.isExternal({ path: 'www.external.com' });
    expect(www).toBe(true);
  });

  it('should return true if a given route is external http', () => {
    const isHttp = navService.isExternal({ path: 'http://www.external.com' });
    expect(isHttp).toBe(true);
  });

  it('should return true if a given route is external mailto', () => {
    const mailto = navService.isExternal({ path: 'mailto:test@email.com' });
    expect(mailto).toBe(true);
  });

  it('should return true if a given route is external ftp', () => {
    const ftp = navService.isExternal({ path: 'ftp://address' });
    expect(ftp).toBe(true);
  });

  it('should return true if a given route is external and passed as a string', () => {
    const isHttp = navService.isExternal('http://www.external.com');
    expect(isHttp).toBe(true);
  });

  it('should return false if a given route is not external', () => {
    const isExternal = navService.isExternal('/internal-route');
    expect(isExternal).toBe(false);
  });

  it('should navigate to an external url', () => {
    navService.navigate({ path: 'www.external.com' });
    expect(windowRef.nativeWindow.location.href).toEqual('www.external.com');
  });

  it('should navigate to an internal url without a fragment', () => {
    spyOn(router, 'navigate').and.callThrough();
    navService.navigate({ path: '/internal' });
    expect(router.navigate).toHaveBeenCalledWith(['/internal'], {
      queryParamsHandling: 'merge',
    });
  });

  it('should navigate to an internal url when the path is an array of paths', () => {
    spyOn(router, 'navigate').and.callThrough();
    navService.navigate({ path: ['/internal', '/deeper-internal'] });
    expect(router.navigate).toHaveBeenCalledWith(
      ['/internal', '/deeper-internal'],
      { queryParamsHandling: 'merge' },
    );
  });

  it('should navigate to a new page with a fragment', () => {
    spyOn(router, 'navigate').and.callThrough();
    navService.navigate({ path: '/internal-foo', fragment: 'foo' });
    expect(router.navigate).toHaveBeenCalledWith(['/internal-foo'], {
      queryParamsHandling: 'merge',
      fragment: 'foo',
    });
  });

  it('should navigate to an internal url with a fragment', () => {
    navService.navigate({ path: 'internal', fragment: 'element-id' });
    expect(elementScrollCalled).toBe(true);
  });

  it('should navigate to an internal url if the path provided is .', () => {
    navService.navigate({ path: '.', fragment: 'element-id' });
    expect(elementScrollCalled).toBe(true);
  });

  it('should navigate to an internal url if the path provided is an array of paths', () => {
    navService.navigate({ path: ['/internal'], fragment: 'element-id' });
    expect(elementScrollCalled).toBe(true);
  });

  it('should not navigate to an internal url if the path provided is an array of paths that do not match currentUrl', () => {
    navService.navigate({
      path: ['/internal', 'not-in-page'],
      fragment: 'element-id',
    });
    expect(elementScrollCalled).toBe(false);
  });

  it('should navigate to an internal url', () => {
    navService.navigate({ path: 'internal', fragment: 'does-not-exist' });
    expect(windowRef.nativeWindow.scroll).toHaveBeenCalled();
  });
});
