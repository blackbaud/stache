import { Component, Input } from '@angular/core';

import { StacheNavLink } from '../nav/nav-link';
import { booleanConverter } from '../shared/input-converter';

const SEARCH_KEYS: (keyof StacheNavLink)[] = ['name', 'summary'];

/**
 * @deprecated Use SKY UX action buttons instead: https://developer.blackbaud.com/skyux/components/action-button
 */
@Component({
  selector: 'stache-action-buttons',
  templateUrl: './action-buttons.component.html',
  styleUrls: ['./action-buttons.component.scss'],
  standalone: false,
})
export class StacheActionButtonsComponent {
  @Input()
  public set routes(value: StacheNavLink[] | undefined) {
    this.#_routes = value;
    this.filteredRoutes = value || [];
  }

  public get routes(): StacheNavLink[] | undefined {
    return this.#_routes;
  }

  @Input()
  public set showSearch(value: boolean | string | undefined) {
    this.#_showSearch = booleanConverter(value) !== false;
  }

  public get showSearch(): boolean {
    return this.#_showSearch;
  }

  public filteredRoutes: StacheNavLink[] = [];

  public searchText = '';

  #_routes: StacheNavLink[] | undefined;

  #_showSearch = true;

  public onKeyUp(event: KeyboardEvent): void {
    const searchText = (event.target as HTMLInputElement).value;
    this.searchApplied(searchText);
  }

  public searchApplied(searchText: string): void {
    this.searchText = searchText;
    if (!searchText) {
      return;
    }

    if (this.routes) {
      const query = searchText.toLowerCase();
      this.filteredRoutes = this.routes.filter((route) => {
        const matchingFields = SEARCH_KEYS.filter((key) => {
          const value = route[key] as string | undefined;
          return value && value.toLowerCase().includes(query);
        });

        return matchingFields.length > 0;
      });
    }
  }
}
