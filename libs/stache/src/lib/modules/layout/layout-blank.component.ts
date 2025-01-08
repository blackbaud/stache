import { Component, Input, OnInit } from '@angular/core';

const DEFAULT_IDENTIFIER = 'blank';

@Component({
  selector: 'stache-layout-blank',
  templateUrl: './layout-blank.component.html',
  styleUrls: ['./layout-blank.component.scss'],
  standalone: false,
})
export class StacheLayoutBlankComponent implements OnInit {
  @Input()
  public set identifier(value: string | undefined) {
    this.#_identifier = value || DEFAULT_IDENTIFIER;
    this.#updateClassName();
  }

  public get identifier(): string {
    return this.#_identifier;
  }

  public className: string | undefined;

  #_identifier = DEFAULT_IDENTIFIER;

  public ngOnInit(): void {
    this.#updateClassName();
  }

  #updateClassName(): void {
    this.className = `stache-layout-${this.identifier}`;
  }
}
