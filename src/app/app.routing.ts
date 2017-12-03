import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found';
import { UsersComponent } from './users';
import { UserComponent } from './user';
import { TransactionsComponent } from './transactions';
import { MetricsComponent } from './metrics';
import { ConfigComponent } from './config';

const appRoutes: Routes = [{
  path: '',
  component: UsersComponent,
  pathMatch: 'full'
}, {
  path: 'users/:userId',
  component: UserComponent,
  pathMatch: 'full'
}, {
  path: 'users/:userId/transactions',
  component: TransactionsComponent,
  pathMatch: 'full'
}, {
  path: 'metrics',
  component: MetricsComponent,
  pathMatch: 'full'
}, {
  path: 'config',
  component: ConfigComponent,
  pathMatch: 'full'
}, {
  path: '**',
  component: PageNotFoundComponent
}];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
