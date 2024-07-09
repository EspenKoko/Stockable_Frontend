import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  isLoading: Boolean = false;

  token!: string;
  userId!: string;

  constructor(private service: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private ATService: AuditTrailService) {
    this.resetForm = this.fb.group({
      userId: [],
      token: [],
      newPassword: [, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!*()_-])[A-Za-z\d@#$%^&+=!*()_-]{8,}$/)]],
      confirmPassword: [, Validators.required],
    }, {
      // Add custom validator to the form group
      // validator: CustomValidators.passwordMatchValidator
    });
  }

  ngOnInit() {
    //using route parameters
    // this.userId = this.route.snapshot.params['userId'];
    // this.token = this.route.snapshot.params['token'];

    //using query parameters
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'];
      this.token = params['token'];
    });
  }

  resetPassword() {
    this.resetForm.get('userId')?.setValue(this.userId);
    this.resetForm.get('token')?.setValue(this.token);

    this.isLoading = true;
    this.service.resetPassword(this.resetForm.value).subscribe({
      next: (result: any) => { },
      error: (response: HttpErrorResponse) => {
        // save audit trail
        this.ATService.trackActivity(`Password reset for ${this.resetForm.get('email')?.value}`);

        this.isLoading = false;
        if (response.status == 200) {
          this.router.navigate(['sign-in']).then((navigated: boolean) => {
            if (navigated) {
              this.snackBar.open("Password has been reset. please login", 'X', { duration: 5000 });
            }
          })
        }
        else if (response.status === 400) { //confirmed password does not match new password
          this.snackBar.open(response.error.errors.confirmPassword, 'X', { duration: 5000 });
        }
        else if (response.status === 500) {
          this.snackBar.open(response.error, 'X', { duration: 5000 });
        }
        else {
          this.snackBar.open("Something went wrong. Please try again", 'X', { duration: 5000 });
        }
      },
    })
  }
}