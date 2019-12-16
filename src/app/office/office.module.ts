import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfficeRoutingModule } from './office-routing.module';
import { MainComponent } from './main/main.component';
import { InstitutionComponent } from './institution/institution.component';
import { OfficeComponent } from './office.component';
import { CustomCarbonModule } from '../shared/custom-carbon-angular.module';

@NgModule({
  declarations: [MainComponent, InstitutionComponent, OfficeComponent],
  imports: [
    CommonModule,
    OfficeRoutingModule,
    CustomCarbonModule
  ]
})
export class OfficeModule { }
