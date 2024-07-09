import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ClientUserService } from 'src/app/services/client-user.service';
import { ClientUser } from 'src/app/models/clientUsers';
import { ErrorLogService } from 'src/app/services/error-log.service';



@Component({
  selector: 'app-view-errorlog-statuses',
  templateUrl: './view-errorlog-statuses.component.html',
  styleUrls: ['./view-errorlog-statuses.component.scss']
})
export class ViewErrorlogStatusesComponent {
  
  Token: any;
  clientId: number = 0;
  data: any[] = [];
  logs: any[] = [];

  constructor(
    private errorLogService: ErrorLogService,
    private clientUserService: ClientUserService,
    private router: Router,
    private snackBar: MatSnackBar,
  ){
    this.fetchClientDetails();
  }

  fetchClientDetails(){
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
            console.log("Client ID",this.clientId)
            this.GetErrorlogs();

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

  GetErrorlogs() {
    this.errorLogService.getErrorLogs().subscribe((result: any[]) => {
      this.data = result
      console.log("unfilterd",this.data)
      this.logs = result.filter(errorlog => errorlog.clientId === this.clientId);
      console.log("Filterd",this.data)
    })
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
    return this.router.navigate(['/client-printers']);
  }
}
