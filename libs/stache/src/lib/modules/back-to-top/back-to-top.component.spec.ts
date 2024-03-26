import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  inject,
  tick,
} from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyAppTestUtility } from '@skyux-sdk/testing';

import { StacheWindowRef } from '../shared/window-ref';

import { StacheBackToTopComponent } from './back-to-top.component';
import { StacheBackToTopModule } from './back-to-top.module';

describe('StacheBackToTopComponent', () => {
  let component: StacheBackToTopComponent;
  let fixture: ComponentFixture<StacheBackToTopComponent>;
  let debugElement: DebugElement;
  let windowRef: Window;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StacheBackToTopModule],
    });

    fixture = TestBed.createComponent(StacheBackToTopComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  beforeEach(inject([StacheWindowRef], (service: StacheWindowRef) => {
    windowRef = service.nativeWindow;
  }));

  it('should have a default offset value of 200', () => {
    fixture.detectChanges();
    const expectedOffsetValue = component.offset;
    expect(expectedOffsetValue).toBe(200);
  });

  it('should have the set offset value', () => {
    component.offset = 400;
    fixture.detectChanges();
    const expectedOffsetValue = component.offset;
    expect(expectedOffsetValue).toBe(400);
  });

  it('should reset offset', () => {
    component.offset = 400;
    fixture.detectChanges();
    expect(component.offset).toBe(400);

    component.offset = undefined;
    fixture.detectChanges();
    expect(component.offset).toBe(200); // <-- default
  });

  it('should be hidden when the window y offset is less than the specified offset', () => {
    fixture.detectChanges();
    expect(component.isHidden).toBe(true);
  });

  it('should show when the window y offset is greater than the specified offset', fakeAsync(() => {
    component.offset = 0;
    SkyAppTestUtility.fireDomEvent(windowRef, 'scroll');
    tick();
    expect(component.isHidden).toBe(false);
  }));

  it('should trigger a click event on button click', async () => {
    spyOn(component, 'scrollToTop');
    const button = debugElement.nativeElement.querySelector(
      '.stache-back-to-top',
    );
    button.click();
    await fixture.whenStable();
    expect(component.scrollToTop).toHaveBeenCalled();
  });

  it('should call the scroll method on the window when clicked', async () => {
    spyOn(windowRef, 'scroll');
    const button = debugElement.nativeElement.querySelector(
      '.stache-back-to-top',
    );
    button.click();
    await fixture.whenStable();
    expect(windowRef.scroll).toHaveBeenCalled();
  });

  it('should be accessible', async () => {
    component.isHidden = false;
    fixture.detectChanges();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});
