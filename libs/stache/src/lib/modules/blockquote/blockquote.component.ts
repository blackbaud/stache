import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'stache-blockquote',
  templateUrl: './blockquote.component.html',
  styleUrls: ['./blockquote.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class StacheBlockquoteComponent implements OnInit {
  @Input()
  public author: string | undefined;

  @Input()
  public quoteSource: string | undefined;

  public ngOnInit(): void {
    if (this.quoteSource && !this.author) {
      this.author = 'Source';
    }
  }
}
