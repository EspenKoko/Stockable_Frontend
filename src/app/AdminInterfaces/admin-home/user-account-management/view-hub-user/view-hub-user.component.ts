import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HubUserService } from 'src/app/services/hub-user.service';
import { HubUser } from 'src/app/models/hubUsers';

@Component({
  selector: 'app-view-Hub-user',
  templateUrl: './view-Hub-user.component.html',
  styleUrls: ['./view-Hub-user.component.scss']
})
export class ViewHubUserComponent {

  title = "Hub User";

  data: any[] = [];
  searchTerm!: string;
  searchError!: string;

  constructor(private service: HubUserService, private router: Router, private snackBar: MatSnackBar) {
    this.GetHubUsers();
  }

  GetHubUsers() {
    this.service.getHubUsers().subscribe((result: any[]) => {
      // stores Hub data in an array for displaying
      // Add the confirmButton property to each data object
      this.data = result.map(item => ({ ...item, confirmButton: false }));
    })
  }

  GetHubUser() {
    if (this.searchTerm.length !== 0 || this.searchTerm !== "") {
      this.service.getHubUserByName(this.searchTerm).subscribe((result: any[]) => {
        this.data = result;
      });
    }
    else {
      this.GetHubUsers();
    }
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

  Delete(id: Number) {
    this.service.deleteHubUser(id).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          this.data = this.data.filter(item => item.hubUserId !== id);
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
    return this.router.navigate(['/user-account-management'])
  }
}
