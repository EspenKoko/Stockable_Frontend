import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientUserService } from 'src/app/services/client-user.service';
import { ClientService } from 'src/app/services/client.service';
import { ClientUser } from 'src/app/models/clientUsers';
import { Client } from 'src/app/models/clients';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/models/users';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Branch } from 'src/app/models/branches';
import { BranchService } from 'src/app/services/branch.service';
import { CustomValidators } from 'src/app/resources/custom-validators';
import { AuditTrailService } from 'src/app/services/audit-trail.service';

@Component({
  selector: 'app-update-client-user',
  templateUrl: './update-client-user.component.html',
  styleUrls: ['./update-client-user.component.scss']
})
export class UpdateClientUserComponent {
  title = "Client User";

  user: any;
  clientUser!: ClientUser;
  clientData: Client[] = [];
  branchData: Branch[] = [];
  branchDataCheck: Branch[] = [];

  editUserForm: FormGroup;
  editClientUserForm: FormGroup;
  parentEditForm: FormGroup;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
    private branchService: BranchService,
    private clientUserService: ClientUserService,
    private service: AuthenticationService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private ATService: AuditTrailService) {

    this.editUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      userFirstName: ['', [Validators.required, CustomValidators.checkSpecialCharacters]],
      userLastName: ['', [Validators.required, CustomValidators.checkSpecialCharacters]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^0[0-9]{9}$/)]],
      //type will be predetermind
      userType: ['Client_User', Validators.required],
      password: [''],
      role: ['', Validators.required],
      // profilePicture: [null],
    });

    this.editClientUserForm = this.fb.group({
      clientUserPosition: ['', [Validators.required]],
      clientId: [0, Validators.required],
      branchId: [0, Validators.required],
      userId: ['']
    });

    this.parentEditForm = this.fb.group({
      editUserForm: this.editUserForm,
      editClientUserForm: this.editClientUserForm
    })
  }

  ngOnInit(): void {
    this.GetClients();

    this.service.getUser(this.route.snapshot.params['id']).subscribe(result => {
      this.user = result;

      this.GetBranches();
      
      //link to clientUser based on userId
      this.clientUserService.getClientUsers().subscribe((result: any[]) => {
        this.clientUser = result.find(x => x.userId == this.user.id)

        this.editUserForm.patchValue({
          userFirstName: this.clientUser.user.userFirstName,
          userLastName: this.clientUser.user.userLastName,
          phoneNumber: this.clientUser.user.phoneNumber,
          email: this.clientUser.user.email,
          userType: this.clientUser.user.userType,
        });

        this.editClientUserForm.patchValue({
          clientUserPosition: this.clientUser.clientUserPosition,
          userId: this.clientUser.userId,
          clientId: this.clientUser.clientId,
          branchId: this.clientUser.branchId
        });
      })
    })
  }

  GetClients() {
    this.clientService.getClients().subscribe((result: any[]) => {
      this.clientData = result;
    })
  }

  GetBranches() {
    this.branchService.getBranches().subscribe((result: any[]) => {
      this.branchDataCheck = result;
      this.filterBranches();
    })
  }

  filterBranches() {
    let clientSelection = this.editClientUserForm.get('clientId')?.value;

    this.branchService.getBranches().subscribe((result: Branch[]) => {
      this.branchData = result.filter(x => x.clientId == clientSelection);
    })
  }

  updateUser() {
    this.service.updateUser(this.user.id, this.editUserForm.value).subscribe({
      next: (result) => { },
      error: (userResponse: HttpErrorResponse) => {
        if (userResponse.status == 200) {

          this.clientUserService.editClientUser(this.clientUser.clientUserId, this.editClientUserForm.value).subscribe({
            next: (result: any) => { },
            error: (clientUserResponse: HttpErrorResponse) => {
              if (clientUserResponse.status == 200) {
                // save audit trail
                this.ATService.trackActivity(`Admin updated client user, id: ${this.clientUser.user.id}`);

                this.back().then((navigated: boolean) => {
                  if (navigated) {
                    this.snackBar.open(`Client User Successfully Updated`, 'X', { duration: 5000 });
                  }
                })
              }
              else {
                this.snackBar.open("Failed to update part of the form", 'X', { duration: 5000 });
              }
            }
          })
        }
        else {
          this.snackBar.open("Failed to update user, check connection", 'X', { duration: 5000 });
        }
      }
    })
  }

  back() {
    return this.router.navigate(['/view-client-user'])
  }
}
