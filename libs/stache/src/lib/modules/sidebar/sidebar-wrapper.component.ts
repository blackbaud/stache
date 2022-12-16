import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { SkyMediaBreakpoints, SkyMediaQueryService } from '@skyux/core';

import { Subscription } from 'rxjs';

import { StacheNavLink } from '../nav/nav-link';
import { StacheWindowRef } from '../shared/window-ref';

const SIDEBAR_CSS_CLASS_NAME = 'stache-sidebar-enabled';
let nextUniqueId = 0;

@Component({
  selector: 'stache-sidebar-wrapper',
  templateUrl: './sidebar-wrapper.component.html',
  styleUrls: ['./sidebar-wrapper.component.scss'],
})
export class StacheSidebarWrapperComponent implements OnDestroy, AfterViewInit {
  @Input()
  public sidebarRoutes: StacheNavLink[] | undefined;

  public sidebarOpen = false;

  public sidebarLabel = 'Click to open sidebar';

  public elementId = `stache-sidebar-content-panel-${nextUniqueId++}`;

  #mediaQuerySubscription: Subscription;

  #renderer: Renderer2;
  #windowRef: StacheWindowRef;

  constructor(
    renderer: Renderer2,
    windowRef: StacheWindowRef,
    mediaQuerySvc: SkyMediaQueryService
  ) {
    this.#renderer = renderer;
    this.#windowRef = windowRef;
    this.#mediaQuerySubscription = mediaQuerySvc.subscribe((args) => {
      this.sidebarOpen = args <= SkyMediaBreakpoints.sm;
      this.toggleSidebar();
    });
  }

  public ngAfterViewInit(): void {
    this.#addClassToBody();
  }

  public ngOnDestroy(): void {
    this.#removeClassFromBody();
    this.#mediaQuerySubscription.unsubscribe();
  }

  public toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  #addClassToBody(): void {
    this.#renderer.addClass(
      this.#windowRef.nativeWindow.document.body,
      SIDEBAR_CSS_CLASS_NAME
    );
  }

  #removeClassFromBody(): void {
    this.#renderer.removeClass(
      this.#windowRef.nativeWindow.document.body,
      SIDEBAR_CSS_CLASS_NAME
    );
  }
}
