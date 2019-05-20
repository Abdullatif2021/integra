import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FontAwesomeModule,
    NgSelectModule
  ],
  declarations: [SearchBoxComponent, PaginationComponent],
  exports: [
      SearchBoxComponent,
      PaginationComponent
  ]
})
export class SharedModule {

    constructor(){
        library.add(faSearch);
    }

}
