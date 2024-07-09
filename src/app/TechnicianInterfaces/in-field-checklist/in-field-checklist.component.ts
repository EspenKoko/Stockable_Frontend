import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AssignedPrinter } from 'src/app/models/AssignedPrinters';
import { ErrorLog } from 'src/app/models/errorLogs';
import { ApiService } from 'src/app/services/api-urls';
import { AssignedPrinterService } from 'src/app/services/assigned-printer.service';
import { ErrorLogService } from 'src/app/services/error-log.service';

@Component({
  selector: 'app-in-field-checklist',
  templateUrl: './in-field-checklist.component.html',
  styleUrls: ['./in-field-checklist.component.scss']
})
export class InFieldChecklistComponent implements OnInit {
  rerouted: Boolean;

  data: any;
  remoteChecklist: FormGroup;
  printerData: any[] = [];
  snackBarText: string;

  constructor(private router: Router,
    private service: ErrorLogService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private printerService: AssignedPrinterService,
    private apiService: ApiService) {
    this.service.getErrorLog(+this.route.snapshot.params['id']).subscribe((result: any) => {
      this.data = result;
    })

    const navigationState = this.router.getCurrentNavigation()?.extras.state;
    if (navigationState && navigationState['fromExchangePrinterComponent']) {
      // Navigated from the ExchangePrinterComponent
      console.log('Navigated from ExchangePrinterComponent');
      this.rerouted = true;
      this.snackBarText = "resubmited";
    } else {
      // Navigated from a different URL
      console.log('Navigated from a different URL');
      this.rerouted = false;
      this.snackBarText = "completed";
    }

    this.remoteChecklist = this.fb.group({
      Restarted: [false, Validators.required],
      NetworkCheck: [false, Validators.required],
      PrinterCleaned: [false, Validators.required],
      IndentCatridgeViable: [false, Validators.required],
      PrintingFoilViable: [false, Validators.required],
    })
  }

  ngOnInit(): void {
    this.getPrinters()
    this.checkState();
  }

  //check whether user routed to the page in the from dashboard or rerouted from parts request
  checkState() {
    if (this.rerouted) {
      this.remoteChecklist.setValue({
        Restarted: true,
        NetworkCheck: true,
        PrinterCleaned: true,
        IndentCatridgeViable: true,
        PrintingFoilViable: true,
      })
    }
  }

  getPrinters() {
    this.printerService.getAssignedPrinters().subscribe((result: any[]) => {
      this.printerData = result.filter(x => x.printerStatusId == 2);
    })
  }

  printerFixed() {
    this.service.getErrorLog(this.data.errorLogId).subscribe((errorlog: any) => {
      let errorLogData: ErrorLog = errorlog;
      errorLogData.errorLogStatusId = 2
      this.service.editErrorLog(this.data.errorLogId, errorLogData).subscribe({
        next: (result: any) => { },
        error: (response: HttpErrorResponse) => {
          if (response.status == 200) {
            this.printerService.getAssignedPrinters().subscribe((printers: AssignedPrinter[]) => {
              let printer = printers.find(x => x.assignedPrinterId == errorLogData.assignedPrinterId)

              // set printer as online again
              if (printer) {
                printer.printerStatusId = 1;
                this.printerService.editAssignedPrinter(printer.assignedPrinterId, printer).subscribe({
                  next: (result) => { },
                  error: (response: HttpErrorResponse) => {
                    this.router.navigate(['ifel']).then((navigated: boolean) => {
                      if (navigated) {
                        this.snackBar.open("The printer is now back to normal and can be used for printing", 'X', { duration: 5000 });
                      }
                    })
                  }
                })
              }
            })
          }
          else {
            this.apiService.handleApiDeleteReponse(response);
          }
        }
      })
    })
  }

  printerNotFixed() {
    // Get the form control values from the FormGroup
    const formValues = this.remoteChecklist.value;

    // Check if all boolean attributes in the form are true
    const allTrue = Object.values(formValues).every(value => value === true);

    if (allTrue) {
      console.log('All checklist items are marked as true.');
      this.router.navigate(['exchange-printer/' + this.data.errorLogId]).then((navigated: boolean) => {
        if (navigated) {
          this.snackBar.open("Diagnostics " + this.snackBarText + ". Please replace printer", 'X', { duration: 5000 });
        }
      })
      // this.service.getErrorLog(this.data.errorLogId).subscribe((result: any) => {
      //   let errorLogData: ErrorLog = result;
      //   errorLogData.errorLogStatusId = 4
      //   this.service.editErrorLog(this.data.errorLogId, errorLogData).subscribe({
      //     next: (result: any) => { },
      //     error: (error: HttpErrorResponse) => {
            
      //     }
      //   })
      // })
    } else {
      this.snackBar.open("Please ensure you have assessed every item in the checklist", 'X', { duration: 5000 });
    }
  }

  back() {
    return this.router.navigate(["ifel"])
  }
}
