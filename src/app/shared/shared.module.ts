import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faCaretLeft,
    faCaretRight,
    faCheck,
    faChevronRight,
    faChevronUp, faForward,
    faMinus, faPen,
    faSearch, faSortDown, faUpload
} from '@fortawesome/free-solid-svg-icons';
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
import {GoogleApiService} from './service/google.api.service';
import {PageDirective} from './directives/page.directive';
import {faBackward} from '@fortawesome/free-solid-svg-icons/faBackward';
import { IframeComponent } from './components/iframe/iframe.component';
import { PostmenCalendarComponent } from './components/postmen-calendar/postmen-calendar.component';
import {NgxFileDropModule} from 'ngx-file-drop';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import { CommentsComponent } from './components/comments/comments.component';
import {FormsModule} from '@angular/forms';
import {faDownload} from '@fortawesome/free-solid-svg-icons/faDownload';
import {GoogleScriptResolver} from './resolver/google-script.resolver';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FontAwesomeModule,
    NgSelectModule,
    InfiniteScrollModule,
    RouterModule,
    GooglePlaceModule,
    NgxFileDropModule,
    FormsModule
  ],
  declarations: [
      SearchBoxComponent,
      PaginationComponent,
      TableComponent,
      SimpleTableComponent,
      ModalDirective,
      PageDirective,
      LoadingComponent,
      AddressInputComponent,
      IframeComponent,
      PostmenCalendarComponent,
      CommentsComponent
  ],
  exports: [
      SearchBoxComponent,
      PaginationComponent,
      TableComponent,
      SimpleTableComponent,
      ModalDirective,
      PageDirective,
      LoadingComponent,
      AddressInputComponent,
      IframeComponent,
      PostmenCalendarComponent
  ],
  providers: [
      PlacesAutocompleteService,
      GoogleApiService,
      GoogleScriptResolver
  ],
})
export class SharedModule {

    constructor() {
        library.add(faSearch);
        library.add(faChevronRight);
        library.add(faChevronLeft);
        library.add(faChevronUp);
        library.add(faCheck);
        library.add(faMinus);
        library.add(faCaretLeft);
        library.add(faCaretRight);
        library.add(faBackward);
        library.add(faForward);
        library.add(faCaretRight);
        library.add(faSortDown);
        library.add(faPen);
        library.add(faUpload);
        library.add(faDownload);
    }

}
