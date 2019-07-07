import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TableComponent } from './components/table/table.component';
import { SimpleTableComponent } from './components/simple-table/simple-table.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { RouterModule } from '@angular/router';
import { ModalDirective } from './directives/modal.directive';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FontAwesomeModule,
    NgSelectModule,
    InfiniteScrollModule,
    RouterModule,
  ],
  declarations: [
      SearchBoxComponent,
      PaginationComponent,
      TableComponent,
      SimpleTableComponent,
      ModalDirective
  ],
  exports: [
      SearchBoxComponent,
      PaginationComponent,
      TableComponent,
      SimpleTableComponent,
      ModalDirective
  ]
})
export class SharedModule {

    constructor() {
        library.add(faSearch);
    }

}
