import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { InstitutionComponent } from './institution/institution.component';
import { OfficeComponent } from './office.component';

const routes: Routes = [
  {
    path: '', component: OfficeComponent,
    children: [
      { path: '', redirectTo: 'main' },
      { path: 'main', component: MainComponent },
      { path: 'accounts', redirectTo: 'institution' },
      { path: 'institution', component: InstitutionComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfficeRoutingModule { }
