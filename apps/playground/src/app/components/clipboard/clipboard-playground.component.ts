import { Component } from '@angular/core';

@Component({
  selector: 'app-clipboard-playground',
  templateUrl: './clipboard-playground.component.html',
  standalone: false,
})
export class ClipboardPlaygroundComponent {
  public copyTarget: HTMLElement | undefined;
}
