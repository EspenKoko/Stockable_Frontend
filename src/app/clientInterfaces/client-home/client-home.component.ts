import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BranchService } from 'src/app/services/branch.service';
import { ClientUserService } from 'src/app/services/client-user.service';
import { MatDialog } from '@angular/material/dialog';
import { PrinterInfoDialogComponent } from 'src/app/ClientInterfaces/client-home/printer-info-dialog/printer-info-dialog.component';

@Component({
  selector: 'app-client-home',
  templateUrl: './client-home.component.html',
  styleUrls: ['./client-home.component.scss']
})
export class ClientHomeComponent implements OnInit {

  serialNumber: string = "No printer on site";
  printerStatus: string = "";
  printerModelName: string = "";
  printerModelBrand: string = "";
  printerSerialNumber: string = "";
  branchName: string = "";
  Token: any;

  constructor(
    public service: AuthenticationService,
    private branchService: BranchService,
    private clientUserService: ClientUserService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.fetchClientUserData();
  }


  fetchClientUserData() {
    let userId: string | null = localStorage.getItem('Token');

    if (userId !== null) {
      this.Token = JSON.parse(userId);
    }

    if (this.Token.id) {
      this.clientUserService.getClientUsers().subscribe(
        (clientUsers: any[]) => {
          const matchingClientUser = clientUsers.find(user => user.userId === this.Token.id);
          if (matchingClientUser && matchingClientUser.branchId) {
            this.fetchBranchData(matchingClientUser.branchId);
          } else {
            console.error('Error: Matching client user not found or missing branchId.');
          }
        },
        (error) => {
          console.error('Error fetching client users:', error);
        }
      );
    } else {
      console.error('Error: UserId not found in localStorage.');
    }
  }

  fetchBranchData(branchId: number) {
    this.branchService.getBranch(branchId).subscribe({
      next: (result: any) => {
        this.serialNumber = result.assignedPrinter.serialNumber;
        this.printerStatus = result.assignedPrinter.printerStatus.printerStatusName;
        this.printerModelName = result.assignedPrinter.printerModel;
        this.branchName = result.branchName;
      },
      error: (error) => {
        console.error('Error fetching branch data:', error);
      }
    }
    );
  }

  openPrinterInfoDialog(): void {
    this.dialog.open(PrinterInfoDialogComponent, {
      data: {
        serialNumber: this.serialNumber,
        printerStatus: this.printerStatus,
        printerModelBrand: this.printerModelBrand,
        printerModelName: this.printerModelName,
        branchName: this.branchName,
      }
    });
  }
}
