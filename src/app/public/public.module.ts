import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { HomeComponent } from './home/home.component';
import { DocsComponent } from './docs/docs.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PublicComponent } from './public.component';
import { CustomCarbonModule } from '../shared/custom-carbon-angular.module';
import { InactiveComponent } from './inactive/inactive.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { PwResetComponent } from './pw-reset/pw-reset.component';
import { RecoverComponent } from './recover/recover.component';

@NgModule({
  declarations: [
    PublicComponent,
    HomeComponent, 
    DocsComponent, 
    NotFoundComponent, 
    InactiveComponent, 
    RegisterComponent,
    LoginComponent,
    PwResetComponent,
    RecoverComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    CustomCarbonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PublicModule { }
