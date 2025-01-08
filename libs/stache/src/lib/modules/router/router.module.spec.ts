import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { StacheRouteService } from './route.service';
import { StacheRouterModule } from './router.module';

@Component({
  template: '',
  standalone: false,
})
class TestComponent {}

describe('StacheRouterModule', () => {
  it('should have a forChild method', () => {
    expect(StacheRouterModule.forChild).toBeDefined();
  });

  it('should prepend the path to the route', async () => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: '',
            component: TestComponent,
            data: { stache: { name: 'Emptiness' } },
          },
          {
            path: 'test',
            component: TestComponent,
            data: { stache: { name: 'Test' } },
          },
          {
            path: 'test/example',
            component: TestComponent,
            data: { stache: { name: 'Example' } },
          },
        ]),
        StacheRouterModule.forChild('test'),
      ],
    });
    const service = TestBed.inject(StacheRouteService);
    const fixture = TestBed.createComponent(TestComponent);
    await fixture.ngZone.run(() =>
      TestBed.inject(Router).navigateByUrl('test'),
    );
    expect(TestBed.inject(Router).url).toEqual('/test');
    expect(service.getActiveRoutes().map((r) => r.path)).toEqual(['test']);
  });
});
