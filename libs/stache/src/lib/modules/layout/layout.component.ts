import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { StacheNavLink } from '../nav/nav-link';
import { StacheWindowRef } from '../shared/window-ref';

import { StacheLayout } from './layout';

const DEFAULT_LAYOUT = 'sidebar';

@Component({
  selector: 'stache-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class StacheLayoutComponent implements OnInit, OnChanges, StacheLayout {
  @Input()
  public pageTitle: string | undefined;

  @Input()
  public set layoutType(value: string | undefined) {
    this.#_layoutType = value || DEFAULT_LAYOUT;
    this.#updateTemplateRef();
  }

  public get layoutType(): string {
    return this.#_layoutType;
  }

  @Input()
  public inPageRoutes: StacheNavLink[] | undefined;

  @Input()
  public showTableOfContents: boolean | undefined;

  @Input()
  public sidebarRoutes: StacheNavLink[] | undefined;

  @Input()
  public breadcrumbsRoutes: StacheNavLink[] | undefined;

  @Input()
  public showBreadcrumbs: boolean | undefined;

  @Input()
  public showEditButton: boolean | undefined;

  @Input()
  public showBackToTop: boolean | undefined;

  public templateRef: TemplateRef<unknown> | undefined;

  @ViewChild('blankLayout', {
    read: TemplateRef,
    static: true,
  })
  public blankTemplateRef: TemplateRef<unknown> | undefined;

  @ViewChild('containerLayout', {
    read: TemplateRef,
    static: true,
  })
  public containerTemplateRef: TemplateRef<unknown> | undefined;

  @ViewChild('sidebarLayout', {
    read: TemplateRef,
    static: true,
  })
  public sidebarTemplateRef: TemplateRef<unknown> | undefined;

  #_layoutType = DEFAULT_LAYOUT;

  #elementRef: ElementRef;
  #renderer: Renderer2;
  #windowRef: StacheWindowRef;

  constructor(
    elementRef: ElementRef,
    renderer: Renderer2,
    windowRef: StacheWindowRef,
  ) {
    this.#elementRef = elementRef;
    this.#renderer = renderer;
    this.#windowRef = windowRef;
  }

  public ngOnInit(): void {
    this.#updateTemplateRef();
  }

  public ngOnChanges(): void {
    // Reset the wrapper height whenever there are changes.
    setTimeout(() => {
      this.#setMinHeight();
    });
  }

  #setMinHeight(): void {
    const wrapper = this.#elementRef.nativeElement.querySelector(
      '.stache-layout-wrapper',
    );
    const minHeight =
      this.#windowRef.nativeWindow.innerHeight -
      wrapper.getBoundingClientRect().top;
    this.#renderer.setStyle(wrapper, 'min-height', `${minHeight}px`);
  }

  #updateTemplateRef(): void {
    switch (this.layoutType) {
      case 'blank':
        this.templateRef = this.blankTemplateRef;
        break;
      case 'sidebar':
        this.templateRef = this.sidebarTemplateRef;
        break;
      default:
        this.templateRef = this.containerTemplateRef;
        break;
    }
  }
}
