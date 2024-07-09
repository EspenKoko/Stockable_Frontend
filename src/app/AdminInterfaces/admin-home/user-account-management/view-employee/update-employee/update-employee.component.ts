import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';
import { EmployeeType } from 'src/app/models/employeeTypes';
import { EmployeeTypeService } from 'src/app/services/employee-type.service';
import { Employee } from 'src/app/models/employees';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CustomValidators } from 'src/app/resources/custom-validators';
import { AuditTrailService } from 'src/app/services/audit-trail.service';

@Component({
  selector: 'app-update-employee',
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.scss']
})
export class UpdateEmployeeComponent implements OnInit {
  title = "Employee";

  //stores the employee data being updated
  user: any;
  employee!: Employee;

  //stores employee type for the select list
  data: EmployeeType[] = [];

  editUserForm: FormGroup;
  editEmployeeForm: FormGroup;
  parentEditForm: FormGroup;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private employeeTypeService: EmployeeTypeService,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private service: AuthenticationService,
    private ATService: AuditTrailService) {

    this.editUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      userFirstName: ['', [Validators.required, CustomValidators.checkSpecialCharacters]],
      userLastName: ['', [Validators.required, CustomValidators.checkSpecialCharacters]],
      phoneNumber: ['', Validators.required],
      //type will be predetermind
      userType: ['Employee', Validators.required],
      password: [''],
      role: [''],
      // profilePicture: [null],
    });

    this.editEmployeeForm = this.fb.group({
      empHireDate: ['', [Validators.required]],
      employeeTypeId: [0, Validators.required],
      userId: ['', Validators.required]
    });

    this.parentEditForm = this.fb.group({
      editUserForm: this.editUserForm,
      editEmployeeForm: this.editEmployeeForm
    })
  }

  GetEmployeeTypes() {
    this.employeeTypeService.getEmployeeTypes().subscribe((result: any[]) => {
      this.data = result;
    })
  }

  ngOnInit(): void {
    this.GetEmployeeTypes();

    this.service.getUser(this.route.snapshot.params['id']).subscribe(result => {
      this.user = result;

      //link to clientUser based on userId
      this.employeeService.getEmployees().subscribe((result: any[]) => {
        this.employee = result.find(x => x.userId == this.user.id)

        this.editUserForm.patchValue({
          userFirstName: this.employee.user.userFirstName,
          userLastName: this.employee.user.userLastName,
          phoneNumber: this.employee.user.phoneNumber,
          email: this.employee.user.email,
          userType: this.employee.user.userType,
        });

        this.editEmployeeForm.patchValue({
          empHireDate: this.employee.empHireDate,
          userId: this.employee.userId,
          employeeTypeId: this.employee.employeeTypeId
        });
      })
    })
  }

  updateUser() {
    if (this.editEmployeeForm.get('employeeTypeId')?.value == 1) {
      this.editUserForm.get('role')?.setValue("ADMIN");
    }
    else if (this.editEmployeeForm.get('employeeTypeId')?.value == 2) {
      this.editUserForm.get('role')?.setValue("TECHNICIAN");
    }
    else if (this.editEmployeeForm.get('employeeTypeId')?.value == 3) {
      this.editUserForm.get('role')?.setValue("INVENTORY_CLERK");
    }

    this.service.updateUser(this.user.id, this.editUserForm.value).subscribe({
      next: (result) => { },
      error: (userResponse: HttpErrorResponse) => {
        if (userResponse.status == 200) {

          this.employeeService.editEmployee(this.employee.employeeId, this.editEmployeeForm.value).subscribe({
            next: (result: any) => { },
            error: (employeeResponse: HttpErrorResponse) => {
              if (employeeResponse.status == 200) {
                // save audit trail
                this.ATService.trackActivity(`Admin updated employee, id: ${this.employee.user.id}`);

                this.back().then((navigated: boolean) => {
                  if (navigated) {
                    this.snackBar.open(`Employee Successfully Updated`, 'X', { duration: 5000 });
                  }
                })
              }
              else {
                this.snackBar.open("Failed to update part of the form", 'X', { duration: 5000 });
              }
            }
          })
        }
        else {
          this.snackBar.open("Failed to update user, check connection", 'X', { duration: 5000 });
        }
      }
    })
  }

  back() {
    return this.router.navigate(['/view-employee'])
  }
}

