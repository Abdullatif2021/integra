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

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    NgbCollapseModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    SharedModule,
    RouterModule
  ],
  declarations: [
      UserNavComponent,
      MainNavComponent,
      SearchPanelComponent,
  ],
  exports: [
    UserNavComponent,
    MainNavComponent,
    SearchPanelComponent
  ]
})
export class CoreModule {
    constructor() {
        library.add(faCogs);
        library.add(faBell);
        library.add(faChevronDown);
        library.add(faChevronUp);
    }
}
