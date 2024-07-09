import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClientUserService } from 'src/app/services/client-user.service';
import { ClientUser } from 'src/app/models/clientUsers';
import { BranchService } from 'src/app/services/branch.service';
import { AssignedPrinterService } from 'src/app/services/assigned-printer.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-assign-branch-printer',
  templateUrl: './assign-branch-printer.component.html',
  styleUrls: ['./assign-branch-printer.component.scss']
})
export class AssignBranchPrinterComponent {

  Token: any;
  clientId: number = 0;
  branchId: number = 0;
  printerId: number = 0;
  branchname: string = "";
  branchData: any;
  printerToUpdate: any;
  printerData: any[] = [];
  selectedPrinterId: string = 'default';

  updateForm: FormGroup;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private clientUserService: ClientUserService,
    private branchService: BranchService,
    private assignedPrinterService: AssignedPrinterService,
    private fb: FormBuilder,
  ) {
    this.fetchClientDetails();

    this.updateForm = this.fb.group({
      assignedPrinterId: ['', Validators.required],
    })

  }

  fetchClientDetails() {
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
            this.branchId = matchingClientUser.branchId;
            this.fetchBrtanchDetails();

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

  fetchBrtanchDetails() {
    this.branchService.getBranch(this.branchId).subscribe((result: any) => {
      this.branchData = result;
      this.branchname = result.branchName;
      this.fetchClientPrinters();
    });
  }

  fetchClientPrinters() {
    this.assignedPrinterService.getAssignedPrinters().subscribe((result: any[]) => {
      this.printerData = result.filter(printer => printer.printerStatusId === 3 && printer.clientId === this.clientId);
    });
  }

  updateBranch(id: string) {
    const assignedPrinterId: number = parseInt(id, 10);
    const branchToUpdate = this.branchData;

    if (assignedPrinterId) {
      branchToUpdate.assignedPrinterId = assignedPrinterId
      this.branchService.editBranch(branchToUpdate.branchId, branchToUpdate).subscribe({
        next: (result) => { },
        error: (response: HttpErrorResponse) => {
          if (response.status == 200) {
            console.log("Branch updated")
            this.updatePrinter(assignedPrinterId)
          } else {
            console.log("Branch not updated")
          }
        },
      });
    }
    else {
      console.error('Error: Assigned printer ID not available.');
    }

  }

  updatePrinter(assignedPrinterId: number) {
    this.assignedPrinterService.getAssignedPrinter(assignedPrinterId).subscribe((result: any) => {
      this.printerToUpdate = result;

      this.printerToUpdate.printerStatusId = 1;

      if (this.printerToUpdate) {
        this.assignedPrinterService.editAssignedPrinter(assignedPrinterId, this.printerToUpdate).subscribe({
          next: (result) => { },
          error: (response: HttpErrorResponse) => {
            if (response.status == 200) {
              this.back().then((navigated: boolean) => {
                if (navigated) {
                  this.snackBar.open(`Printer added to branch`, 'X', { duration: 5000 });
                }
              });
            } else {
              console.log("Printer not updated")
            }
          },
        });
      }
      else {
        console.log("Printer not updated")
      }
    });
  }

  back() {
    return this.router.navigate(['/client-printers']);
  }
}
