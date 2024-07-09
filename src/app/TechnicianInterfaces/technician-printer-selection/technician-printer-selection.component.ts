import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AssignedPrinter } from 'src/app/models/AssignedPrinters';
import { AssignedTechnician } from 'src/app/models/assignedTechnician';
import { Branch } from 'src/app/models/branches';
import { ErrorLog } from 'src/app/models/errorLogs';
import { TransitPrinter } from 'src/app/models/transit-printer';
import { AssignedPrinterService } from 'src/app/services/assigned-printer.service';
import { AssignedTechnicianService } from 'src/app/services/assigned-technician.service';
import { BranchService } from 'src/app/services/branch.service';
import { ErrorLogService } from 'src/app/services/error-log.service';
import { TransitPrinterService } from 'src/app/services/transit-printer';

@Component({
  selector: 'app-technician-printer-selection',
  templateUrl: './technician-printer-selection.component.html',
  styleUrls: ['./technician-printer-selection.component.scss']
})
export class TechnicianPrinterSelectionComponent {
  data!: ErrorLog;
  Token: any;
  errorLogData: any;
  branchData: any; //type branch
  printerData: AssignedPrinter[] = [];
  // printerSelection: number = 0;
  printerSelection!: any;
  employeeId: any;

  constructor(private branchService: BranchService,
    private assignedPrinterService: AssignedPrinterService,
    private assignedTechnicianService: AssignedTechnicianService,
    private transitPrinterService: TransitPrinterService,
    private errorLogService: ErrorLogService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute) {
    if (localStorage.getItem("Token")) {
      this.Token = JSON.parse(localStorage.getItem("Token")!)
      this.employeeId = this.Token.id
    }

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

  getErrorlog() {
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
      this.printerData = data.filter((printer: AssignedPrinter) => printer.assignedPrinterId != this.data?.assignedPrinterId && printer.printerStatusId == 3);
    } catch (error) {
      this.snackBar.open("Error loading printer information: " + error, 'X', { duration: 5000 });
    }
  }


  addTransitPrinter(): void {
    if (this.printerSelection) {
      // Get the assigned technician

      const selectedPrinterSerialNumber = this.printerSelection;

      // Create a TransitPrinter object with the selected serial number
      const transitPrinter: TransitPrinter = {
        transitPrinterId: 0, // You can set this to 0 or any appropriate value
        technicianId: this.employeeId, // Set this to the appropriate technician ID
        assignedPrinterId: selectedPrinterSerialNumber.assignedPrinterId,
        date: new Date(Date.now()),
        errorLogId : this.data.errorLogId
      };

      // Add the transit printer
      this.transitPrinterService.addTransitPrinter(transitPrinter).subscribe({
        next: (result: any) => {
        },
        error: (response: HttpErrorResponse) => {
          if (response.status == 200) {
            this.updatePrinter(selectedPrinterSerialNumber)
          }
          else {
            this.snackBar.open('Error adding Transit Printer', 'Close', {
              duration: 5000, // Adjust the duration as needed
              panelClass: ['snackbar-error'], // Add custom CSS class for styling
            });
            console.error('Error adding Transit Printer', response.error);
          }

        }
      });
    } else {
      // Handle the case where no printer is selected
      console.warn('Please select a printer for exchange.');
    }
  }

  updatePrinter(selectedPrinterSerialNumber: any){
    selectedPrinterSerialNumber.printerStatusId = 4;

    this.assignedPrinterService.editAssignedPrinter(selectedPrinterSerialNumber.assignedPrinterId, selectedPrinterSerialNumber).subscribe({
      next: (result: any) => {
      },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          this.updateErrorLog()
        }
        else {
          this.snackBar.open('Error adding Transit Printer', 'Close', {
            duration: 5000, // Adjust the duration as needed
            panelClass: ['snackbar-error'], // Add custom CSS class for styling
          });
          console.error('Error adding Transit Printer', response.error);
        }

      }
    });


  }

  updateErrorLog(){
    this.errorLogData.errorLogStatusId = 4;

    this.errorLogService.editErrorLog(this.data.errorLogId, this.errorLogData).subscribe({
      next: (result: any) => {
      },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          this.snackBar.open('Transit Printer added successfully', 'Close', {
            duration: 3000, // Adjust the duration as needed
            panelClass: ['snackbar-success'], // Add custom CSS class for styling
          });
          this.router.navigate(['/technician-dashboard'], { state: { fromExchangePrinterComponent: true } })
          console.log('Transit Printer added successfully', response);
        }
        else {
          this.snackBar.open('Error adding Transit Printer', 'Close', {
            duration: 5000, // Adjust the duration as needed
            panelClass: ['snackbar-error'], // Add custom CSS class for styling
          });
          console.error('Error adding Transit Printer', response.error);
        }

      }
    });
  }

  
  back() {
    return this.router.navigate(['/technician-bookout-printer'], { state: { fromExchangePrinterComponent: true } })
  }
}

