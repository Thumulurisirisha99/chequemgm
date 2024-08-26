import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../service/service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {
  loginForm!: FormGroup;
  otpSent: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  constructor(private service: ServiceService, private formBuilder: FormBuilder, private route: Router) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      otp1: [''],
      otp2: [''],
      otp3: [''],
      otp4: [''],
      otp5: [''],
      otp6: ['']
    });
  }

  resetPassword(): void {
    if (this.loginForm.valid) {
      const formData = new FormData();
      formData.append('email', this.loginForm.get('email')?.value);

      this.service.resetpassword(formData).subscribe(
        (response: any) => {
          this.successMessage = 'OTP has been sent to your email.';
          this.otpSent = true;
          console.log(response);
        },
        (error: HttpErrorResponse) => {
          console.error(error);

          if (error.status === 404) {
            this.errorMessage = 'check your email ,you are not found at,please contact admin';
          }
          else if (error.status == 500) {
            this.errorMessage = 'internal server error';
          }
        }
      );
    }
  }

  verifyOtp(): void {
    if (this.loginForm.valid) {
      const otp = [
        this.loginForm.get('otp1')?.value,
        this.loginForm.get('otp2')?.value,
        this.loginForm.get('otp3')?.value,
        this.loginForm.get('otp4')?.value,
        this.loginForm.get('otp5')?.value,
        this.loginForm.get('otp6')?.value
      ].join('');

      const formData = new FormData();
      formData.append('email', this.loginForm.get('email')?.value);
      formData.append('otp', otp);

      this.service.verifyOtp(formData).subscribe(
        (response: any) => {
          if (response.statusCodeValue === 200) {
            this.successMessage = 'OTP verified successfully.';
            //this.route.navigate(['createpassword'])
            this.route.navigate(['/createpassword'], { queryParams: { email: this.loginForm.get('email')?.value } });
          }
          else if (response.statusCodeValue === 400)
            console.log(response);
          this.errorMessage = 'Invalid OTP. Please try again'
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          if (error.status === 404) {
            this.errorMessage = 'you are not registered at,please contact admin';
          }
          else if (error.status === 500) {
            this.errorMessage = 'Internal server error';
          }
        }
      );
    }
  }

  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 1 && index < 6) {
      const nextInput = document.querySelector(`input[formControlName="otp${index + 1}"]`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
    if (input.value.length === 0 && index > 1) {
      const prevInput = document.querySelector(`input[formControlName="otp${index - 1}"]`) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
  }
}
