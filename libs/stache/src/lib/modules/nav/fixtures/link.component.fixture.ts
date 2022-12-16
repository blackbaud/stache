import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'stache-test-component',
  templateUrl: './link.component.fixture.html',
})
export class StacheRouterLinkTestComponent {
  public fragment: string | undefined;
  public routerLink: string | string[] | undefined;

  @ViewChild('anchorEl')
  public anchorEl!: ElementRef;
}
