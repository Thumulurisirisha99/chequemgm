import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ServiceService } from '../service/service.service';
import { StorageService } from '../storage.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentRoute: string = '';
  isAdmin: boolean = false;
  profileName: any;
  profileRole: any;
  profileDepartment: any;
  profileImage: any;
  selectedFile: File | null = null;
  passwordForm!: FormGroup;
  username: any;
  constructor(private router: Router, private service: ServiceService, private storageService: StorageService, private fb: FormBuilder) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });
  }

  ngOnInit(): void {
    this.displayProfile();
    this.isAdmin = this.service.isAdmins();
    this.passwordForm = this.fb.group({
      newPassword: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(15),
        Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$&]).{6,15}$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }
  isActive(route: string): boolean {
    return this.currentRoute === route;
  }
  displayProfile(): void {
    const username = this.storageService.getItem('username');
    if (username) {
      this.service.profile(username).subscribe(
        profileData => {
          this.profileName = profileData.name || 'Unknown';
          this.profileRole = profileData.role || 'Unknown';
          this.profileDepartment = profileData.department || 'Unknown';
          console.log("Profile data fetched:", profileData);
          this.service.image(username).subscribe(
            imageData => {
              console.log("Received imageData:", imageData);
              // if (imageData && imageData.body && imageData.body.image) {
              //   this.profileImage = this.getImageUrl(imageData.body.image);
              // } else {
              //   console.error("No image data received");
              //   this.profileImage = 'assets/default-profile-image.png';
              // }
              if (imageData && imageData.body && imageData.body.image) {
                this.profileImage = this.getImageUrl(imageData.body.image);
              } else {
                console.error("No image data received");
                this.profileImage = 'assets/assets/img/blank-profile-picture.jpg'; // Default image path
              }
            },
            error => {
              // if (error.status === 401) {
              //   console.warn("Unauthorized access, using default image");
              //   this.profileImage = 'assets/default-profile-image.png';
              // } else {
              //   console.error("Error retrieving image", error);
              //   this.profileImage = 'assets/default-profile-image.png';
              // }
              if (error.status === 401) {
                console.warn("Unauthorized access, using default image");
                this.profileImage = 'assets/assets/img/blank-profile-picture.jpg'; // Default image path
              } else {
                console.error("Error retrieving image", error);
                this.profileImage = 'assets/img/blank-profile-picture.jpg'; // Default image path
              }
            }
          );
        },
        error => {
          console.error('Error fetching profile data:', error);
        }
      );
    } else {
      console.error('Username not found in storage');
    }
  }

  getImageUrl(image: string): string {
    return image ? `data:image/jpeg;base64,${image}` : 'assets/default-profile-image.png';
  }
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  submitImage() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile);
      const username = this.storageService.getItem('username');
      this.service.uploadImage(formData, username).subscribe(response => {
        console.log('Image uploaded successfully:', response);
        this.displayProfile();
      }, error => {
        console.error('Error uploading image:', error);
      });
    } else {
      console.log('No file selected');
    }
  }

  logout(): void {
    this.storageService.clear();
    this.router.navigate(['/login']);
  }
  changePassword(): void {
    this.username = this.storageService.getItem('username');
    const formData = new FormData();
    formData.append('email', this.username);
    formData.append('newPassword', this.passwordForm.get('newPassword')?.value);
    formData.append('confirmPassword', this.passwordForm.get('confirmPassword')?.value);
    this.service.createPassword(formData).subscribe(
      response => {
        Swal.fire({
          title: 'Success!',
          text: 'Your Password Changed successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        this.passwordForm.reset();
        console.log('Password successfully changed', response);
      },
      error => {
        Swal.fire('Oops...', 'Internal server error!', 'error');
        console.error('Error changing password', error);
      }
    );
  }
  deleteImage() {
    const username = this.storageService.getItem('username');
    this.service.deleteImage(username).subscribe((res: any) => {
      Swal.fire({
        title: 'Success!',
        text: 'Your deleted profile Photo!',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    },
      error => {
        Swal.fire('Oops...', 'Internal server error!', 'error');
        console.error('Error changing password', error);
      }
    )
  }
}