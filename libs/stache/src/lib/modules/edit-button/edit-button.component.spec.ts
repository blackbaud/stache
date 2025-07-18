import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@skyux-sdk/testing';
import { SkyAppConfig, SkyuxConfig } from '@skyux/config';

import { StacheRouteService } from '../router/route.service';

import { StacheEditButtonComponent } from './edit-button.component';
import { StacheEditButtonModule } from './edit-button.module';

describe('StacheEditButtonComponent', () => {
  let component: StacheEditButtonComponent;
  let fixture: ComponentFixture<StacheEditButtonComponent>;
  let mockConfigService: MockConfigService;
  let mockRouteService: MockRouteService;

  class MockConfigService {
    public skyux: SkyuxConfig = {
      appSettings: {
        stache: {
          editButton: {
            url: 'https://github.com/blackbaud/skyux-lib-stache',
            text: undefined,
          },
        },
      },
    };
  }

  class MockRouteService {
    public getActiveUrl = jasmine
      .createSpy('getActiveRoute')
      .and.callFake(() => '/test/route');
  }

  beforeEach(() => {
    mockConfigService = new MockConfigService();
    mockRouteService = new MockRouteService();

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, StacheEditButtonModule],
      providers: [
        { provide: SkyAppConfig, useValue: mockConfigService },
        { provide: StacheRouteService, useValue: mockRouteService },
      ],
    });

    fixture = TestBed.createComponent(StacheEditButtonComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should set the editButtonText to Edit by default', () => {
    fixture.detectChanges();
    expect(component.editButtonText).toBe('Edit');
  });

  it('should update the editButtonText based on the config', async () => {
    mockConfigService.skyux.appSettings.stache.editButton.text = 'Edit Test';
    fixture = TestBed.createComponent(StacheEditButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component['editButtonText']).toBe('Edit Test');
  });

  it('should set the url for a gitHub repo', () => {
    fixture.detectChanges();
    expect(component['url']).toBe(
      'https://github.com/blackbaud/skyux-lib-stache/tree/master/src/app%2Ftest%2Froute%2Findex.component.html',
    );
  });

  it('should set the url for a VSTS repo', () => {
    // tslint:disable-next-line:max-line-length
    mockConfigService.skyux.appSettings.stache.editButton.url =
      'https://blackbaud.visualstudio.com/Products/_git/skyux-spa-stache-test-pipeline';

    fixture = TestBed.createComponent(StacheEditButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component['url']).toBe(
      'https://blackbaud.visualstudio.com/Products/_git/skyux-spa-stache-test-pipeline?path=%2Fsrc%2Fapp%2Ftest%2Froute%2Findex.component.html&version=GBmaster',
    );
  });

  it('should not append a forward slash for the home route', () => {
    mockRouteService.getActiveUrl.and.callFake(() => '/');
    fixture = TestBed.createComponent(StacheEditButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.url).toEqual(
      'https://github.com/blackbaud/skyux-lib-stache/tree/master/src/app%2Findex.component.html',
    );
  });

  it('should not display if no url is set', () => {
    mockConfigService.skyux.appSettings.stache.editButton.url = undefined;

    fixture = TestBed.createComponent(StacheEditButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component['url']).toBe('');
    expect(fixture.debugElement.query(By.css('button'))).toBeNull();
  });
});
