import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/users';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomValidators } from '../resources/custom-validators';
import { AppComponent } from '../app.component';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { AuditTrailService } from '../services/audit-trail.service';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss']
})
export class UserAccountComponent {
  Name: String = "No Name";
  Image?: String;
  fileToUpload?: File;
  base64ImageData: string | null = null;
  Token: any;
  Role: string = "No Role";

  isInputDisabled = true;
  isLoading: boolean = false;
  updateForm: FormGroup;
  userData!: User;

  fileNameUploaded = '';
  formData = new FormData();

  constructor(public service: AuthenticationService,
    private appComponent: AppComponent,
    private navbarComponent: NavigationBarComponent,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private ATService: AuditTrailService) {
    //get username from localstorage
    this.Token = JSON.parse(localStorage.getItem("Token")!)

    // Create the updateForm and set the initial values
    this.updateForm = this.fb.group({
      userFirstName: [{ value: '', disabled: true }, [Validators.required, CustomValidators.checkForWhiteSpace()]],
      userLastName: [{ value: '', disabled: true }, [Validators.required, CustomValidators.checkForWhiteSpace()]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      phoneNumber: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^0[0-9]{9}$/)]],
      userType: [''],
      confirmPassword: [''],
      newPassword: [''],
      currentPassword: [''],
      role: [''],
      profilePicture: [null],
    });

    this.initializeUser();

    //get role from service and uncapitalise it
    let role1 = this.service.getUserRoles()[0]
    let role2 = role1;
    if (role1.includes('_')) {
      role2 = role1.split('_')[0] + " " + role1.split('_')[1];
      this.Role = role2.charAt(0).toUpperCase() + role2.slice(1).toLowerCase();
    }
    else {
      this.Role = role2.charAt(0).toUpperCase() + role2.slice(1).toLowerCase();
    }
  }

  ngOnInit() {
    this.GetUser()
  }

  initializeUser() {
    this.appComponent.showLoader = true;

    this.service.getUser(this.Token.id).subscribe({
      next: (result: User) => {
        this.Name = result.userFirstName;
        this.Image = result.profilePicture;
        this.appComponent.showLoader = false;
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      }
    });
  }

  GetUser() {
    //get logged in user data
    // this.appComponent.showLoader = true;
    this.service.getUser(this.Token.id).subscribe({
      next: (result) => {
        this.userData = result;
        // Set the initial values for the updateForm once userData is available
        this.updateForm.patchValue({
          userFirstName: this.userData?.userFirstName || '',
          userLastName: this.userData?.userLastName || '',
          email: this.userData?.email || '',
          userType: this.userData?.userType || '',
          role: this.userData?.role || '',
          phoneNumber: this.userData?.phoneNumber || '',
          // profilePicture: this.userData?.profilePicture || ''
        });
        // this.appComponent.showLoader = false;
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      }
    });
  }

  toggleUpdate() {
    this.isInputDisabled = !this.isInputDisabled;
    if (!this.isInputDisabled) {
      this.updateForm.enable();
    } else {
      this.updateForm.disable();
      this.GetUser()
    }
  }

  // for using the file selector in html
  openFileInput(event: Event) {
    event.preventDefault(); // Prevent default form submission behavior
    const fileInput = document.getElementById('file') as HTMLInputElement;
    fileInput.click(); // Trigger file input click event
  }

  uploadFile = (files: any) => {
    this.fileToUpload = <File>files[0];

    //for displaying image in modal
    const reader = new FileReader();
    reader.onload = () => {
      this.base64ImageData = reader.result as string; // Store the base64 data
    };
    reader.readAsDataURL(this.fileToUpload); // Read the file as base64

    // for sending image to api
    this.formData.append('profilePicture', this.fileToUpload, this.fileToUpload.name);

    //for display in html
    this.fileNameUploaded = this.fileToUpload.name
  }

  @ViewChild('file') fileInput!: ElementRef<HTMLInputElement>;

  clearChanges() {
    // Clear the file input value
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }

    // Clear other data
    this.clearData();
    this.fileNameUploaded = "";
    this.base64ImageData = null;
    this.fileToUpload = undefined;
  }

  changeProfilePicture() {
    // this.setData();

    //update profile photo
    this.appComponent.showLoader = true;
    this.service.updateUserAccount(this.Token.id, this.formData).subscribe({
      next: (result: any) => { },
      error: (response: HttpErrorResponse) => {
        this.appComponent.showLoader = false;
        if (response.status == 200) {
          // save audit trail
          this.ATService.trackActivity(`Profile picture updated for ${this.Token.user}`);

          this.clearChanges();
          this.initializeUser();
          this.navbarComponent.initializeUser()
          this.snackBar.open("Profile picture updated", 'X', { duration: 5000 })
        }
        else {
          this.snackBar.open("Failed to update profile picture, please try again later", 'X', { duration: 5000 })
        }
      }
    });
  }

  removeProfilePicture() {
    this.appComponent.showLoader = true;

    this.toggleUpdate()
    this.updateForm.get('profilePicture')?.setValue(null);

    this.service.removeProfilePicture(this.Token.id, this.updateForm.value).subscribe({
      next: (result: any) => { },
      error: (response: HttpErrorResponse) => {
        this.appComponent.showLoader = false;
        if (response.status == 200) {
          // save audit trail
          this.ATService.trackActivity(`Profile picture removed for ${this.Token.user}`);

          this.clearChanges();
          this.initializeUser();
          this.toggleUpdate()

          this.snackBar.open("Profile picture removed", 'X', { duration: 5000 })
        }
        else {
          this.snackBar.open("Failed to remove profile picture, please try again later", 'X', { duration: 5000 })
        }
      }
    });
  }

  updateUser() {
    //update all account details
    this.isLoading = true;
    this.service.updateUser(this.Token.id, this.updateForm.value).subscribe({
      next: (result) => { },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.GetUser()
        if (error.status === 200) {
          // save audit trail
          this.ATService.trackActivity(`Account updated for ${this.Token.user}`);

          // window.location.reload();
          this.initializeUser();
          this.navbarComponent.initializeUser();
          this.toggleUpdate();
          this.snackBar.open(`Account updated succesfully`, 'X', { duration: 5000 });
        }
        else if (error.status === 409) {
          this.snackBar.open("Email is already in use", 'X', { duration: 5000 });
        }
        else {
          console.log(error.error)
          this.snackBar.open(error.error, 'X', { duration: 5000 });
        }
      }
    })
  }

  // setData() {
  // this.formData.append('userFirstName', this.updateForm.get('userFirstName')!.value);
  // this.formData.append('userLastName', this.updateForm.get('userLastName')!.value);
  // this.formData.append('email', this.updateForm.get('email')!.value);
  // this.formData.append('phoneNumber', this.updateForm.get('phoneNumber')!.value);
  // this.formData.append('profilePicture', this.updateForm.get('profilePicture')!.value);
  // this.formData.append('userType', this.updateForm.get('userType')!.value);
  // this.formData.append('confirmPassword', this.updateForm.get('confirmPassword')!.value);
  // this.formData.append('newPassword', this.updateForm.get('newPassword')!.value);
  // }

  clearData() {
    this.formData.delete("userFirstName");
    this.formData.delete("userLastName");
    this.formData.delete("userType");
    this.formData.delete("email");
    this.formData.delete("phoneNumber");
    this.formData.delete("currentPassword");
    this.formData.delete("oldPassword");
    this.formData.delete("profilePicture");
  }
}


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.scss']
})

