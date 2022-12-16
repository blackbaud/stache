import { NgModule } from '@angular/core';

import { StacheTableOfContentsModule } from '../table-of-contents.module';

import { TableOfContentsTestComponent } from './toc-test.component';

@NgModule({
  declarations: [TableOfContentsTestComponent],
  imports: [StacheTableOfContentsModule],
})
export class TableOfContentsTestModule {}
