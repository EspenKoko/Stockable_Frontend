import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ClientUserService } from 'src/app/services/client-user.service';
import { ClientService } from 'src/app/services/client.service';
import { ClientUser } from 'src/app/models/clientUsers';
import { Client } from 'src/app/models/clients';
import { User } from 'src/app/models/users';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Branch } from 'src/app/models/branches';
import { BranchService } from 'src/app/services/branch.service';
import { CustomValidators } from 'src/app/resources/custom-validators';
import { MailService } from 'src/app/services/mail-sender.service';
import { MailData } from 'src/app/models/MailData';
import { AuditTrailService } from 'src/app/services/audit-trail.service';

@Component({
  selector: 'app-create-client-user',
  templateUrl: './create-client-user.component.html',
  styleUrls: ['./create-client-user.component.scss']
})
export class CreateClientUserComponent implements OnInit {
  title = "Client User";

  clientData: Client[] = [];
  branchData: Branch[] = [];
  branchDataCheck: Branch[] = [];
  filtered: boolean = false;

  registerForm: FormGroup;
  clientUserForm: FormGroup;
  parentForm: FormGroup;

  constructor(private clientUserService: ClientUserService,
    private branchService: BranchService,
    private router: Router,
    private clientService: ClientService,
    private snackBar: MatSnackBar,
    public service: AuthenticationService,
    private mailService: MailService,
    private fb: FormBuilder,
    private ATService: AuditTrailService) {

    this.registerForm = this.fb.group({
      emailaddress: ['', [Validators.required, Validators.email]],
      userFirstName: ['', [Validators.required, CustomValidators.checkSpecialCharacters]],
      userLastName: ['', [Validators.required, CustomValidators.checkSpecialCharacters]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^0[0-9]{9}$/)]],
      //type will be predetermind
      userType: ['Client_User', Validators.required],
      password: [this.service.generatePassword(), Validators.required],
      role: ['', Validators.required],
      // profilePicture: [null],
    });

    this.clientUserForm = this.fb.group({
      clientUserPosition: ['', [Validators.required]],
      clientId: [0, Validators.required],
      branchId: [0, Validators.required],
      userId: ['']
    });

    this.parentForm = this.fb.group({
      registerForm: this.registerForm,
      clientUserForm: this.clientUserForm
    })
  }

  ngOnInit(): void {
    this.GetClients();
    this.GetBranches();
  }

  GetClients() {
    this.clientService.getClients().subscribe((result: Client[]) => {
      this.clientData = result;
    })
  }

  GetBranches() {
    this.branchService.getBranches().subscribe((result: Branch[]) => {
      this.branchDataCheck = result;
    })
  }

  filterBranches() {
    let clientSelection = this.clientUserForm.get('clientId')?.value;

    this.branchService.getBranches().subscribe((result: Branch[]) => {
      this.branchData = result.filter(x => x.clientId == clientSelection);
    })
  }

  register(): void {
    this.service.register(this.registerForm.value).subscribe({
      next: (result) => {
        // Assign the userId to the userId formControl in clientUserForm
        this.clientUserForm.get('userId')?.setValue(result.userId);
        this.Add();
      },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          console.log(response)
        }
        if (response.status == 400) {
          this.snackBar.open(`Error adding client user: ` + response.error, 'X', { duration: 5000 });
        }
        if (response.status == 404) {
          this.snackBar.open(`Error adding client user: ` + response.error, 'X', { duration: 5000 });
        }
        if (response.status == 409) {
          this.snackBar.open(`Error adding client user: ` + response.error, 'X', { duration: 5000 });
        }
        if (response.status == 501) {
          this.snackBar.open(`Error adding client user: ` + response.error, 'X', { duration: 5000 });
        }
      }
    })
  };

  Add() {
    let email: string = this.registerForm.get('emailaddress')?.value;

    this.clientUserService.addClientUser(this.clientUserForm.value).subscribe({
      next: (result) => { },
      error: (error: HttpErrorResponse) => {
        if (error.status === 200) {
          // save audit trail
          this.ATService.trackActivity(`Admin created client user, id: ${this.clientUserForm.get('userId')?.value}`);

          this.snackBar.open("Creation in progress, please wait", 'X', { duration: 10000 });

          const mail: MailData = {
            toEmailAddress: email,
            subject: "Stockable Registration notification",
            messageBody: `You have successfully been registered on the system. Your username is "${email}" and temporary password is "${this.registerForm.value.password}". Please save your password and note that it can be changed anytime from the acount screen under the change password tab.`
          }

          this.mailService.sendMail(mail).subscribe({
            next: (result: any) => { },
            error: (response: HttpErrorResponse) => {
              if (response.status == 200) {
                this.back().then((navigated: boolean) => {
                  if (navigated) {
                    this.snackBar.open(`Client user ${this.registerForm.value.emailaddress} successfully created and notified. User's password: ${this.registerForm.value.password}`, 'X', { duration: 99999999 });
                  }
                })
              }
              else {
                this.Delete(this.clientUserForm.get('userId')?.value);
                this.snackBar.open(response.error, 'X', { duration: 99999999 });
              }
            }
          })
        }
        if (error.status == 400 || error.status == 404 || error.status == 500) {
          this.snackBar.open(error.error, 'X', { duration: 5000 });
        }
      }
    });
  }

  Delete(id: string) {
    this.service.deleteUser(id).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          console.log(response);
        }
        else {
          this.snackBar.open(response.error, 'X', { duration: 5000 });
        }
      }
    });
  }

  back() {
    return this.router.navigate(['/view-client-user'])
  }
}