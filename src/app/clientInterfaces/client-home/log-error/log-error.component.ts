import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ErrorCodeService } from 'src/app/services/error-code.service';
import { ErrorLogService } from 'src/app/services/error-log.service';
import { BranchService } from 'src/app/services/branch.service';
import { ClientUserService } from 'src/app/services/client-user.service';
import { AssignedPrinterService } from 'src/app/services/assigned-printer.service';
import { CustomValidators } from 'src/app/resources/custom-validators';
import { AuditTrailService } from 'src/app/services/audit-trail.service';


@Component({
  selector: 'app-log-error',
  templateUrl: './log-error.component.html',
  styleUrls: ['./log-error.component.scss']
})
export class LogErrorComponent {

  errorCodeData: any[] = [];
  errorLogData: any[] = [];
  printerData: any[] = [];
  assignedPrinterId: number = 0;
  clientUserId: number = 0;
  serialNumber: string = "";
  Token: any;
  printerStatusId: number = 0;
  assignedPrinter: any;

  errorCodeLogForm: FormGroup;
  editPrinterForm: FormGroup;

  constructor(
    private router: Router,
    private errorCodeService: ErrorCodeService,
    private errorLogService: ErrorLogService,
    private assignedPrinterService: AssignedPrinterService,
    private ATService: AuditTrailService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private branchService: BranchService,
    private clientUserService: ClientUserService,
  ) {

    this.GetErrorCodes();
    this.GetPrinter();

    this.fetchClientUserData();

    this.errorCodeLogForm = this.fb.group({
      clientUserId: [{ value: 0, disabled: false }, Validators.required],
      errorLogStatusId: [{ value: 1, disabled: false }, Validators.required],
      errorLogDescription: [{ value: "", disabled: false }, CustomValidators.checkSpecialCharacters],
      errorLogDate: [{ value: new Date().toISOString().split('T')[0], disabled: false }, Validators.required],
      errorCodeId: [null, Validators.required],
      assignedPrinterId: [0, Validators.required]
    });

    this.editPrinterForm = this.fb.group({
      printerId: [, Validators.required],
      serialNumber: [, Validators.required],
      clientId: [, Validators.required],
      printerModel: ['', Validators.required],
      printerStatusId: [, Validators.required],
    });
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
            this.clientUserId = matchingClientUser.clientUserId;
            this.errorCodeLogForm.patchValue({ clientUserId: this.clientUserId });
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
        this.assignedPrinterId = result.assignedPrinter.assignedPrinterId;
        this.errorCodeLogForm.patchValue({ assignedPrinterId: this.assignedPrinterId });
        this.serialNumber = result.assignedPrinter.serialNumber;
        this.assignedPrinter = result;
      },
      error: (error) => {
        console.error('Error fetching branch data:', error);
      }
    }
    );
  }

  GetErrorCodes() {
    this.errorCodeService.getErrorCodes().subscribe((result: any[]) => {
      this.errorCodeData = result;
    });
  }

  GetErrorLogss() {
    this.errorLogService.getErrorLogs().subscribe((result: any[]) => {
      this.errorLogData = result;
    });
  }

  GetPrinter() {
    this.assignedPrinterService.getAssignedPrinters().subscribe((result: any[]) => {
      this.printerData = result;
    });
  }

  logError() {
    this.errorLogService.addErrorLog(this.errorCodeLogForm.value).subscribe({
      next: (result) => {
      },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          this.updateAssignedPrinter();
        }
      }
    });
  }

  updateAssignedPrinter() {
    if (this.assignedPrinterId) {
      this.editPrinterForm.setValue({
        printerId: this.assignedPrinterId,
        serialNumber: this.assignedPrinter.assignedPrinter.serialNumber,
        clientId: this.assignedPrinter.clientId,
        printerStatusId: 2,
        printerModel: this.assignedPrinter.assignedPrinter.printerModel,
      })

      this.assignedPrinterService.editAssignedPrinter(this.assignedPrinterId, this.editPrinterForm.value).subscribe({
        next: (result) => { },
        error: (response: HttpErrorResponse) => {
          console.log(response);
          if (response.status == 200) {
            // save audit trail
            this.ATService.trackActivity(`Logged error for printer ${this.assignedPrinter.assignedPrinter.serialNumber}`);

            console.log('Assigned Printer Updated Successfully:', response);
            this.back().then((navigated: boolean) => {
              if (navigated) {
                this.snackBar.open(`Error Logged Successfully`, 'X', { duration: 5000 });
              }
            });
          } else {
            console.log(response.error);
          }
        }
      });
    } else {
      console.error('Error: Assigned printer ID not available.');
    }
  }

  back() {
    return this.router.navigate(['client-dashboard']);
  }
}
