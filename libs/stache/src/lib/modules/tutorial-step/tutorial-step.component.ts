import { Component, Input } from '@angular/core';

import { InputConverter, booleanConverter } from '../shared/input-converter';

@Component({
  selector: 'stache-tutorial-step',
  templateUrl: './tutorial-step.component.html',
  styleUrls: ['./tutorial-step.component.scss'],
})
export class StacheTutorialStepComponent {
  @Input()
  @InputConverter(booleanConverter)
  public get showNumber(): boolean {
    return this.#_showNumber;
  }

  public set showNumber(value: boolean | undefined) {
    this.#_showNumber = value !== false;
  }

  #_showNumber = true;
}
