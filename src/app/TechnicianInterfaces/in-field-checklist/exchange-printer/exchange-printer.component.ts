import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AssignedPrinter } from 'src/app/models/AssignedPrinters';
import { Branch } from 'src/app/models/branches';
import { ErrorLog } from 'src/app/models/errorLogs';
import { AssignedPrinterService } from 'src/app/services/assigned-printer.service';
import { BranchService } from 'src/app/services/branch.service';
import { ErrorLogService } from 'src/app/services/error-log.service';

@Component({
  selector: 'app-exchange-printer',
  templateUrl: './exchange-printer.component.html',
  styleUrls: ['./exchange-printer.component.scss']
})
export class ExchangePrinterComponent implements OnInit {
  data!: ErrorLog;
  errorLogData: any;
  branchData: any; //type branch
  printerData: AssignedPrinter[] = [];
  // printerSelection: number = 0;
  printerSelection!: any;

  constructor(private branchService: BranchService,
    private assignedPrinterService: AssignedPrinterService,
    private errorLogService: ErrorLogService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute) {

  }
  async ngOnInit(): Promise<void> {
    await this.loadData();
    await this.getBranch();
    await this.getPrinters();
    this.getErrorlog();
  }

  async loadData(): Promise<void> {
    try {
      const result: any = await firstValueFrom(this.errorLogService.getErrorLog(+this.route.snapshot.params['id']));
      this.data = result;
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

   getErrorlog(){
    this.errorLogService.getErrorLog(this.data.errorLogId).subscribe((result: any) => { 
      this.errorLogData = result;
    })
  }

  async getBranch() {
    try {
      const data = await firstValueFrom(this.branchService.getBranches());
      this.branchData = data.find((branch: Branch) => branch.assignedPrinterId === this.data?.assignedPrinterId);
    } catch (error) {
      this.snackBar.open("Error loading branch information: " + error, 'X', { duration: 5000 });
    }
  }

  async getPrinters() {
    try {
      const result = await firstValueFrom(this.assignedPrinterService.getAssignedPrinters());
      let data = result.filter((printer: AssignedPrinter) => printer.clientId == this.branchData?.clientId);
      this.printerData = data.filter((printer: AssignedPrinter) => printer.assignedPrinterId != this.data?.assignedPrinterId && printer.printerStatusId == 4);
    } catch (error) {
      this.snackBar.open("Error loading printer information: " + error, 'X', { duration: 5000 });
    }
  }


  editBranch() {
    if (this.printerSelection) {
      let updatedBranchPrinter: Branch = this.branchData;

      this.errorLogData.errorLogStatusId = 5;

      updatedBranchPrinter.assignedPrinterId = this.printerSelection.assignedPrinterId;
      this.branchService.editBranch(updatedBranchPrinter.branchId, updatedBranchPrinter).subscribe({
        next: (result: any) => { },
        error: (response: HttpErrorResponse) => {

          if (response.status == 200) {
            updatedBranchPrinter.assignedPrinter.printerStatusId = 1;
            updatedBranchPrinter.assignedPrinter.serialNumber = this.printerSelection.serialNumber;
            
            this.assignedPrinterService.editAssignedPrinter(updatedBranchPrinter.assignedPrinterId, updatedBranchPrinter.assignedPrinter).subscribe({
              next: (result: any) => { },
              error: (response: HttpErrorResponse) => {
                if (response.status == 200) {
                  this.errorLogService.editErrorLog(this.errorLogData.errorLogId, this.errorLogData).subscribe({
                    next: (result: any) => { },
                    error: (response: HttpErrorResponse) => {
                      if (response.status == 200){
                        this.router.navigate(['ifel']).then((navigated: boolean) => {
                          if (navigated) {
                            this.snackBar.open(`Printer at branch ` + updatedBranchPrinter.branchCode + ` has been exchanged and updated on the system`, 'X', { duration: 5000 });
                          }
                        })
                      }
                      else {
                        this.snackBar.open("Could not Update printer status: " + response.error, 'X', { duration: 5000 });
                      }
                    }
                  })
                }
              }
            })
          }
          else {
            this.snackBar.open("Could not exchange printer: " + response.error, 'X', { duration: 5000 });
          }
        }
      })
    }
    else {
      this.snackBar.open("Please make a printer selection for exchange", 'X', { duration: 5000 });
    }
  }

  back() {
    return this.router.navigate(['in-field-checklist/' + this.data.errorLogId], { state: { fromExchangePrinterComponent: true } })
  }
}
