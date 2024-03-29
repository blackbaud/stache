import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { StachePageHeaderTestComponent } from './fixtures/page-header.component.fixture';
import { StachePageHeaderModule } from './page-header.module';

describe('StachePageHeaderComponent', () => {
  let fixture: ComponentFixture<StachePageHeaderTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StachePageHeaderModule],
      declarations: [StachePageHeaderTestComponent],
    });

    fixture = TestBed.createComponent(StachePageHeaderTestComponent);
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should transclude the content', () => {
    const text = 'Header';
    const testFixture = TestBed.createComponent(StachePageHeaderTestComponent);
    testFixture.componentInstance.headerText = text;
    const testElement = testFixture.nativeElement;
    testFixture.detectChanges();
    expect(testElement.querySelector('.stache-page-header')).toHaveText(text);
  });
});
