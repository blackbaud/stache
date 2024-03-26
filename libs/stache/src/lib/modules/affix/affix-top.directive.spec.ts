import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  inject,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect } from '@skyux-sdk/testing';
import { SkyAppTestUtility } from '@skyux-sdk/testing';

import { StacheOmnibarAdapterService } from '../shared/omnibar-adapter.service';

import { StacheAffixTopDirective } from './affix-top.directive';
import { AffixTopFixtureComponent } from './fixtures/affix-top.component.fixture';
import { AffixFixtureModule } from './fixtures/affix.module.fixture';

describe('StacheAffixTopDirective', () => {
  const className = 'stache-affix-top';

  let omnibarAdapterService: StacheOmnibarAdapterService;
  let fixture: ComponentFixture<AffixTopFixtureComponent>;

  function detectChanges(): void {
    fixture.detectChanges();
    tick();
  }
  
  function getDirectiveElements(): DebugElement[] {
    return fixture.debugElement.queryAll(
      By.directive(StacheAffixTopDirective)
    );
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AffixFixtureModule],
    });

    fixture = TestBed.createComponent(AffixTopFixtureComponent);
  });

  beforeEach(inject(
    [StacheOmnibarAdapterService],
    (_omnibarAdapterService: StacheOmnibarAdapterService) => {
      omnibarAdapterService = _omnibarAdapterService;
    }
  ));

  it('should exist on the component', fakeAsync(() => {
    detectChanges();

    expect(getDirectiveElements()[0]).not.toBeNull();
  }));

  it('should call the on window scroll method when the window scrolls', fakeAsync(() => {
    const directiveInstance = getDirectiveElements()[0].injector.get(
      StacheAffixTopDirective
    );

    detectChanges();

    spyOn(directiveInstance, 'onWindowScroll').and.callThrough();
    SkyAppTestUtility.fireDomEvent(window, 'scroll');

    expect(directiveInstance.onWindowScroll).toHaveBeenCalled();
  }));

  it('should add or remove stache-affix-top class based on offset to window ratio', fakeAsync(() => {
    detectChanges();

    const element = getDirectiveElements()[0].nativeElement;
    element.style.marginTop = '50px';

    window.scrollTo(0, 500);
    SkyAppTestUtility.fireDomEvent(window, 'scroll');

    detectChanges();

    expect(element).toHaveCssClass(className);

    window.scrollTo(0, 0);
    SkyAppTestUtility.fireDomEvent(window, 'scroll');

    detectChanges();

    expect(element).not.toHaveCssClass(className);
  }));

  it('should take the omnibar height into consideration in the offset to window ratio', fakeAsync(() => {
    detectChanges();

    const element = getDirectiveElements()[0].nativeElement;
    element.style.marginTop = '50px';

    window.scrollTo(0, 25);
    SkyAppTestUtility.fireDomEvent(window, 'scroll');

    detectChanges();

    expect(element).not.toHaveCssClass(className);

    spyOn(omnibarAdapterService, 'getHeight').and.returnValue(50);

    SkyAppTestUtility.fireDomEvent(window, 'scroll');

    detectChanges();

    expect(element).toHaveCssClass(className);
  }));

  it("should add or remove stache-affix-top class to a component's first child", fakeAsync(() => {
    detectChanges();

    window.scrollTo(0, 500);
    SkyAppTestUtility.fireDomEvent(window, 'scroll');

    detectChanges();

    let element = getDirectiveElements()[1].nativeElement.children[0];

    expect(element).toHaveCssClass(className);

    window.scrollTo(0, 0);
    SkyAppTestUtility.fireDomEvent(window, 'scroll');
    detectChanges();
    
    element = getDirectiveElements()[1].nativeElement.children[0]

    expect(element).not.toHaveCssClass(className);
  }));

  it('should not attempt to reset the element if it already has', fakeAsync(() => {
    detectChanges();

    const element = getDirectiveElements()[0].nativeElement;
    element.style.marginTop = '500px';

    window.scrollTo(0, 0);
    SkyAppTestUtility.fireDomEvent(window, 'scroll');

    detectChanges();

    expect(element).not.toHaveCssClass(className);

    SkyAppTestUtility.fireDomEvent(window, 'scroll');

    detectChanges();

    expect(element).not.toHaveCssClass(className);
  }));

  it('should set the maxHeight of the element based on footer offset - window pageYOffset - omnibar height', fakeAsync(() => {
    // Create a mock footer.
    const footer = document.createElement('div');
    footer.className = 'stache-footer-wrapper';
    footer.style.position = 'absolute';
    footer.style.top = '450px';
    footer.innerHTML = '<p>Stache footer</p>';
    document.body.appendChild(footer);

    detectChanges();

    const element = getDirectiveElements()[0].nativeElement;

    detectChanges();

    window.resizeTo(1200, 800);
    window.scrollBy(0, 350);

    spyOn(omnibarAdapterService, 'getHeight').and.returnValue(50);

    SkyAppTestUtility.fireDomEvent(window, 'scroll');

    detectChanges();

    expect(element.style.height).toEqual('50px');

    footer.remove();
  }));
});
