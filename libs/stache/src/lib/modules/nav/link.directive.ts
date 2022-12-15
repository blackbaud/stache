import { LocationStrategy } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  Renderer2,
} from '@angular/core';

import { StacheRouteService } from '../router/route.service';

import { StacheNavService } from './nav.service';

@Directive({
  selector: '[stacheRouterLink]',
})
export class StacheRouterLinkDirective implements OnChanges, AfterViewInit {
  @Input()
  public set stacheRouterLink(value: string | string[] | undefined) {
    if (value === '.') {
      this.#_stacheRouterLink = this.#routerSvc.getActiveUrl();
    } else {
      this.#_stacheRouterLink = Array.isArray(value)
        ? value.join('/')
        : value ?? '';
    }
  }

  public get stacheRouterLink(): string {
    return this.#_stacheRouterLink;
  }

  @Input()
  public fragment: string | undefined;

  @HostBinding()
  public href: string | undefined;

  #_stacheRouterLink = '';
  #navSvc: StacheNavService;
  #routerSvc: StacheRouteService;
  #locationStrategy: LocationStrategy;

  constructor(
    navSvc: StacheNavService,
    routerSvc: StacheRouteService,
    elementRef: ElementRef,
    locationStrategy: LocationStrategy,
    renderer: Renderer2
  ) {
    this.#routerSvc = routerSvc;
    this.#locationStrategy = locationStrategy;
    this.#navSvc = navSvc;
    renderer.setStyle(elementRef.nativeElement, 'cursor', 'pointer');
  }

  public ngOnChanges(): void {
    this.#updateTargetUrlAndHref();
  }

  public ngAfterViewInit(): void {
    this.#updateTargetUrlAndHref();
  }

  @HostListener('click', ['$event'])
  public navigate(event: MouseEvent): boolean {
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      return true;
    } else {
      event.preventDefault();
      this.#navSvc.navigate({
        path: this.stacheRouterLink,
        fragment: this.fragment,
      });
      return true;
    }
  }

  #updateTargetUrlAndHref(): void {
    let path = `${this.stacheRouterLink}`;

    if (this.fragment) {
      path += `#${this.fragment}`;
    }

    if (this.#navSvc.isExternal(path)) {
      this.href = path;
    } else {
      this.href = this.#locationStrategy.prepareExternalUrl(path);
    }
  }
}
