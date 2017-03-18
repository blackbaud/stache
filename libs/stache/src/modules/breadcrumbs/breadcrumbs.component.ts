import { Component, Input } from '@angular/core';

@Component({
  selector: 'stache-breadcrumbs',
  templateUrl: './breadcrumbs.component.html'
})
export class StacheBreadcrumbsComponent {
  @Input()
  public routes: any[] = [
    {
      label: 'Learn'
    },
    {
      label: 'Components'
    }
  ];

  public constructor() {}
}
