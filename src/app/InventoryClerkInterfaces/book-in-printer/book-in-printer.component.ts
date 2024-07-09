import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorLogService } from 'src/app/services/error-log.service';
import { RepairService } from 'src/app/services/repair.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { AssignedTechnicianService } from 'src/app/services/assigned-technician.service';
import { AssignedTechnician } from 'src/app/models/assignedTechnician';
import { AuditTrailService } from 'src/app/services/audit-trail.service';

@Component({
  selector: 'app-book-in-printer',
  templateUrl: './book-in-printer.component.html',
  styleUrls: ['./book-in-printer.component.scss']
})
export class BookInPrinterComponent {

  printerData: any[] = [];
  errorLogData: any[] = [];
  Token: any;
  employeeId: number = 0;

  bookInPrinterForm: FormGroup;
  addForm: FormGroup;

  constructor(
    private router: Router,
    private errorLogService: ErrorLogService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private RepairService: RepairService,
    private employeeService: EmployeeService,
    private assignTechnicianService: AssignedTechnicianService,
    private ATService: AuditTrailService
  ) {
    this.GetErrorLogs();
    this.fetchEmployeeUserData();

    this.bookInPrinterForm = this.fb.group({
      errorLogId: [null, Validators.required],
    })

    this.addForm = this.fb.group({
      errorLogId: [null, Validators.required],
      employeeId: [null, Validators.required],
      repairStatusId: [null, Validators.required],
    })
  }

  GetErrorLogs() {
    this.errorLogService.getErrorLogs().subscribe((result: any[]) => {
      console.log(result)
      this.errorLogData = result.filter((log) => log.errorLogStatus.errorLogStatusId === 5);
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
          const matchingEmployee = employees.find(emp => emp.userId === this.Token.id);

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
    const selectedErrorLogId = this.bookInPrinterForm.get('errorLogId')?.value;

    if (selectedErrorLogId) {
      const idAsNumber = parseInt(selectedErrorLogId, 10); // Convert to number
      const selectedErrorLog = this.errorLogData.find((log) => log.errorLogId === idAsNumber);

      if (selectedErrorLog) {
        // Update the error log status to the desired status ID (in this case, 8)
        selectedErrorLog.errorLogStatusId = 6;

        // Now, make the API call to update the error log on the server-side
        this.errorLogService.editErrorLog(selectedErrorLogId, selectedErrorLog).subscribe({
          next: (result) => { },
          error: (response: HttpErrorResponse) => {
            if (response.status == 200) {
              this.createRepairOrder(selectedErrorLogId);

              // save audit trail
              this.ATService.trackActivity("Printer booked in");

              this.errorLogService.getErrorLog(selectedErrorLogId).subscribe((result) => {
                let data = result;

                this.assignTechnicianService.getAssignedTechnicians().subscribe((result: AssignedTechnician[]) => {
                  let assignedTechnician: any = result.find(x => x.errorLogId == selectedErrorLogId);

                  assignedTechnician.isAssigned = false;
                  this.assignTechnicianService.editAssignedTechnician(selectedErrorLogId, assignedTechnician).subscribe(result => {
                    console.log("Booking Submitted", result)
                  })
                })
              })
            }
            else {
              // save audit trail
              this.ATService.trackActivity(`Printer book in failed`);

              console.log(response.error);
            }
          }
        });
      }
    }
  }

  createRepairOrder(errorLogId: number) {
    this.addForm.setValue({
      errorLogId: +errorLogId,
      employeeId: this.employeeId,
      repairStatusId: 1
    })
    this.RepairService.addRepair(this.addForm.value).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          this.back().then((navigated: boolean) => {
            if (navigated) {
              this.snackBar.open(`Printer Booked In`, 'X', { duration: 5000 });
            }
          });
        } else {
          console.log(response.error)
          this.snackBar.open(`Failed to book in printer`, 'X', { duration: 5000 });
        }
      }
    })
  }

  back() {
    return this.router.navigate(['inventory-clerk-dashboard']);
  }
}