export class ChangePasswordComponent {
  Token: any;
  isLoading: boolean = false;

  updateForm: FormGroup;

  constructor(public service: AuthenticationService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private ATService: AuditTrailService) {
    this.updateForm = this.fb.group({
      userFirstName: [''],
      userLastName: [''],
      email: [''],
      phoneNumber: [''],
      userType: [''],
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!*()_-])[A-Za-z\d@#$%^&+=!*()_-]{8,}$/)]],
      confirmPassword: ['', Validators.required],
      role: [''],
      profilePicture: [null],
    }, {
      // Add custom validator to the form group
      // validator: CustomValidators.passwordMatchValidator
    });

    this.Token = JSON.parse(localStorage.getItem("Token")!)
  }

  updateUser() {
    let email = this.Token.user;
    this.isLoading = true;
    this.service.updateUser(email, this.updateForm.value).subscribe({
      next: (Result: any) => { },
      error: (response: HttpErrorResponse) => {
        this.isLoading = false;
        if (response.status === 200) {
          // save audit trail
          this.ATService.trackActivity(`Password updated for ${email}`);

          this.back().then((navigated: boolean) => {
            if (navigated) {
              this.snackBar.open(`Password changed succesfully`, 'X', { duration: 5000 });
            }
          })
        }
        else if (response.status === 400) { //confirmed password does not match new password
          this.snackBar.open(response.error.errors.confirmPassword, 'X', { duration: 5000 });
        }
        else if (response.status === 500) { //old password does not match db password
          this.snackBar.open(response.error, 'X', { duration: 5000 });
        }
        else {
          console.error(response)
          this.snackBar.open("Something went wrong. Please try again", 'X', { duration: 5000 });
        }
      }
    })
  }

  back() {
    return this.router.navigate(['account'])
  }
}