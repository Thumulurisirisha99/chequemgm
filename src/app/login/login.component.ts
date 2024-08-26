import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ServiceService } from '../service/service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';
  isPasswordVisible: boolean = false;
  token: string = '';
  name: string = '';
  username: string = '';
  role: string = '';
  images: string = '';
  constructor(private formBuilder: FormBuilder, private service: ServiceService, private route: Router, private storageService: StorageService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      const formData = new FormData();
      formData.append('username', this.loginForm.get('username')?.value);
      formData.append('password', this.loginForm.get('password')?.value);

      this.service.login(formData).subscribe(
        response => {
          if (response.statusCodeValue === 200) {
            console.log('Login successful!', response);
            const responseBody = response.body;
            this.token = responseBody.token;
            this.name = responseBody.name;
            this.username = responseBody.username;
            this.role = responseBody.role;
            this.storageService.setItem('token', this.token);
            this.storageService.setItem('name', this.name);
            this.storageService.setItem('username', this.username);
            this.storageService.setItem('role', this.role);
            console.log(this.token);
            console.log(this.name);
            this.route.navigate(['dashboard'])
          }
          else if (response.statusCodeValue === 400) {
            this.errorMessage = 'Invalid username/password';
          } else if (response.statusCodeValue === 404) {
            this.errorMessage = 'Please sign up';
          } else if (response.statusCodeValue === 500) {
            this.errorMessage = 'Internal server error.';
          }
        },
        (error: HttpErrorResponse) => {
          this.errorMessage = 'An unexpected error occurred. Please try again later.';
        }
      );
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
