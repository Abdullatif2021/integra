import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './modules/home/home.module';
import {LoadingBarHttpClientModule} from '@ngx-loading-bar/http-client';
import {SettingsModule} from './modules/settings/settings.module';

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
    LoadingBarHttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
