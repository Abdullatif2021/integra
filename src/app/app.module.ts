import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import {LoadingBarHttpClientModule} from '@ngx-loading-bar/http-client';
import {SnotifyModule, SnotifyService, ToastDefaults} from 'ng-snotify';
import {IntegraaPreloadingStrategy} from './core/strategy/integraa-preloading.strategy';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    CoreModule,
    SharedModule,
    LoadingBarHttpClientModule,
    SnotifyModule,
  ],
  providers: [
      { provide: 'SnotifyToastConfig', useValue: ToastDefaults},
      SnotifyService,
      IntegraaPreloadingStrategy
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
