import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ClientUserService } from 'src/app/services/client-user.service';
import { ClientUser } from 'src/app/models/clientUsers';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { User } from 'src/app/models/users';

@Component({
  selector: 'app-view-client-user',
  templateUrl: './view-client-user.component.html',
  styleUrls: ['./view-client-user.component.scss']
})
export class ViewClientUserComponent {
  title = "Client User";

  data: any[] = [];
  searchTerm!: string;
  searchError!: string;

  constructor(private clientUserService: ClientUserService,
    public service: AuthenticationService,
    private router: Router,
    private snackBar: MatSnackBar,
    private ATService:AuditTrailService) {
    this.GetUsers();
  }

  GetUsers() {
    this.service.getAllUsers().subscribe((result: any[]) => {
      // stores client data in an array for displaying
      // Filter the result to include only users with userType "Client_User"
      // Add the confirmButton property to each data object
      this.data = result.filter(item => item.userType === "Client_User").map(item => ({ ...item, confirmButton: false }));

      this.data.forEach((user: any) => {
        this.clientUserService.getClientUsers().subscribe((result: ClientUser[]) => {

          // Retrieve the clientUser with the same user ID as the current user
          const clientUserData = result.filter(clu => clu.userId === user.id);
          let clientUser: ClientUser = clientUserData[0]

          //set clientuser in Client user table
          user.clientUser = clientUser
        })
      })
    })
  }

  GetUser() {
    if (this.searchTerm.length !== 0 || this.searchTerm !== "") {
      this.service.getAllUsers().subscribe((result: any[]) => {
        // Filter the result to include only searched users with userType "Client_User"
        let user = result.filter(item => item.userType === "Client_User");
        this.data = user.filter(x => x.userFirstName.toLowerCase().includes(this.searchTerm.toLowerCase()) || x.userLastName.toLowerCase().includes(this.searchTerm.toLowerCase())).map(item => ({ ...item, confirmButton: false }))

        this.data.forEach((user: any) => {
          this.clientUserService.getClientUsers().subscribe((result: ClientUser[]) => {

            // Retrieve the clientUser with the same user ID as the current user
            const clientUserData = result.filter(clu => clu.userId === user.id);
            let clientUser: ClientUser = clientUserData[0];

            //set clientuser in Client user table
            user.clientUser = clientUser;
          })
        })
      })
    }
    else {
      this.GetUsers();
    }
  }

  //toggles the confirm and delete button on click to confirm deletion
  toggleConfirmButton(index: number, id: string) {

    //if the button property is set to false it will be a delete button and if true a confirm button.
    // when a confirm button and clicked again it will delete the table row
    if (this.data[index].confirmButton) {
      this.Delete(id)
    }
    else {
      this.data[index].confirmButton = !this.data[index].confirmButton;
    }
  }

  // confirmingDelete: boolean = false;
  // // toggles the confirm and delete button on click to confirm deletion
  // toggleConfirmButton(index?: number, id?: string) {
  //   if (index && id) {
  //     // this.confirmingDelete = true;

  //     //if the button property is set to false it will be a delete button and if true a confirm button.
  //     // when a confirm button and clicked again it will delete the table row
  //     if (this.data[index].confirmButton) {
  //       this.Delete(id)
  //     }
  //     else {
  //       this.data[index].confirmButton = !this.data[index].confirmButton;
  //     }
  //   }
  // }

  // @HostListener('document:click', ['$event'])
  // resetDeleteButtons(event: Event) {
  //   let newData = this.data
  //   this.data
  //   console.log(this.confirmingDelete)
  //   if (this.confirmingDelete) {
  //     newData.forEach(element => {
  //       if (element.confirmButton == true) {
  //         console.log("nice")
  //         element.confirmButton = false;
  //       }
  //       this.data = newData;
  //       this.confirmingDelete = false;
  //     })
  //   }
  // }

  Delete(id: string) {
    this.service.deleteUser(id).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          // save audit trail
          const clientUser: User = this.data.find(item => item.id == id);
          this.ATService.trackActivity(`Deleted client user: + ${clientUser.id}`);

          this.data = this.data.filter(item => item.id !== id);
          this.snackBar.open("Delete Successful", 'X', { duration: 5000 });
        }
        else if (response.status == 500) {
          this.snackBar.open("Client is currently associated with funtionality on the system", 'X', { duration: 5000 });
        }
        else {
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
    return this.router.navigate(['/user-account-management'])
  }
}
