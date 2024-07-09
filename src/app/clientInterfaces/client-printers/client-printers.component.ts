import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ClientUserService } from 'src/app/services/client-user.service';
import { ClientUser } from 'src/app/models/clientUsers';
import { AssignedPrinterService } from 'src/app/services/assigned-printer.service';
import { AuthenticationService } from 'src/app/services/authentication.service';


@Component({
  selector: 'app-client-printers',
  templateUrl: './client-printers.component.html',
  styleUrls: ['./client-printers.component.scss']
})
export class ClientPrintersComponent {

  title = "Printer"
  data: any[] = [];
  // data: Client[] = [];
  searchTerm!: string;
  searchError!: string;
  Token: any;
  clientId: number = 0;

  constructor(private assignedPrinterService: AssignedPrinterService,
    public service: AuthenticationService,
    private clientUserService: ClientUserService,
    private router: Router,
    private snackBar: MatSnackBar,) {
    this.fetchClientUserData();
  }

  fetchClientUserData() {
    let userId: string | null = localStorage.getItem('Token');

    if (userId !== null) {
      this.Token = JSON.parse(userId);
    }

    if (this.Token.id) {
      this.clientUserService.getClientUsers().subscribe({
        next: (clientUsers: ClientUser[]) => {
          const matchingClientUser = clientUsers.find(user => user.userId === this.Token.id);

          if (matchingClientUser && matchingClientUser.clientId) {
            this.clientId = matchingClientUser.clientId;
            this.GetPrinters();

          } else {
            console.error('Error: Matching client user not found or missing branchId.');
          }
        },
        error: (error) => {
          console.error('Error fetching client users:', error);
        }
      });
    }
  }

  GetPrinters() {
    this.assignedPrinterService.getAssignedPrinters().subscribe((result: any[]) => {
      // stores printer data in an array for displaying
      this.data = result.filter(printer => printer.clientId === this.clientId);
    })
  }

  GetPrinter() {
    if (this.searchTerm.length !== 0 || this.searchTerm !== "") {
      this.assignedPrinterService.getAssignedPrinterByName(this.searchTerm).subscribe((result: any[]) => {
        this.data = result.filter(printer => printer.clientId === this.clientId);
      });
    }
    else {
      this.GetPrinters();
    }
    //}
    // else{
    //   this.searchError = "Please enter search criteria";
    //   this.GetClients();
    // }
  }

  Delete(id: Number) {
    this.assignedPrinterService.deleteAssignedPrinter(id).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          this.data = this.data.filter(item => item.printerId !== id);
          this.snackBar.open("Delete Successful", 'X', { duration: 5000 });
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
    return this.router.navigate(['/client-dashboard']);
  }
}
