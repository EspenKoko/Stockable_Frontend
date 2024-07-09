import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { AppComponent } from '../../app.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { MailData } from 'src/app/models/MailData';
import { MailService } from 'src/app/services/mail-sender.service';
import { SHA256, enc } from 'crypto-js';
import { AuditTrailService } from 'src/app/services/audit-trail.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  isChecked!: boolean;
  emailSent: boolean = false;
  isLoading: boolean = false;
  twoFactorTimestamp: number = 0;

  signUpText!: string;
  loginForm: FormGroup;
  registerForm: FormGroup;
  twoFactorForm: FormGroup;
  twoFactorCode: string = '';
  email: string = '';
  actionType: string = '';
  dashboardURL: string = '';

  constructor(private router: Router,
    public service: AuthenticationService,
    private appComponent: AppComponent,
    private mailService: MailService,
    private ATService: AuditTrailService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar) {
    this.loginForm = this.fb.group({
      emailaddress: ['', Validators.email],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      emailaddress: ['', Validators.email],
      password: ['', Validators.required],
      role: ['SUPER_ADMIN', Validators.required]
    });

    this.twoFactorForm = this.fb.group({
      number1: [, [Validators.required, Validators.min(0), Validators.max(9)]],
      number2: [, [Validators.required, Validators.min(0), Validators.max(9)]],
      number3: [, [Validators.required, Validators.min(0), Validators.max(9)]],
      number4: [, [Validators.required, Validators.min(0), Validators.max(9)]],
      number5: [, [Validators.required, Validators.min(0), Validators.max(9)]],
    });

    //check if an email has already been saved from login to keep user on the enter two factor screen
    // if (localStorage.getItem("loginEmail")) {
    //   this.email = JSON.parse(localStorage.getItem("loginEmail")!)
    //   this.emailSent = true;
    // }

    //check if value is true or false for More Info menu expansion
    const storedValue = localStorage.getItem('checkboxState');
    if (storedValue) {
      this.isChecked = JSON.parse(storedValue);
    }
  }

  hashAndStoreCode() {
    // Hash the two-factor code using SHA-256
    const hashedCode = SHA256(this.twoFactorCode).toString(enc.Hex);

    // Store the hashed code in local storage
    localStorage.setItem('twoFactorCode', hashedCode);

    // Optionally, you can clear the original two-factor code from memory
    this.twoFactorCode = '';
  }

  sendMail() {
    //if the resend button is click it will check of the email has already been set and get the email from the localstorage
    // if (this.emailSent == false) {
    this.email = this.loginForm.get('emailaddress')?.value;
    //   localStorage.setItem("loginEmail", JSON.stringify(this.loginForm.get('emailaddress')?.value))
    // }

    //create two factor code to send
    this.twoFactorCode = '';

    for (let index = 0; index < 5; index++) {
      this.twoFactorCode += Math.floor(Math.random() * 10).toString();
    }

    const mail: MailData = {
      toEmailAddress: this.email,
      subject: 'Stockable 2 factor authentication code',
      messageBody: `Your two factor authentication code is: ${this.twoFactorCode}. Code will expire in 10 minutes`
    }

    this.isLoading = true;
    this.mailService.sendMail(mail).subscribe({
      next: (result: any) => { },
      error: (response: HttpErrorResponse) => {
        this.isLoading = false;
        this.emailSent = true;
        // this.hashAndStoreCode(); // hash two factor code
        this.snackBar.open("Code has been sent. Please check your emails", 'X', { duration: 5000 });
        this.twoFactorAuthTimer();
        this.isLoading = false;
      },
    })
  }

  // starts the two factor auth process
  triggerTwoFactAuth() {
    if (this.loginForm.valid) {
      this.service.login(this.loginForm.value).subscribe({
        next: (result: any) => {
          let Token = result;
          
          //this.ATService.trackActivity("2 factor triggered");
          console.log("yes")
          if (Token != null) {
            this.sendMail();
          }
        },
        error: (response: HttpErrorResponse) => {
          console.log("no")
          // Handle error responses
          if (response.status === 404) {
            this.snackBar.open(response.error, 'X', { duration: 5000 });
          }
          else if (response.status === 403) {
            this.snackBar.open(response.error, 'X', { duration: 5000 });
          }
          else {
            this.snackBar.open("An error has occured please try again", 'X', { duration: 5000 });
          }
        }
      })
    }
    else {
      this.snackBar.open("Email or password is invalid, please try again", 'X', { duration: 5000 });
    }
  }

  //if waiting too long the code becomes invalid and user must send a new one
  twoFactorAuthTimer() {
    setInterval(() => {
      const currentTime = new Date().getTime();
      const elapsedTimeInSeconds = Math.round((currentTime - this.twoFactorTimestamp) / 1000);

      if (elapsedTimeInSeconds === 600) {
        // this.emailSent = false;
        this.twoFactorCode = "";
        // localStorage.removeItem("twoFactorCode"); // uncomment when using hashes
        this.snackBar.open(`Code entry period timed out`, 'X', { duration: 15000 });
      }
    }, 1000);
  }

  moveCursor(event: any, nextInputName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 1) {
      const nextInput = document.getElementsByName(nextInputName)[0] as HTMLInputElement;
      nextInput.focus();
    }
  }

  compareCodes(): boolean {
    //uncomment when using hashes
    // if (localStorage.getItem('twoFactorCode')) {
    //   this.twoFactorCode = localStorage.getItem('twoFactorCode')!;
    // }
    // else {
    //   localStorage.clear();
    //   window.location.reload();
    //   setTimeout(() => {
    //     this.snackBar.open(`An Error has occurred. please login again`, 'X', { duration: 10000 });
    //   }, 200);
    // }

    let number1 = this.twoFactorForm.get('number1')?.value.toString();
    let number2 = this.twoFactorForm.get('number2')?.value.toString();
    let number3 = this.twoFactorForm.get('number3')?.value.toString();
    let number4 = this.twoFactorForm.get('number4')?.value.toString();
    let number5 = this.twoFactorForm.get('number5')?.value.toString();

    let inputCode: string = number1 + number2 + number3 + number4 + number5;
    // const hashedInputCode = SHA256(inputCode).toString(enc.Hex);

    // if (this.twoFactorCode == hashedInputCode) {
    if (this.twoFactorCode == inputCode) {
      return true;
    }
    else {
      this.twoFactorForm.reset();
      return false;
    }
  }

  login() {
    //if code comparison checks out then login
    if (this.compareCodes() && this.twoFactorForm.valid) {
      this.service.login(this.loginForm.value).subscribe({
        next: (result: any) => {
          if (localStorage.getItem("Token")) {
            localStorage.removeItem("Token");
          }
          localStorage.setItem('Token', JSON.stringify(result));
          this.appComponent.lastInteractionTimestamp = new Date().getTime();
          this.ATService.trackActivity("Logged in");

          // Get the user roles from the result
          const userRoles: string[] = result.role;

          const username = result.firstName;

          // Check the user roles and redirect accordingly
          if (userRoles.includes('ADMIN')) {

            // Redirect to the admin dashboard
            this.router.navigate(['/admin-dashboard']).then((navigated: boolean) => {
              if (navigated) {
                this.dashboardURL = 'admin-dashboard';
                this.snackBar.open(`Welcome back ${username}`, 'X', { duration: 5000 });
              }
            });
          }
          else if (userRoles.includes('CLIENT_USER')) {

            // Redirect to the client user dashboard
            this.router.navigate(['/client-dashboard']).then((navigated: boolean) => {
              if (navigated) {
                this.snackBar.open(`Welcome back ${username}`, 'X', { duration: 5000 });
              }
            });
          }
          // else if (userRoles.includes('HUB_USER')) {

          //   // Redirect to the hub user dashboard
          //   this.router.navigate(['/hub-dashboard']).then((navigated: boolean) => {
          //     if (navigated) {
          //       this.snackBar.open(`Welcome back ${username}`, 'X', { duration: 5000 });
          //     }
          //   });
          // }
          else if (userRoles.includes('CLIENT_ADMIN')) {

            // Redirect to the client admin dashboard
            this.router.navigate(['/client-dashboard']).then((navigated: boolean) => {
              if (navigated) {
                this.dashboardURL = 'client-dashboard';
                this.snackBar.open(`Welcome back ${username}`, 'X', { duration: 5000 });
              }
            });
          }
          else if (userRoles.includes('TECHNICIAN')) {

            // Redirect to the client admin dashboard
            this.router.navigate(['/technician-dashboard']).then((navigated: boolean) => {
              if (navigated) {
                this.snackBar.open(`Welcome back ${username}`, 'X', { duration: 5000 });
              }
            });
          }
          else if (userRoles.includes('INVENTORY_CLERK')) {

            // Redirect to the client admin dashboard
            this.router.navigate(['/inventory-clerk-dashboard']).then((navigated: boolean) => {
              if (navigated) {
                this.snackBar.open(`Welcome back ${username}`, 'X', { duration: 5000 });
              }
            });
          }
          else if (userRoles.includes('SUPER_ADMIN')) {

            // Redirect to the master admin dashboard
            this.router.navigate(['/admin-dashboard']).then((navigated: boolean) => {
              if (navigated) {
                this.snackBar.open(`Super admin logged in. create new user to use certain funtionality`, 'X', { duration: 5000 });
              }
            });
          }
          this.checkBox();
        },
        error: (response: HttpErrorResponse) => {
          // Handle error responses
          if (response.status === 403 || response.status === 404 || response.status === 500) {
            this.snackBar.open(response.error, 'X', { duration: 5000 });
          }
          else {
            this.snackBar.open("Error logging in please try again", 'X', { duration: 5000 });
          }
        }
      });
    }
    else {
      this.snackBar.open("Code is incorrect. Please try again. Ensure all fields are entered", 'X', { duration: 5000 });
    }
  }

  moreInfoNav() {
    this.saveCheckboxState()
    this.router.navigate(['more-info']);
  }

  forgotPasswordNav() {
    this.saveCheckboxState()
    this.router.navigate(['forgot-password']);
  }

  //keeps the more info tab open when page is refreshed
  saveCheckboxState(): void {
    localStorage.setItem('checkboxState', JSON.stringify(this.isChecked));
  }

  //when login and more info tab is clicked prevents teh more info tab from showing up again
  checkBox() {
    localStorage.removeItem('checkboxState');
  }

  // navigate to the dashoard depending on whos logged in
  navigate() {
    let Token;

    if (localStorage.getItem("Token")) {
      Token = JSON.parse(localStorage.getItem("Token")!);
    }

    if (Token.role == "ADMIN" || Token.role == "SUPER_ADMIN") {
      this.dashboardURL = 'admin-dashboard';
    }
    else if (Token.role == "CLIENT_USER" || Token.role == "CLIENT_ADMIN") {
      this.dashboardURL = 'client-dashboard';
    }
    else if (Token.role == "TECHNICIAN") {
      this.dashboardURL = 'technician-dashboard';
    }
    else if (Token.role == "TECHNICIAN") {
      this.dashboardURL = 'inventory-clerk-dashboard';
    }
    else {
      this.dashboardURL = 'unauthorized';
    }

    return this.router.navigate([this.dashboardURL]);
  }

  //########################
  register() {
    if (this.registerForm.get('password')?.value == "Admin123!") {
      this.service.register(this.registerForm.value).subscribe({
        next: (result: any) => {
          console.log(result);
        },
        error: (error: HttpErrorResponse) => {
          if (error.error == 200 || error.error == 201) {
            this.router.navigate(['/admin-dashboard']).then((navigated: boolean) => {
              if (navigated) {
                this.snackBar.open(`Welcome to the ACS Dashboard`, 'X', { duration: 5000 });
              }
            })
          }
          else {
            this.snackBar.open(error.error, 'X', { duration: 5000 });
          }
        }
      })
    }
  }
}