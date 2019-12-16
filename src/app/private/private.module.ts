import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateRoutingModule } from './private-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TransferComponent } from './transfer/transfer.component';
import { PrivateComponent } from './private.component';
import { CustomCarbonModule } from '../shared/custom-carbon-angular.module';

@NgModule({
  declarations: [DashboardComponent, TransferComponent, PrivateComponent],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    CustomCarbonModule
  ]
})
export class PrivateModule { }
