import { Component } from '@angular/core';
import { StacheWrapperModule } from '@blackbaud/skyux-lib-stache';

@Component({
  standalone: true,
  imports: [StacheWrapperModule],
  selector: 'app-lazy',
  templateUrl: './lazy.component.html',
})
export default class LazyComponent {}
