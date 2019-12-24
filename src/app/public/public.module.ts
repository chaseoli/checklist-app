import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { HomeComponent } from './home/home.component';
import { DocsComponent } from './docs/docs.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PublicComponent } from './public.component';
import { CustomCarbonModule } from '../shared/custom-carbon-angular.module';
import { InactiveComponent } from './inactive/inactive.component';

@NgModule({
  declarations: [
    PublicComponent,
    HomeComponent, 
    DocsComponent, 
    NotFoundComponent, 
    InactiveComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    CustomCarbonModule
  ]
})
export class PublicModule { }
