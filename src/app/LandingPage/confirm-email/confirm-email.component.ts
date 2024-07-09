import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent {
  confirmForm: FormGroup;
  isLoading: Boolean = false;

  token!: string;
  userId!: string;

  constructor(private service: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private ATService: AuditTrailService) {
    this.confirmForm = this.fb.group({
      userId: [],
      token: [],
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
    console.log(this.userId, this.token)

  }
  confirmEmail() {
    this.confirmForm.get('userId')?.setValue(this.userId);
    this.confirmForm.get('token')?.setValue(this.token);

    this.isLoading = true;
    this.service.confirmEmail(this.confirmForm.value).subscribe({
      next: (result: any) => { },
      error: (response: HttpErrorResponse) => {
        // save audit trail
        this.ATService.trackActivity(`User Id ${this.confirmForm.get('userId')?.value} confirmed email`);

        this.isLoading = false;
        if (response.status == 200) {
          this.router.navigate(['sign-in']).then((navigated: boolean) => {
            if (navigated) {
              this.snackBar.open("Email has been confirmed", 'X', { duration: 5000 });
            }
          })
        }
        else if (response.status === 400) {
          this.snackBar.open(response.error, 'X', { duration: 5000 });
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