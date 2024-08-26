import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../service/service.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-createpassword',
  templateUrl: './createpassword.component.html',
  styleUrls: ['./createpassword.component.css']
})
export class CreatepasswordComponent implements OnInit {
  createPasswordForm!: FormGroup;
  email: any;
  isPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private router: ActivatedRoute, private service: ServiceService, private route: Router) { }

  ngOnInit(): void {
    this.router.queryParams.subscribe(params => {
      this.email = params['email'];
    });

    this.createPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6)]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(formGroup: FormGroup): void {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirm_password')?.value;
    if (password !== confirmPassword) {
      formGroup.get('confirm_password')?.setErrors({ mismatch: true });
    } else {
      formGroup.get('confirm_password')?.setErrors(null);
    }
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }

  createPassword() {
    if (this.createPasswordForm.valid) {
      const formData = new FormData();
      formData.append('email', this.email);
      formData.append('newPassword', this.createPasswordForm.get('password')?.value);
      formData.append('confirmPassword', this.createPasswordForm.get('confirm_password')?.value);
      console.log(this.email);
      console.log(this.createPasswordForm.get('password')?.value);
      console.log(this.createPasswordForm.get('confirm_password')?.value);
      this.service.createPassword(formData).subscribe(
        (response: any) => {
          console.log('Password created successfully', response);
          if (response.statusCodeValue == 200) {
            this.route.navigate(['login'])
          }
          else if (response.statusCodeValue === 400) {
            this.errorMessage = 'New password and confirm password do not match';
          } else if (response.statusCodeValue === 500) {
            this.errorMessage = 'Internal server error.';
          }
        },
        (error: HttpErrorResponse) => {
          this.errorMessage = 'An unexpected error occurred. Please try again later.';
        }
      );
    }
  }
}
