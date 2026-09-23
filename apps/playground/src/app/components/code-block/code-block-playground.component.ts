import { Component } from '@angular/core';

@Component({
  selector: 'app-code-block-playground',
  templateUrl: './code-block-playground.component.html',
  preserveWhitespaces: true,
  standalone: false,
})
export class CodeBlockPlaygroundComponent {
  protected readonly typescriptSample = `import { Component, input } from '@angular/core';

/** Renders a greeting for the given name. */
@Component({
  selector: 'app-greeting',
  template: '<p>Hello, {{ name() }}!</p>',
})
export class GreetingComponent {
  public readonly name = input<string>('world');
  public readonly retries = 3;
  public readonly enabled = true;

  public greet(): string {
    return \`Hello, \${this.name()}\`.toUpperCase();
  }
}`;

  protected readonly htmlSample = `<!-- A simple SKY UX button -->
<button class="sky-btn sky-btn-primary" type="button" [disabled]="busy">
  Save &amp; close
</button>`;

  protected readonly cssSample = `/* Card container */
.sky-card {
  display: flex;
  padding: 15px 20px;
  border: 1px solid var(--sky-color-border-container-base, #e0e1e2);
  font-family: 'Blackbaud Sans', sans-serif;
}

.sky-card:hover > .sky-card-title::after {
  content: ' \\2192';
  color: rgba(0, 0, 0, 0.6);
}

@media (min-width: 768px) {
  .sky-card {
    width: calc(50% - 10px);
  }
}`;
}
