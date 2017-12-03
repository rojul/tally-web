import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatInputModule, MatListModule, MatOptionModule,
  MatProgressBarModule, MatSelectModule, MatSidenavModule, MatSnackBarModule, MatToolbarModule, } from '@angular/material';
import { MomentModule } from 'angular2-moment';
import * as moment from 'moment/moment.js';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import 'chart.js/src/chart';
import { NgIdleModule } from '@ng-idle/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { routing } from './app.routing';
import { EuroComponent, NavComponent, EuroInputComponent, IdleRedirectorComponent, NameInputComponent, FocusDirective } from './shared';
import { AppComponent } from './app';
import { PageNotFoundComponent } from './page-not-found';
import { UsersComponent, UserCreateDialogComponent } from './users';
import { UserComponent, UserRemoveDialogComponent, UserEditDialogComponent, UserFunFreeDialogComponent } from './user';
import { TransactionsComponent, TransactionDeleteDialogComponent } from './transactions';
import { MetricsComponent } from './metrics';
import { ConfigComponent, ProductConfigComponent, ChargeConfigComponent, GeneralConfigComponent } from './config';
import { ApiService } from './api.service';

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
    ProductConfigComponent,
    ChargeConfigComponent,
    NavComponent,
    UserCreateDialogComponent,
    EuroInputComponent,
    IdleRedirectorComponent,
    NameInputComponent,
    GeneralConfigComponent,
    FocusDirective,
    TransactionDeleteDialogComponent,
    UserFunFreeDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    HttpModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatOptionModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatToolbarModule,
    MomentModule,
    ChartsModule,
    NgIdleModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [
    ApiService
  ],
  entryComponents: [
    UserRemoveDialogComponent,
    UserEditDialogComponent,
    UserCreateDialogComponent,
    TransactionDeleteDialogComponent,
    UserFunFreeDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    moment.locale('de-de');
  }
}
