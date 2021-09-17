import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PanelComponent } from './components/panel/panel.component';
import { UserComponent } from './components/user/user.component';
import { PageNotFoundComponent } from './components/error/page-not-found/page-not-found.component';
import { AccountModule } from './components/account/account.module';
import { AuthenticationGuard } from './authentication.guard';
import { AuthenticatedGuard } from './authenticated.guard';
import { LogRegisterComponent } from './components/log-register/log-register.component';

const routes: Routes = [ 
  {
    path: 'account',
    canActivate: [AuthenticatedGuard],
    loadChildren: () => import('./components/account/account.module').then(m => m.AccountModule),
  },
  { path: 'panel', component: PanelComponent, canActivate: [AuthenticationGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'user', component: UserComponent },
      { path: 'log-register', component: LogRegisterComponent}
    ]
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), AccountModule],
  exports: [RouterModule]
} )
export class AppRoutingModule { }