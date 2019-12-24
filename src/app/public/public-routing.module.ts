import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { DocsComponent } from './docs/docs.component';
import { PublicComponent } from './public.component';
import { InactiveComponent } from './inactive/inactive.component';
import { AuthResolver } from '../shared/guards/auth.resolver';

const routes: Routes = [
  {
    path: '',
    component: PublicComponent,
    children: [
      {
        path: '', component: HomeComponent,
        resolve: [AuthResolver]
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