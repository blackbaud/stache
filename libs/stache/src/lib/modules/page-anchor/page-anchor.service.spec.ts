import { TestBed } from '@angular/core/testing';

import { BehaviorSubject, Subject, lastValueFrom } from 'rxjs';

import { StacheNavLink } from '../nav/nav-link';
import { StacheWindowRef } from '../shared/window-ref';

import { StachePageAnchorService } from './page-anchor.service';

class MockWindowRef {
  private mockPageAnchors: StacheNavLink[] = [
    {
      name: 'test',
      path: '/',
    },
  ];

  public nativeWindow = {
    document: {
      querySelector: jasmine.createSpy('querySelector').and.callFake(() => {
        return {
          scrollIntoView(): void {
            /* */
          },
        };
      }),
      querySelectorAll: jasmine
        .createSpy('querySelectorAll')
        .and.callFake(() => {
          return this.mockPageAnchors;
        }),
      body: {
        scrollHeight: 5,
      },
    },
    addEventListener: (_: string, func: () => void): void => {
      func();
    },
  };

  public scrollEventStream = new BehaviorSubject(0);

  public testElement = {
    getBoundingClientRect(): { y: number } {
      return { y: 0 };
    },
  };
}

describe('PageAnchorService', () => {
  let service: StachePageAnchorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StachePageAnchorService,
        {
          provide: StacheWindowRef,
          useClass: MockWindowRef,
        },
      ],
    });

    service = TestBed.inject(StachePageAnchorService);
  });

  it('should request page anchors update when body height changes', () => {
    spyOn(service, 'refreshAnchors').and.callThrough();
    const windowRef = TestBed.inject(StacheWindowRef);
    windowRef.nativeWindow.document.body.scrollHeight = 1;
    const event: any = windowRef.scrollEventStream;
    event.next(1);
    event.next(1);

    expect(service.refreshAnchors).toHaveBeenCalled();
  });

  it('should not add an anchor when unsubscribe', async () => {
    const anchorStream = new BehaviorSubject<StacheNavLink>({
      name: 'Test Anchor',
      path: '/',
    });

    service.addAnchor(anchorStream);
    service.ngOnDestroy();

    const anchors = await lastValueFrom(service.pageAnchorsStream);

    expect(anchors).toEqual([]);
  });

  fit('should add an anchor', async () => {
    const anchorStream = new BehaviorSubject<StacheNavLink>({
      name: 'Test Anchor',
      path: '/',
    });

    service.addAnchor(anchorStream);

    const anchors = await lastValueFrom(service.pageAnchorsStream);

    expect(anchors).toEqual([]);
  });

  it('should remove anchor', async () => {
    const anchor0 = new BehaviorSubject<StacheNavLink>({
      name: 'b',
      path: '/',
    });
    const anchor1 = new BehaviorSubject<StacheNavLink>({
      name: 'a',
      path: '/',
    });

    service.addAnchor(anchor0);
    service.addAnchor(anchor1);
    anchor0.complete();
    anchor1.complete();

    const anchors = await lastValueFrom(service.pageAnchorsStream);

    expect(anchors).toEqual([]);
  });

  it('should update anchor stream', async () => {
    const anchor0 = new BehaviorSubject<StacheNavLink>({
      name: 'b',
      path: '/',
    });
    const anchor1 = new BehaviorSubject<StacheNavLink>({
      name: 'a',
      path: '/',
    });

    service.addAnchor(anchor0);
    service.addAnchor(anchor1);

    const result = new Subject<StacheNavLink[]>();
    result.next([anchor1.getValue(), anchor0.getValue()]);

    const lastValue = await lastValueFrom(service.pageAnchorsStream);

    expect(lastValue).toEqual([]);
  });

  it('should scroll to an anchor', () => {
    const windowService = TestBed.inject(StacheWindowRef);
    service.scrollToAnchor('foobar');
    expect(
      windowService.nativeWindow.document.querySelector
    ).toHaveBeenCalledWith('#foobar');
  });
});
