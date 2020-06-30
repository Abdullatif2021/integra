import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserNavComponent } from './components/user-nav/user-nav.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCogs, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { SearchPanelComponent } from './components/search-panel/search-panel.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
import {faExpand} from '@fortawesome/free-solid-svg-icons/faExpand';
import {faArrowsAltH} from '@fortawesome/free-solid-svg-icons/faArrowsAltH';
import {faCompress} from '@fortawesome/free-solid-svg-icons/faCompress';
import {faWindowMaximize} from '@fortawesome/free-solid-svg-icons/faWindowMaximize';
import {faWindowMinimize} from '@fortawesome/free-solid-svg-icons/faWindowMinimize';
import {faExternalLinkAlt} from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';
import {IntegraaModalComponent} from './components/integraa-modal/integraa-modal.component';
import {AngularDraggableModule} from 'angular2-draggable';
import { GlobalModalsComponent } from './components/global-modals/global-modals.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    NgbCollapseModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    SharedModule,
    RouterModule,
    AngularDraggableModule,
    AutocompleteLibModule
  ],
  declarations: [
      UserNavComponent,
      MainNavComponent,
      SearchPanelComponent,
      IntegraaModalComponent,
      GlobalModalsComponent
  ],
  exports: [
    UserNavComponent,
    MainNavComponent,
    SearchPanelComponent,
    IntegraaModalComponent,
    GlobalModalsComponent
  ],
})
export class CoreModule {
    constructor() {
        library.add(faCogs);
        library.add(faBell);
        library.add(faChevronDown);
        library.add(faChevronUp);
        library.add(faExpand);
        library.add(faCompress);
        library.add(faWindowMinimize);
        library.add(faWindowMaximize);
        library.add(faArrowsAltH);
        library.add(faExternalLinkAlt);
        library.add(faTimes);
    }
}
