import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { dashboardRoutes } from './dashboard.routes';
// import { AuthGuardService } from '../auth/auth-guard.service';

import { DashboardComponent } from './dashboard.component';


const routes: Routes = [
  {
      path: '',
      component: DashboardComponent,
      children: dashboardRoutes,
      // canActivate: [AuthGuardService]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class DashboardRoutingModule { }
