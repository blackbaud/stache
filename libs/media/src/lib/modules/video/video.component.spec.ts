import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { SkyVideoComponent } from './video.component';

describe('SkyVideoComponent', () => {
  let component: SkyVideoComponent;
  let fixture: ComponentFixture<SkyVideoComponent>;
  let debugElement: DebugElement;

  function getIframeSourceUrl(): string {
    return (
      debugElement.nativeElement.querySelector('iframe')?.getAttribute('src') ||
      ''
    );
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SkyVideoComponent],
    });

    fixture = TestBed.createComponent(SkyVideoComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it('should bypass security and assign the URL to iframe `src` attribute', () => {
    component.videoSource = 'https://google.com';

    fixture.detectChanges();

    const src = getIframeSourceUrl();

    expect(src).toEqual('https://google.com');
  });

  it('should support changing the source URL', () => {
    let src: string;
    let expectedSource = 'https://foo';

    component.videoSource = expectedSource;

    fixture.detectChanges();

    src = getIframeSourceUrl();

    expect(src).toEqual(expectedSource);

    expectedSource = 'https://bar';
    component.videoSource = expectedSource;

    fixture.detectChanges();

    src = getIframeSourceUrl();

    expect(src).toEqual(expectedSource);
  });

  it('should allow resetting the video source', () => {
    component.videoSource = 'https://foo';
    fixture.detectChanges();

    expect(getIframeSourceUrl()).toEqual('https://foo');

    component.videoSource = undefined;
    fixture.detectChanges();

    expect(getIframeSourceUrl()).toEqual('');
  });
});
