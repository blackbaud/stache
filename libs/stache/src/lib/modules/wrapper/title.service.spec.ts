import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { RuntimeConfig, SkyAppConfig, SkyuxConfig } from '@skyux/config';

import { StacheTitleService } from './title.service';

describe('StacheTitleService', () => {
  function setup(options: { skyuxConfig: SkyuxConfig }): {
    stacheTitleSvc: StacheTitleService;
    title: Title;
  } {
    TestBed.configureTestingModule({
      providers: [
        StacheTitleService,
        {
          provide: SkyAppConfig,
          useValue: {
            skyux: options.skyuxConfig,
            runtime: {} as RuntimeConfig,
          } satisfies SkyAppConfig,
        },
      ],
    });

    return {
      stacheTitleSvc: TestBed.inject(StacheTitleService),
      title: TestBed.inject(Title),
    };
  }

  it('should set the window title with the config app title', () => {
    const { stacheTitleSvc, title } = setup({
      skyuxConfig: { app: { title: 'My Title' } },
    });

    stacheTitleSvc.setTitle();

    expect(title.getTitle()).toBe('My Title');
  });

  it('should set the window title with the config app title and a provided value', () => {
    const { stacheTitleSvc, title } = setup({
      skyuxConfig: { app: { title: 'My Title' } },
    });

    stacheTitleSvc.setTitle('My Page');

    expect(title.getTitle()).toBe('My Page - My Title');
  });

  it('should handle undefined skyuxconfig app title', () => {
    const { stacheTitleSvc, title } = setup({ skyuxConfig: { app: {} } });

    stacheTitleSvc.setTitle();

    expect(title.getTitle()).toEqual('Blackbaud');
  });
});
