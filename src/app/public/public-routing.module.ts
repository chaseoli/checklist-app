import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './login/login.component';
import { DocsComponent } from './docs/docs.component';
import { PublicComponent } from './public.component';
import { InactiveComponent } from './inactive/inactive.component';
import { AuthResolver } from '../shared/guards/auth.resolver';
import { RegisterComponent } from './register/register.component';
import { PwResetComponent } from './pw-reset/pw-reset.component';
import { RecoverComponent } from './recover/recover.component';

const routes: Routes = [
  {
    path: '',
    component: PublicComponent,
    resolve: [AuthResolver],
    children: [
      {
        path: '',
        component: LoginComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'reset',
        component: PwResetComponent,
      },
      {
        path: 'recover',
        component: RecoverComponent,
      }
    ]
  },
  { path: 'inactive', component: InactiveComponent },
  { path: 'docs', component: DocsComponent },
  { path: '404', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }