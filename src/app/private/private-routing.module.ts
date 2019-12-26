import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TransferComponent } from './transfer/transfer.component';
import { PrivateComponent } from './private.component';
import { AuthResolver } from '../shared/guards/auth.resolver';
import { AuthCanActivateGuard } from '../shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '', component: PrivateComponent,
    resolve: [AuthResolver],
    canActivate: [AuthCanActivateGuard],
    children: [
      { path: '', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'transfer', component: TransferComponent }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
