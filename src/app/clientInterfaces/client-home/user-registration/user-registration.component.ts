import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from 'src/app/services/client.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientUserRequestService } from 'src/app/services/client-user-request.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { BranchService } from 'src/app/services/branch.service';
import { CustomValidators } from 'src/app/resources/custom-validators';
import { AuditTrailService } from 'src/app/services/audit-trail.service';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss']
})
export class UserRegistrationComponent implements OnInit {
  title = "User"
  data: any[] = [];
  clientData: any[] = [];
  branchData: any[] = [];

  addForm: FormGroup;

  constructor(private service: ClientUserRequestService,
    private clientService: ClientService,
    private branchService: BranchService,
    private ATService: AuditTrailService,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar) {
    this.addForm = this.fb.group({
      name: ['', [Validators.required, CustomValidators.checkSpecialCharacters]],
      surname: ['', [Validators.required, CustomValidators.checkSpecialCharacters]],
      email: ['', [Validators.required, Validators.email]],
      number: ['', [Validators.required, Validators.pattern(/^0[0-9]{9}$/)]],
      // userType: ['Client_User', Validators.required],
      role: ['', Validators.required],
      clientUserPosition: ['', [Validators.required]],
      branchId: [0, Validators.required],
      userCreated: [false, Validators.required],
    })
  }

  ngOnInit(): void {
    this.GetClients();
    this.GetBranches();
  }

  GetClients() {
    this.clientService.getClients().subscribe((result: any[]) => {
      this.clientData = result;
    })
  }

  GetBranches() {
    this.branchService.getBranches().subscribe((result: any[]) => {
      this.branchData = result;
    })
  }

  Add() {
    this.service.addClientUserRequest(this.addForm.value).subscribe({
      next: (result: any) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          // save audit trail
          this.ATService.trackActivity(`New client user requested: ${this.addForm.get("email")?.value}`);

          this.back().then((navigated: boolean) => {
            if (navigated) {
              this.snackBar.open(`Request Sent`, 'X', { duration: 5000 });
            }
          })
        }
        else {
          this.snackBar.open(`Error occured: ` + response.error, 'X', { duration: 5000 });
        }
      }
    });
  }

  back() {
    return this.router.navigate(['/client-dashboard']);
  }
}
