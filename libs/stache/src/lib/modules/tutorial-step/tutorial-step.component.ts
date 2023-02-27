import { Component, Input } from '@angular/core';

import { booleanConverter } from '../shared/input-converter';

@Component({
  selector: 'stache-tutorial-step',
  templateUrl: './tutorial-step.component.html',
  styleUrls: ['./tutorial-step.component.scss'],
})
export class StacheTutorialStepComponent {
  @Input()
  public set showNumber(value: boolean | string | undefined) {
    this.#_showNumber = booleanConverter(value) !== false;
  }

  public get showNumber(): boolean {
    return this.#_showNumber;
  }

  #_showNumber = true;
}
