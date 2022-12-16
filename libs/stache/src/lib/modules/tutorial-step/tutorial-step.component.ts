import { Component, Input } from '@angular/core';

@Component({
  selector: 'stache-tutorial-step',
  templateUrl: './tutorial-step.component.html',
  styleUrls: ['./tutorial-step.component.scss'],
})
export class StacheTutorialStepComponent {
  @Input()
  public set showNumber(value: boolean | undefined) {
    this.#_showNumber = value !== false;
  }

  public get showNumber(): boolean {
    return this.#_showNumber;
  }

  #_showNumber = true;
}
