import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@skyux-sdk/testing';

import { Subject } from 'rxjs';

import { StacheRouteService } from '../router/route.service';

import { StacheLayoutComponent } from './layout.component';
import { StacheLayoutModule } from './layout.module';

const mockRoutes = [
  {
    path: '',
    children: [
      {
        path: 'parent',
        children: [
          {
            path: 'parent/child',
            children: [
              {
                path: 'parent/child/grandchild',
              },
            ],
          },
        ],
      },
    ],
  },
];

class MockRouteService {
  public readonly updated$ = new Subject<void>();

  public getActiveRoutes(): Routes {
    return mockRoutes;
  }
  public getActiveUrl(): string {
    return '';
  }
}

describe('StacheLayoutComponent', () => {
  function getWrapperEl(): HTMLDivElement {
    return fixture.debugElement.query(By.css('.stache-layout-wrapper'))
      .nativeElement;
  }

  let component: StacheLayoutComponent;
  let fixture: ComponentFixture<StacheLayoutComponent>;
  const sampleRoutes = [{ name: 'test', path: '/test' }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StacheLayoutModule, RouterTestingModule],
      providers: [{ provide: StacheRouteService, useClass: MockRouteService }],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(StacheLayoutComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should have a pageTitle input', () => {
    component.pageTitle = 'Test Title';
    fixture.detectChanges();
    expect(component.pageTitle).toBe('Test Title');
  });

  it('should have a layoutType input', () => {
    component.layoutType = 'sidebar';
    fixture.detectChanges();
    expect(component.layoutType).toBe('sidebar');
  });

  it('should have an inPageRoutes input', () => {
    component.inPageRoutes = sampleRoutes;
    fixture.detectChanges();
    expect(component.inPageRoutes.length).toBe(1);
  });

  it('should have a showTableOfContents input', () => {
    component.showTableOfContents = true;
    fixture.detectChanges();
    expect(component.showTableOfContents).toBe(true);
  });

  it('should have a sidebarRoutes input', () => {
    component.sidebarRoutes = sampleRoutes;
    fixture.detectChanges();
    expect(component.sidebarRoutes.length).toBe(1);
  });

  it('should have a breadcrumbsRoutes input', () => {
    component.breadcrumbsRoutes = sampleRoutes;
    fixture.detectChanges();
    expect(component.breadcrumbsRoutes.length).toBe(1);
  });

  it('should have a showBreadcrumbs input', () => {
    component.showBreadcrumbs = false;
    fixture.detectChanges();
    expect(component.showBreadcrumbs).toBe(false);
  });

  it('should have a showEditButton input', () => {
    component.showBreadcrumbs = true;
    fixture.detectChanges();
    expect(component.showBreadcrumbs).toBe(true);
  });

  it('should have a showBackToTop input', () => {
    component.showBackToTop = true;
    fixture.detectChanges();
    expect(component.showBackToTop).toBe(true);
  });

  it('should set the input, layoutType, to sidebar by default', () => {
    fixture.detectChanges();
    expect(component.layoutType).toBe('sidebar');
  });

  it('should set the template ref to blank given the layoutType', () => {
    component.layoutType = 'blank';
    fixture.detectChanges();
    const layout = component['blankTemplateRef'];
    expect(component.templateRef).toBe(layout);
  });

  it('should set the template ref to container given the layoutType', () => {
    component.layoutType = 'container';
    fixture.detectChanges();
    const layout = component['containerTemplateRef'];
    expect(component.templateRef).toBe(layout);
  });

  it('should set the template ref to sidebar given the layoutType', () => {
    component.layoutType = 'sidebar';
    fixture.detectChanges();
    const layout = component['sidebarTemplateRef'];
    expect(component.templateRef).toBe(layout);
  });

  it('should set the min-height of the wrapper', fakeAsync(() => {
    component.layoutType = 'sidebar';
    component.ngOnChanges();
    fixture.detectChanges();
    tick();
    const wrapper = getWrapperEl();
    expect(wrapper.style.minHeight).toBeDefined();
  }));

  it('should reset the layout type', () => {
    component.layoutType = 'blank';
    fixture.detectChanges();
    const wrapper = getWrapperEl();
    expect(wrapper.querySelector('.stache-layout-blank')).toExist();

    // Reset the layout type.
    component.layoutType = undefined;
    fixture.detectChanges();
    // The default layout is 'sidebar'.
    expect(wrapper.querySelector('.stache-layout-sidebar')).toExist();
  });
});
