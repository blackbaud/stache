import {
  ComponentFixture,
  TestBed,
  async,
  tick,
  fakeAsync
} from '@angular/core/testing';

import {
  expect, expectAsync
} from '@skyux-sdk/testing';

import {
  SkyAppWindowRef
} from '@skyux/core';

import {
  SkyCopyToClipboardComponent
} from './clipboard.component';

import {
  SkyCopyToClipboardService
} from './clipboard.service';

import {
  SkyClipboardModule
} from './clipboard.module';
import { SkyClipboardTestComponent } from './fixtures/clipboard.component.fixture';

class MockClipboardService {
  public copyContent(element: HTMLElement) { }
  public verifyCopyCommandBrowserSupport() {}
}

describe('SkyCopyToClipboardComponent', () => {

  function getCopyToClipboardButton(fixture: ComponentFixture<SkyClipboardTestComponent>): HTMLElement {
    return fixture.nativeElement.querySelector('button');
  }
  let component: SkyClipboardTestComponent;
  let fixture: ComponentFixture<SkyClipboardTestComponent>;
  let element: HTMLElement;
  let mockTestElement: any;
  let mockClipboardService: any;

  beforeEach(() => {
    mockClipboardService = new MockClipboardService();

    TestBed.configureTestingModule({
      declarations: [
        SkyClipboardTestComponent
      ],
      imports: [
        SkyClipboardModule
      ],
      providers: [
        SkyAppWindowRef,
        { provide: SkyCopyToClipboardService, useValue: mockClipboardService }
      ]
    });

    fixture = TestBed.createComponent(SkyClipboardTestComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should call the clipboard service with the copyTarget element', fakeAsync(() => {
    spyOn(mockClipboardService, 'copyContent').and.callThrough();
    fixture.detectChanges();
    const target = fixture.nativeElement.querySelector('#test-copy-target');
    getCopyToClipboardButton(fixture).click();
    fixture.detectChanges();
    tick(1000);
    expect(mockClipboardService.copyContent).toHaveBeenCalledWith(target);
  }));

  it('should set the value of buttonActive to true for 1 second after click', fakeAsync(() => {
    expect(component.copyToClipboardComponent.buttonActive).toBe(false);
    component.copyToClipboardComponent.copyToClipboard();
    expect(component.copyToClipboardComponent.buttonActive).toBe(true);
    tick(1000);
    expect(component.copyToClipboardComponent.buttonActive).toBe(false);
  }));

  it('should reset the timeout if clicked again before timeout expires', fakeAsync(() => {
    expect(component.copyToClipboardComponent.buttonActive).toBe(false);
    component.copyToClipboardComponent.copyToClipboard();
    expect(component.copyToClipboardComponent.buttonActive).toBe(true);
    tick(500);
    expect(component.copyToClipboardComponent.buttonActive).toBe(true);
    component.copyToClipboardComponent.copyToClipboard();
    tick(500);
    expect(component.copyToClipboardComponent.buttonActive).toBe(true);
    component.copyToClipboardComponent.copyToClipboard();
    tick(500);
    expect(component.copyToClipboardComponent.buttonActive).toBe(true);
    component.copyToClipboardComponent.copyToClipboard();
    tick(500);
    expect(component.copyToClipboardComponent.buttonActive).toBe(true);
    tick(500);
    expect(component.copyToClipboardComponent.buttonActive).toBe(false);
  }));

  it('should display the given button text when not clicked', () => {
    expect(getCopyToClipboardButton(fixture).innerText.trim()).toEqual('COPY');
  });

  it('should display the given button clicked text after the button is clicked', () => {
    const button = getCopyToClipboardButton(fixture);
    button.click();
    fixture.detectChanges();
    expect(button.innerText.trim()).toEqual('COPIED');
  });

  it('should should reset the button text after a second', fakeAsync(() => {
    const button = getCopyToClipboardButton(fixture);
    button.click();
    fixture.detectChanges();
    expect(button.innerText.trim()).toEqual('COPIED');
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(button.innerText.trim()).toEqual('COPY');
  }));

  it('should specify a default aria-label when none is given', () => {
    const button = getCopyToClipboardButton(fixture);
    expect(button.getAttribute('aria-label')).toEqual('Copy to clipboard');
    expect(button.getAttribute('aria-labelledby')).toBeNull();
  });

  it('should specify an aria-label when one is given', () => {
    component.ariaLabel = 'TEST-LABEL';
    fixture.detectChanges();
    const button = getCopyToClipboardButton(fixture);
    expect(button.getAttribute('aria-label')).toEqual('TEST-LABEL');
    expect(button.getAttribute('aria-labelledby')).toBeNull();
  });

  it('should specify an aria-labelledby attribute when one is given', () => {
    component.ariaLabelledBy = 'test-aria-labelledby';
    fixture.detectChanges();
    const button = getCopyToClipboardButton(fixture);
    expect(button.getAttribute('aria-label')).toBeNull();
    expect(button.getAttribute('aria-labelledby')).toEqual('test-aria-labelledby');
  });

  it('should specify an aria-labelledby attribute when one is given and an aria-label is given', () => {
    component.ariaLabel = 'TEST-LABEL';
    component.ariaLabelledBy = 'test-aria-labelledby';
    fixture.detectChanges();
    const button = getCopyToClipboardButton(fixture);
    expect(button.getAttribute('aria-label')).toBeNull();
    expect(button.getAttribute('aria-labelledby')).toEqual('test-aria-labelledby');
  });

  it('should specify a default title when none is given', () => {
    const button = getCopyToClipboardButton(fixture);
    expect(button.getAttribute('title')).toEqual('Copy to clipboard');
  });

  it('should specify a title when one is given', () => {
    component.title = 'TEST-TITLE';
    fixture.detectChanges();
    const button = getCopyToClipboardButton(fixture);
    expect(button.getAttribute('title')).toEqual('TEST-TITLE');
  });

  it('should pass accessibility', async () => {
    await expectAsync(element).toBeAccessible();
  });
});
