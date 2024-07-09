import { Component } from '@angular/core';

import { ClientService } from 'src/app/services/client.service';
import { Client } from 'src/app/models/clients';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { AuditTrailService } from 'src/app/services/audit-trail.service';

@Component({
  selector: 'app-view-client',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.scss']
})
export class ViewClientComponent {
  title = "Client";

  data: any[] = [];

  searchTerm!: string;
  searchError!: string

  constructor(private service: ClientService,
    private router: Router,
    private appComponent: AppComponent,
    private snackBar: MatSnackBar,
    private ATService: AuditTrailService) {
    this.GetClients();
  }

  GetClients() {
    //start loading screen and timer
    this.appComponent.showLoader = true;

    this.service.getClients().subscribe((result: any[]) => {
      // stores client data in an array for displaying
      // Add the confirmButton property to each data object
      this.data = result.map(item => ({ ...item, confirmButton: false }));
      this.appComponent.showLoader = false;
    })
  }

  GetClient() {
    if (this.searchTerm.length !== 0 || this.searchTerm !== "") {
      this.service.getClientByName(this.searchTerm).subscribe((result: any[]) => {
        this.data = result;
      });
    }
    else {
      this.GetClients();
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
    // this.appComponent.showLoader = true;
    this.service.deleteClient(id).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          // save audit trail
          const client: Client = this.data.find(item => item.clientId == id);
          this.ATService.trackActivity("Deleted client: " + client.clientName);

          this.data = this.data.filter(item => item.clientId !== id);
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
    // this.appComponent.showLoader = false;
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

  back(): void {
    this.appComponent.showLoader = false;
    this.router.navigate(['/user-account-management']);
  }
}
