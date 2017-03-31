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
  component: UsersComponent
}, {
  path: 'users/:userId',
  component: UserComponent
}, {
  path: 'users/:userId/transactions',
  component: TransactionsComponent
}, {
  path: 'metrics',
  component: MetricsComponent
}, {
  path: 'config',
  component: ConfigComponent
}, {
  path: '**',
  component: PageNotFoundComponent
}];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
