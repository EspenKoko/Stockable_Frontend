import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorLogService } from 'src/app/services/error-log.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { RepairService } from 'src/app/services/repair.service';
import { AssignedPrinterService } from 'src/app/services/assigned-printer.service';
import { AuditTrailService } from 'src/app/services/audit-trail.service';

@Component({
  selector: 'app-book-out-printer',
  templateUrl: './book-out-printer.component.html',
  styleUrls: ['./book-out-printer.component.scss']
})
export class BookOutPrinterComponent {

  errorLogData: any;
  Data: any[] = [];
  repairOrderData: any[] = [];
  Token: any;
  employeeId: number = 0;
  repairId: number = 0;
  printerData: any;

  bookOutPrinterForm: FormGroup;
  addForm: FormGroup;

  constructor(
    private router: Router,
    private errorLogService: ErrorLogService,
    private employeeService: EmployeeService,
    private fb: FormBuilder,
    private repairService: RepairService,
    private snackBar: MatSnackBar,
    private assignedPrinterService: AssignedPrinterService,
    private ATService: AuditTrailService
  ) {
    this.getRepairs();
    this.fetchEmployeeUserData();

    this.bookOutPrinterForm = this.fb.group({
      errorLogId: [null, Validators.required],
    })

    this.addForm = this.fb.group({
      errorLogId: [null, Validators.required],
      employeeId: [null, Validators.required],
      repairStatusId: [null, Validators.required],
    })
  }

  getRepairs() {
    this.repairService.getRepairs().subscribe((result: any[]) => {
      this.Data = result.filter((log) => log.repairStatus.repairStatusId === 8);
    });
  }


  fetchEmployeeUserData() {
    let userId: string | null = localStorage.getItem('Token');

    if (userId !== null) {
      this.Token = JSON.parse(userId);
    }

    if (this.Token.id) {
      this.employeeService.getEmployees().subscribe(
        (employees: any[]) => {
          const matchingEmployee = employees.find(user => user.userId === this.Token.id);

          if (matchingEmployee) {
            this.employeeId = matchingEmployee.employeeId;
            console.log(this.employeeId)
          } else {
            console.error('Error: Matching employee user not found');
          }
        },
        (error) => {
          console.error('Error fetching employees:', error);
        }
      );
    } else {
      console.error('Error: UserId not found in localStorage.');
    }
  }

  submitBooking() {
    const selectedErrorLogId = this.bookOutPrinterForm.get('errorLogId')?.value;

    if (selectedErrorLogId) {
      this.errorLogService.getErrorLog(+selectedErrorLogId).subscribe((result) => {
        this.errorLogData = result
        this.errorLogData.errorLogStatusId = 8;

        // Now, make the API call to update the error log on the server-side
        this.errorLogService.editErrorLog(selectedErrorLogId, this.errorLogData).subscribe({
          next: (result) => {
          },
          error: (response: HttpErrorResponse) => {
            console.log(response);
            if (response.status == 200) {
              // save audit trail
              this.ATService.trackActivity("Printer booked out");

              // this.editRepairOrder(selectedErrorLogId);
              this.editPrinter(this.errorLogData.assignedPrinterId);
            }
            else {
              // save audit trail
              this.ATService.trackActivity("Printer book out failed");

              console.log(response.error);
            }
          }
        });
      })
    }
  }


  editRepairOrder(errorLogId: number) {
    const selectedErrorLogIdString = errorLogId.toString(); // Convert the errorLogId to a string to match the data type

    this.repairService.getRepairs().subscribe((result: any[]) => {
      console.log(result);
      this.repairOrderData = result.filter((order) => order.errorLogId.toString() === selectedErrorLogIdString);
      if (this.repairOrderData.length > 0) {
        this.repairId = this.repairOrderData[0].repairId;
        this.addForm.setValue({
          errorLogId: errorLogId,
          employeeId: this.employeeId,
          repairStatusId: 7,
        });
        this.repairService.editRepair(this.repairId, this.addForm.value).subscribe({
          next: (result) => { },
          error: (response: HttpErrorResponse) => {
            if (response.status == 200) {
              console.log("repair order updated")
            } else {
              console.log("repair order not updated")
            }
          },
        });
      } else {
      }
    });
  }

  editPrinter(printerId: number) {
    this.assignedPrinterService.getAssignedPrinter(printerId).subscribe((result) => {
      this.printerData = result;

      this.printerData.printerStatusId = 3;
      // this.printerData.printerLocation = "Float";

      this.assignedPrinterService.editAssignedPrinter(printerId, this.printerData).subscribe({
        next: (result) => {
          // Handle success
        },
        error: (response: HttpErrorResponse) => {
          if (response.status == 200) {
            // this.editPrinter(errorLogId);
            this.back().then((navigated: boolean) => {
              if (navigated) {
                this.snackBar.open(`Printer Booked Out`, 'X', { duration: 5000 });
              }
            });
          } else {
            this.snackBar.open(`Failed to book out printer`, 'X', { duration: 5000 });
          }
        },
      })
    })
  }

  back() {
    return this.router.navigate(['inventory-clerk-dashboard']);
  }
}
