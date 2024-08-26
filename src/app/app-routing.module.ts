import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { CreatepasswordComponent } from './createpassword/createpassword.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './Admin/auth.guard';
import { AdminGuard } from './Admin/AdminGuard';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { NavbarComponent } from './navbar/navbar.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'reset', component: ResetpasswordComponent },
  { path: 'createpassword', component: CreatepasswordComponent },
  {
    path: '', component: NavbarComponent, children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'fileUpload', component: FileUploadComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
