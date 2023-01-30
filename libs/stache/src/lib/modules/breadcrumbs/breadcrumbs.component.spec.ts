import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@skyux-sdk/testing';

import { StacheRouteService } from '../router/route.service';

import { StacheBreadcrumbsComponent } from './breadcrumbs.component';
import { StacheBreadcrumbsModule } from './breadcrumbs.module';

describe('StacheBreadcrumbsComponent', () => {
  let component: StacheBreadcrumbsComponent;
  let fixture: ComponentFixture<StacheBreadcrumbsComponent>;

  let mockRoutes: Routes;

  let mockActiveUrl: string;

  class MockRouteService {
    public getActiveRoutes(): Routes {
      return mockRoutes;
    }
    public getActiveUrl(): string {
      return mockActiveUrl;
    }
  }

  beforeEach(() => {
    mockRoutes = [
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
    ];
    mockActiveUrl = '';
    TestBed.configureTestingModule({
      declarations: [],
      imports: [RouterTestingModule, StacheBreadcrumbsModule],
      providers: [{ provide: StacheRouteService, useClass: MockRouteService }],
    });

    fixture = TestBed.createComponent(StacheBreadcrumbsComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should only have one route on base root path', () => {
    component.routes = undefined;
    mockActiveUrl = '';
    mockRoutes = [
      {
        path: '',
        children: [],
      },
    ];
    fixture.detectChanges();
    const links = fixture.debugElement.queryAll(By.css('.stache-nav-anchor'));

    expect(links.length).toBe(1);
  });

  it('should have at least one route on base root path', () => {
    component.routes = undefined;
    mockActiveUrl = '';
    mockRoutes = [];
    fixture.detectChanges();
    const links = fixture.debugElement.queryAll(By.css('.stache-nav-anchor'));

    expect(links.length).toBe(1);
  });

  it('should display navigation links', () => {
    component.routes = [
      { name: 'Test 1', path: [] },
      { name: 'Test 2', path: [] },
    ];

    fixture.detectChanges();
    const links = fixture.debugElement.queryAll(By.css('.stache-nav-anchor'));

    expect(links.length).toBe(2);
  });

  it('should generate child routes from Router', () => {
    mockActiveUrl = '/parent/child';
    mockRoutes = [
      {
        path: 'parent',
        children: [
          {
            path: 'parent/child',
            children: [
              {
                path: 'parent/child/grandchild',
                children: [],
              },
            ],
          },
        ],
      },
    ];
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.routes?.length).toBe(3);
  });

  it('should not generate routes beyond the current path', () => {
    mockActiveUrl = '/parent/child';
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.routes?.length).toBe(3);
  });

  it('should generate grandchild routes from Router', () => {
    mockActiveUrl = '/parent/child/grandchild';
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.routes?.length).toBe(4);
  });

  it('should add a link to the home page', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.routes?.[0].name).toBe('Home');
  });
});
