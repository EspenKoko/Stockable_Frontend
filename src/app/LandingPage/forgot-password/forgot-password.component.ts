import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  isLoading: boolean = false;
  emailSent: Boolean = false;
  resetForm: FormGroup;

  constructor(private service: AuthenticationService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private ATService: AuditTrailService) {
    this.resetForm = this.fb.group({
      email: [, [Validators.email]],
    });
  }

  sendResetPasswordLink(): void {
    if (this.resetForm.valid) {
      this.isLoading = true;
      this.service.forgetPassword(this.resetForm.value).subscribe({
        next: (result: any) => { },
        error: (response: HttpErrorResponse) => {
          this.isLoading = false;
          if (response.status == 200) {
            // save audit trail
            this.ATService.trackActivity(`Password reset link sent for ${this.resetForm.get('email')?.value}`);

            // this.resetForm.reset();
            this.emailSent = true;
            this.snackBar.open(`Password reset link has been sent`, 'X', { duration: 5000 });
          }
          else if (response.status == 400) {
            this.snackBar.open("User does not exist or email is incorrect", 'X', { duration: 5000 });
          }
          else {
            this.snackBar.open(`Request failed. please check internet or try again later`, 'X', { duration: 5000 });
          }
        }
      });
    }
    else {
      this.snackBar.open(`Request failed. please check email address`, 'X', { duration: 5000 });
    }
  }
}
