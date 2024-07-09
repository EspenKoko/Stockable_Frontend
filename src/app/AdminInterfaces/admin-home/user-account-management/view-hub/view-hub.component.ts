import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { HubService } from 'src/app/services/hub.service';
import { Hub } from 'src/app/models/hubs';

@Component({
  selector: 'app-view-hub',
  templateUrl: './view-hub.component.html',
  styleUrls: ['./view-hub.component.scss']
})
export class ViewHubComponent {
  title = "Hub";
  searchError!: string
  data: any[] = [];
  searchTerm!: string;

  constructor(private service: HubService, private router: Router, private route: ActivatedRoute, private snackBar: MatSnackBar) {
    this.GetHubs();
  }

  GetHubs() {
    this.service.getHubs().subscribe((result: any[]) => {
      // stores hub data in an array for displaying
      // Add the confirmButton property to each data object
      this.data = result.map(item => ({ ...item, confirmButton: false }));
    })
  }

  GetHub() {
    if (this.searchTerm.length !== 0 || this.searchTerm !== "") {
      this.service.getHubByName(this.searchTerm).subscribe((result: any[]) => {
        this.data = result;
      });
    }
    else {
      this.GetHubs();
    }
    //}
    // else{
    //   this.searchError = "Please enter search criteria";
    //   this.GetHubs();
    // }

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
    this.service.deleteHub(id).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
             if (response.status == 200) {
          this.data = this.data.filter(item => item.hubId !== id);
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
