import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ClientUserRequest } from 'src/app/models/clientUserRequests';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ClientUserRequestService } from 'src/app/services/client-user-request.service';
import { ClientUserService } from 'src/app/services/client-user.service';

@Component({
  selector: 'app-client-user-request',
  templateUrl: './client-user-request.component.html',
  styleUrls: ['./client-user-request.component.scss']
})
export class ClientUserRequestComponent {
  title = "Client User";

  data: any[] = [];
  searchTerm!: string;
  searchError!: string;

  registerForm: FormGroup;
  addForm: FormGroup;

  requestForm: FormGroup;

  constructor(private service: ClientUserRequestService,
    private clientUserService: ClientUserService,
    public authService: AuthenticationService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private ATService: AuditTrailService) {
    this.registerForm = this.fb.group({
      emailaddress: ['', [Validators.required, Validators.email]],
      userFirstName: ['', Validators.required],
      userLastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      //type will be predetermind
      userType: ['Client_User', Validators.required],
      password: [this.authService.generatePassword(), Validators.required],
      role: ['', Validators.required],
      // profilePicture: [null],
    });

    this.addForm = this.fb.group({
      clientUserPosition: ['', [Validators.required]],
      clientId: [0, Validators.required],
      branchId: [0, Validators.required],
      userId: ['', Validators.required]
    });

    this.requestForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      number: ['', Validators.required],
      email: ['', Validators.required],
      role: ['', Validators.required],
      branchId: [0, Validators.required],
      clientUserPosition: ['', Validators.required],
      userCreated: [false, Validators.required],
    })

    this.GetClientUserRequests();
  }

  GetClientUserRequests() {
    this.service.getClientUserRequests().subscribe((result: any[]) => {
      // stores client data in an array for displaying
      // Add the confirmButton property to each data object
      this.data = result.map(item => ({ ...item, confirmButton: false }));

      // Sort the data based on the userCreated attribute
      this.data.sort((a, b) => {
        // Sort false values before true values
        if (a.userCreated === b.userCreated) {
          return 0;
        } else if (a.userCreated === false) {
          return -1; // a comes before b
        } else {
          return 1; // b comes before a
        }
      });
    })
  }

  GetClientUserRequest() {
    if (this.searchTerm.length !== 0 || this.searchTerm !== "") {
      this.service.getClientUserRequestByName(this.searchTerm).subscribe((result: any[]) => {
        this.data = result;
      });
    }
    else {
      this.GetClientUserRequests();
    }
  }

  updateRequest(clientUser: ClientUserRequest) {
    this.requestForm.setValue({
      name: clientUser.name,
      surname: clientUser.surname,
      number: clientUser.number,
      email: clientUser.email,
      role: clientUser.role,
      branchId: clientUser.branch.branchId,
      clientUserPosition: clientUser.clientUserPosition,
      userCreated: true,
    });

    this.service.editClientUserRequest(clientUser.clientUserRequestId, this.requestForm.value).subscribe(result => { })
  }

  register(clientUser: ClientUserRequest): void {
    // Populate the registerForm with the data
    this.registerForm.patchValue({
      emailaddress: clientUser.email,
      userFirstName: clientUser.name,
      userLastName: clientUser.surname,
      phoneNumber: clientUser.number,
      userType: 'Client_User',
      password: this.authService.generatePassword(),
      role: clientUser.role,
    });

    this.authService.register(this.registerForm.value).subscribe({
      next: (result) => {

        // Populate the addForm with the data
        this.addForm.patchValue({
          clientUserPosition: clientUser.clientUserPosition,
          clientId: clientUser.branch.client.clientId,
          branchId: clientUser.branch.branchId,
          userId: result.userId, // Assign the userId to the userId formControl in addForm
        });

        this.Add(clientUser);
      },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          console.log(response, this.registerForm.value)
        }
        if (response.status == 400 || response.status == 404 || response.status == 500 || response.status == 501) {
          this.snackBar.open(`Error adding client user: ` + response.error, 'X', { duration: 5000 });
        }
        if (response.status == 409) {
          //delete request if the user already exists
          // this.Delete(clientUser.clientUserRequestId);
          this.snackBar.open(`Error adding client user: ` + response.error, 'X', { duration: 5000 });
        }
      }
    })
  };

  Add(clientUser: ClientUserRequest) {
    this.clientUserService.addClientUser(this.addForm.value).subscribe({
      next: (result) => { },
      error: (error: HttpErrorResponse) => {
        if (error.status === 200) {
          // save audit trail
          this.ATService.trackActivity(`Client user "${this.registerForm.get('emailaddress')?.value}" creation request approved`);

          // this.Delete(clientUser.clientUserRequestId)
          this.updateRequest(clientUser)

          this.back().then((navigated: boolean) => {
            if (navigated) {
              this.snackBar.open(`Client user ${this.registerForm.value.emailaddress} successfully created. Please save password ${this.registerForm.value.password}`, 'X', { duration: 99999999 });
            }
          })
        }
        if (error.status == 400 || error.status == 404 || error.status == 500) {
          this.snackBar.open(error.error, 'X', { duration: 5000 });
        }
      }
    });
  }

  //toggles the confirm and delete button on click to confirm deletion
  toggleConfirmButton(index: number, id: number) {

    //if the button property is set to false it will be a delete button and if true a confirm button.
    // when a confirm button and clicked again it will delete the table row
    if (this.data[index].confirmButton) {
      this.Delete(id)
    }
    else {
      this.data[index].confirmButton = !this.data[index].confirmButton;
    }
  }

  Delete(id: number) {
    this.service.deleteClientUserRequest(id).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          // save audit trail
          const clientUserRequest: ClientUserRequest = this.data.find(item => item.clientUserRequestId == id); // dont know if this work yet
          this.ATService.trackActivity(`Client user "${clientUserRequest.email}" creation request deleted`);

          this.data = this.data.filter(item => item.clientUserRequestId !== id); // doesnt work
          this.snackBar.open("Delete Successful", 'X', { duration: 5000 });
        }
        if (response.status == 400 || response.status == 404 || response.status == 500) {
          this.snackBar.open(response.error, 'X', { duration: 5000 });
        }
      }
    });
  }

  //table sorter
  currentSortColumn!: string; //used for getting selected column in table sorter
  isAscending: boolean = true; // arranges the column of the sorted table

  sortTable(column: string) {
    if (this.currentSortColumn === column) {
      this.isAscending = !this.isAscending;
    } else {
      this.currentSortColumn = column;
      this.isAscending = true;
    }

    if (this.isAscending) {
      this.data.sort((a, b) => (a[column] > b[column] ? 1 : -1));
    } else {
      this.data.sort((a, b) => (a[column] < b[column] ? 1 : -1));
    }
  }

  back() {
    return this.router.navigate(['/view-client-user'])
  }
}
