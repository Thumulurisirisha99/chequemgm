import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { CreatepasswordComponent } from './createpassword/createpassword.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JwtInterceptor } from 'src/JwtInterceptor';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { NavbarComponent } from './navbar/navbar.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ResetpasswordComponent,
    CreatepasswordComponent,
    DashboardComponent,
    FileUploadComponent,
    NavbarComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true } // Provide the interceptor
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
