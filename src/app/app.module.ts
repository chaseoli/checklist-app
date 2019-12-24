import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { CustomCarbonModule } from './shared/custom-carbon-angular.module';
import { environment } from '../environments/environment';
import { AuthModule } from './shared/modules/auth.module';
import { WindowService } from './shared/services/window.service';
import { DocumentService } from './shared/services/document.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AppRoutingModule,
    HttpClientModule,
    CustomCarbonModule,
    AuthModule
  ],
  providers: [
    DocumentService,
    WindowService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
