import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignedTechnician } from 'src/app/models/assignedTechnician';
import { Employee } from 'src/app/models/employees';
import { AssignedTechnicianService } from 'src/app/services/assigned-technician.service';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ErrorLogService } from 'src/app/services/error-log.service';

@Component({
  selector: 'app-assign-technician',
  templateUrl: './assign-technician.component.html',
  styleUrls: ['./assign-technician.component.scss']
})
export class AssignTechnicianComponent {
  title = "Technician";

  searchError!: string
  data: any[] = [];
  errorLogData: any;
  searchTerm!: string;
  assignTechnicianForm: FormGroup;
  showComponent: boolean = false;
  assignedEmployees!: number[];

  constructor(private service: EmployeeService,
    private assignTechnicianService: AssignedTechnicianService,
    private errorLogService: ErrorLogService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private ATService: AuditTrailService) {
    this.errorLogService.getErrorLog(+this.route.snapshot.params['id']).subscribe(result => {
      this.errorLogData = result;
    })

    this.assignTechnicianForm = this.fb.group({
      errorLogId: [0, Validators.required],
      employeeId: [0, Validators.required],
      isAssigned: [false, Validators.required]
    })

    this.GetEmployees();

    this.assignedEmployees = [];
  }

  GetEmployees() {
    this.service.getEmployees().subscribe((result: Employee[]) => {
      // stores Employee data in an array for displaying
      this.data = result.filter(x => x.user.userType == "Employee" && x.employeeTypeId == 2)
    })
  }

  GetEmployee() {
    if (this.searchTerm.length !== 0 || this.searchTerm !== "") {
      this.service.getEmployeeByName(this.searchTerm).subscribe((result: any[]) => {
        this.data = result;
      });
    }
    else {
      this.GetEmployees();
    }
  }

  assign(technician: Employee) {
    this.assignTechnicianForm.setValue({
      errorLogId: this.errorLogData.errorLogId,
      employeeId: technician.employeeId,
      isAssigned: true
    })

    this.assignTechnicianService.addAssignedTechnician(this.assignTechnicianForm.value).subscribe({
      next: (result: any) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          this.router.navigate(['admin-dashboard']).then((navigated: Boolean) => {
            if (navigated) {
              // this.showComponent = true;

              // save audit trail
              this.ATService.trackActivity(`Technician assigned for ${this.errorLogData.assignedPrinter.serialNumber}`);

              this.snackBar.open("Technician assigned", 'X', { duration: 5000 });
            }
          })
        }
        else if (response.status == 500) {
          this.snackBar.open("Error: Technician may have already been assigned", 'X', { duration: 5000 });
        }
        else {
          this.snackBar.open("Error Occured: Check Connection", 'X', { duration: 5000 });
        }
      }
    })
  }

  //##################
  //tesitng

  getAssignedTechnicians() {
    this.assignTechnicianService.getAssignedTechnicians().subscribe((result: AssignedTechnician[]) => {
      this.assignedEmployees = result.map((assignedTech) => assignedTech.employeeId);
    });
  }

  toggleAssignUnassign(employee: Employee) {
    const isAssigned = this.assignedEmployees.includes(employee.employeeId);

    if (isAssigned) {
      this.unassignTechnician(employee.employeeId);
    } else {
      this.assignTechnician(employee.employeeId);
    }
  }

  assignTechnician(employeeId: number) {
    // Implement the logic to assign the technician to the error log
    // After successful assignment, add the employeeId to the assignedEmployees array
    // Update the UI to show "Unassign" for this employee

    // Example:
    this.assignTechnicianForm.setValue({
      errorLogId: this.errorLogData.errorLogId,
      employeeId: employeeId,
      isAssigned: true
    });

    this.assignTechnicianService.addAssignedTechnician(this.assignTechnicianForm.value).subscribe({
      next: (result: any) => {
        this.assignedEmployees.push(employeeId);
        this.snackBar.open("Technician assigned", 'X', { duration: 5000 });
      },
      error: (response: HttpErrorResponse) => {
        this.snackBar.open("Error Occurred: Check Connection", 'X', { duration: 5000 });
      }
    });
  }

  unassignTechnician(employeeId: number) {
    // Implement the logic to unassign the technician from the error log
    // After successful unassignment, remove the employeeId from the assignedEmployees array
    // Update the UI to show "Assign" for this employee

    // Example:
    this.assignTechnicianForm.setValue({
      errorLogId: this.errorLogData.errorLogId,
      employeeId: employeeId,
      isAssigned: false
    });

    this.assignTechnicianService.deleteAssignedTechnician(this.assignTechnicianForm.value).subscribe({
      next: (result: any) => {
        const index = this.assignedEmployees.indexOf(employeeId);
        if (index !== -1) {
          this.assignedEmployees.splice(index, 1);
        }
        this.snackBar.open("Technician unassigned", 'X', { duration: 5000 });
      },
      error: (response: HttpErrorResponse) => {
        this.snackBar.open("Error Occurred: Check Connection", 'X', { duration: 5000 });
      }
    });
  }

  back() {
    return this.router.navigate(['admin-dashboard'], { state: { fromAssignedTechnicianComponent: true } })
  }
}
