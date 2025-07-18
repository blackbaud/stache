import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@skyux-sdk/testing';

import { Subject } from 'rxjs';

import { StacheRouteService } from '../router/route.service';
import { StacheWindowRef } from '../shared/window-ref';

import { StachePageAnchorTestComponent } from './fixtures/page-anchor.component.fixture';
import { StachePageAnchorComponent } from './page-anchor.component';
import { StachePageAnchorModule } from './page-anchor.module';
import { StachePageAnchorService } from './page-anchor.service';

describe('StachePageAnchorComponent', () => {
  let fixtureComponent: StachePageAnchorTestComponent;
  let fixture: ComponentFixture<StachePageAnchorTestComponent>;
  let anchorComponent: StachePageAnchorComponent;
  let mockWindowService: any;
  let mockAnchorService: any;
  let mockRouteService: any;

  class MockAnchorService {
    public refreshRequestedStream = new Subject();

    public addAnchor = (anchor: any) => true;

    public scrollToAnchor(elementId: string) {
      /* */
    }
  }

  class MockWindowService {
    public nativeWindow = {
      document: {
        querySelector: jasmine
          .createSpy('querySelector')
          .and.callFake((fragment: any) => {
            return this.testElement;
          }),
      },
      location: {
        href: '',
      },
    };

    public testElement = {
      scrollIntoView: jasmine.createSpy('scrollIntoView').and.callFake(() => {
        /* */
      }),
    };
  }

  class MockRouteService {
    public getActiveUrl = (): any => '/';
  }

  beforeEach(async () => {
    mockWindowService = new MockWindowService();
    mockAnchorService = new MockAnchorService();
    mockRouteService = new MockRouteService();

    await TestBed.configureTestingModule({
      declarations: [StachePageAnchorTestComponent],
      imports: [RouterTestingModule, StachePageAnchorModule],
      providers: [
        { provide: StacheWindowRef, useValue: mockWindowService },
        { provide: StachePageAnchorService, useValue: mockAnchorService },
        { provide: StacheRouteService, useValue: mockRouteService },
        ChangeDetectorRef,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StachePageAnchorTestComponent);
    fixtureComponent = fixture.componentInstance;
    anchorComponent = fixture.debugElement.query(
      By.directive(StachePageAnchorComponent),
    ).componentInstance;
  });

  it('should scroll to anchor', () => {
    const scrollSpy = spyOn(mockAnchorService, 'scrollToAnchor');

    fixtureComponent.anchorContent = 'foo';
    fixture.detectChanges();

    anchorComponent.scrollToAnchor();

    expect(scrollSpy).toHaveBeenCalledWith('foo');
  });

  it('should populate data after view init', () => {
    fixtureComponent.anchorContent = 'foo';
    fixture.detectChanges();
    expect(anchorComponent.name).toEqual('foo');
  });

  it('should populate data after view init', () => {
    fixtureComponent.anchorContent = 'foo';
    fixture.detectChanges();
    expect(anchorComponent.name).toEqual('foo');
  });

  it('should set the anchors id/fragment from the anchor content', () => {
    fixtureComponent.anchorContent = 'foo';
    fixture.detectChanges();
    const el = fixture.debugElement.nativeElement.querySelector(
      '.stache-page-anchor',
    );
    expect(anchorComponent.fragment).toEqual('foo');
    expect(el.id).toBe('foo');
  });

  it('should set the anchors id/fragment to anchorId over anchor content', () => {
    fixtureComponent.anchorId = 'bar';
    fixtureComponent.anchorContent = 'foo';
    fixture.detectChanges();
    const el = fixture.debugElement.nativeElement.querySelector(
      '.stache-page-anchor',
    );
    expect(anchorComponent.fragment).toEqual('bar');
    expect(el.id).toBe('bar');
  });

  it('should update the anchor on refreshRequested', () => {
    fixture.detectChanges();
    spyOn(anchorComponent.anchorStream, 'next').and.callThrough();
    mockAnchorService.refreshRequestedStream.next();

    expect(anchorComponent.anchorStream.next).toHaveBeenCalled();
  });

  it('should update the name value if the textContent changes ', () => {
    fixtureComponent.anchorContent = 'foo';
    fixture.detectChanges();
    expect(anchorComponent.name).toEqual('foo');

    fixtureComponent.anchorContent = 'bar';
    fixture.detectChanges();
    expect(anchorComponent.name).toEqual('bar');
  });

  it('should update the offsetTop value if the offsetTop changes ', () => {
    let offsetValue = 100;

    spyOn<any>(anchorComponent, 'getOffset').and.callFake(() => {
      return offsetValue;
    });

    fixture.detectChanges();
    expect(anchorComponent.offsetTop).toEqual(100);
    offsetValue = 300;
    fixture.detectChanges();
    anchorComponent.ngAfterViewChecked();
    expect(anchorComponent.offsetTop).toEqual(300);
  });
});
