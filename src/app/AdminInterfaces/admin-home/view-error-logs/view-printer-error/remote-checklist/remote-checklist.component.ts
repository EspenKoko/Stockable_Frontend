import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorLogService } from 'src/app/services/error-log.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ErrorLog } from 'src/app/models/errorLogs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssignedPrinterService } from 'src/app/services/assigned-printer.service';
import { AssignedPrinter } from 'src/app/models/AssignedPrinters';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from 'src/app/services/api-urls';
import { AuditTrailService } from 'src/app/services/audit-trail.service';

@Component({
  selector: 'app-remote-checklist',
  templateUrl: './remote-checklist.component.html',
  styleUrls: ['./remote-checklist.component.scss']
})
export class RemoteChecklistComponent {
  rerouted: Boolean;

  data: any;
  remoteChecklist: FormGroup;

  constructor(private router: Router,
    private service: ErrorLogService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private printerService: AssignedPrinterService,
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    private ATService: AuditTrailService) {
    this.service.getErrorLog(+this.route.snapshot.params['id']).subscribe((result: any) => {
      this.data = result;
    })

    const navigationState = this.router.getCurrentNavigation()?.extras.state;
    if (navigationState && navigationState['fromAssignedTechnicianComponent']) {
      // Navigated from the AssignedTechnicianComponent
      console.log('Navigated from AssignedTechnicianComponent');
      this.rerouted = true;
    } else {
      // Navigated from a different URL
      console.log('Navigated from a different URL');
      this.rerouted = false;
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
                    if (response.status == 200) {
                      // save audit trail
                      this.ATService.trackActivity(`Error resolved for ${printer?.serialNumber}`);

                      this.router.navigate(['admin-error-log']).then((navigated: boolean) => {
                        if (navigated) {
                          this.snackBar.open("The printer is now back to normal and can be used for printing", 'X', { duration: 5000 });
                        }
                      })
                    }
                    else {
                      this.snackBar.open("An error has occured", 'X', { duration: 5000 });
                    }
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
      this.service.getErrorLog(this.data.errorLogId).subscribe((result: any) => {
        let errorLogData: ErrorLog = result;
        errorLogData.errorLogStatusId = 3
        this.service.editErrorLog(this.data.errorLogId, errorLogData).subscribe({
          next: (result: any) => { },
          error: (error: HttpErrorResponse) => {
            // save audit trail
            this.ATService.trackActivity(`Error unresolved for ${errorLogData.assignedPrinter.serialNumber}`);

            this.router.navigate(['assign-technician/' + this.data.errorLogId]);
          }
        })
      })
    } else {
      this.snackBar.open("Please ensure you have assessed every item in the checklist", 'X', { duration: 5000 });
    }
  }

  back() {
    return this.router.navigate(["view-printer-error/" + this.data.errorLogId])
  }
}
