import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
// import 'hammerjs'; // for md-slide-toggle, md-slider, mdTooltip // TODO remove or add
import { MomentModule } from 'angular2-moment';
import * as moment from 'moment';
import 'moment/min/locales';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import 'chart.js/src/chart';
import { NgIdleModule } from '@ng-idle/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { routing } from './app.routing';
import { EuroComponent, NavComponent, EuroInputComponent, IdleRedirectorComponent, NameInputComponent, FocusDirective } from './shared';
import { AppComponent } from './app';
import { PageNotFoundComponent } from './page-not-found';
import { UsersComponent, UserCreateDialogComponent } from './users';
import { UserComponent, UserRemoveDialogComponent, UserEditDialogComponent } from './user';
import { TransactionsComponent } from './transactions';
import { MetricsComponent } from './metrics';
import { ApiService } from './api.service';
import { ConfigComponent, ProductConfigComponent, ChargeConfigComponent, GeneralConfigComponent } from './config';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    UsersComponent,
    UserComponent,
    UserRemoveDialogComponent,
    UserEditDialogComponent,
    TransactionsComponent,
    MetricsComponent,
    EuroComponent,
    ConfigComponent,
    EuroComponent,
    ProductConfigComponent,
    ChargeConfigComponent,
    NavComponent,
    UserRemoveDialogComponent,
    UserEditDialogComponent,
    UserCreateDialogComponent,
    EuroInputComponent,
    IdleRedirectorComponent,
    NameInputComponent,
    GeneralConfigComponent,
    FocusDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    HttpModule,
    MaterialModule.forRoot(),
    MomentModule,
    ChartsModule,
    NgIdleModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [
    ApiService,
    //{ provide: APP_INITIALIZER, useFactory: (apiService: ApiService) => () => apiService.loadConfig(), deps: [ApiService], multi: true }
  ],
  entryComponents: [
    UserRemoveDialogComponent,
    UserEditDialogComponent,
    UserCreateDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    moment.locale('de-de');
  }
}
