import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {faCheck, faChevronRight, faChevronUp, faMinus, faSearch} from '@fortawesome/free-solid-svg-icons';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TableComponent } from './components/table/table.component';
import { SimpleTableComponent } from './components/simple-table/simple-table.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { RouterModule } from '@angular/router';
import { ModalDirective } from './directives/modal.directive';
import { LoadingComponent } from './components/loading/loading.component';
import { AddressInputComponent } from './components/address-input/address-input.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import {PlacesAutocompleteService} from './service/places.autocomplete.service';
import {PageDirective} from './directives/page.directive';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FontAwesomeModule,
    NgSelectModule,
    InfiniteScrollModule,
    RouterModule,
    GooglePlaceModule,

  ],
  declarations: [
      SearchBoxComponent,
      PaginationComponent,
      TableComponent,
      SimpleTableComponent,
      ModalDirective,
      PageDirective,
      LoadingComponent,
      AddressInputComponent
  ],
  exports: [
      SearchBoxComponent,
      PaginationComponent,
      TableComponent,
      SimpleTableComponent,
      ModalDirective,
      PageDirective,
      LoadingComponent,
      AddressInputComponent
  ],
  providers: [
      PlacesAutocompleteService
  ],
})
export class SharedModule {

    constructor() {
        library.add(faSearch);
        library.add(faChevronRight);
        library.add(faChevronUp);
        library.add(faCheck);
        library.add(faMinus);
    }

}
