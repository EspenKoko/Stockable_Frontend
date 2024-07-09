import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';
import { Employee } from 'src/app/models/employees';
import { EmployeeType } from 'src/app/models/employeeTypes';
import { EmployeeTypeService } from 'src/app/services/employee-type.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomValidators } from 'src/app/resources/custom-validators';
import { MailData } from 'src/app/models/MailData';
import { MailService } from 'src/app/services/mail-sender.service';
import { AuditTrailService } from 'src/app/services/audit-trail.service';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.scss']
})
export class CreateEmployeeComponent implements OnInit {
  title = "Employee";

  data: EmployeeType[] = [];

  registerForm: FormGroup;
  employeeForm: FormGroup;
  parentForm: FormGroup;

  constructor(private employeeService: EmployeeService,
    private employeeTypeService: EmployeeTypeService,
    private service: AuthenticationService,
    private router: Router,
    private mailService: MailService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private ATService: AuditTrailService) {

    this.registerForm = this.fb.group({
      emailaddress: ['', [Validators.required, Validators.email]],
      userFirstName: ['', [Validators.required, CustomValidators.checkSpecialCharacters]],
      userLastName: ['', [Validators.required, CustomValidators.checkSpecialCharacters]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^0[0-9]{9}$/)]],
      //type will be predetermind
      userType: ['Employee', Validators.required],
      password: [this.service.generatePassword(), Validators.required],
      role: [''],
      // profilePicture: [null],
    });

    this.employeeForm = this.fb.group({
      empHireDate: [new Date(), [Validators.required]],
      employeeTypeId: [, Validators.required],
      userId: ['']
    });

    this.parentForm = this.fb.group({
      registerForm: this.registerForm,
      employeeForm: this.employeeForm
    })
  }

  ngOnInit(): void {
    this.GetEmployeeTypes();
  }

  GetEmployeeTypes() {
    this.employeeTypeService.getEmployeeTypes().subscribe((result: any[]) => {
      this.data = result;
    })
  }

  register(): void {
    if (this.employeeForm.get('employeeTypeId')?.value == 1) {
      this.registerForm.get('role')?.setValue("ADMIN");
    }
    else if (this.employeeForm.get('employeeTypeId')?.value == 2) {
      this.registerForm.get('role')?.setValue("TECHNICIAN");
    }
    else if (this.employeeForm.get('employeeTypeId')?.value == 3) {
      this.registerForm.get('role')?.setValue("INVENTORY_CLERK");
    }

    this.service.register(this.registerForm.value).subscribe({
      next: (result) => {
        // Assign the userId to the userId formControl in clientUserForm
        this.employeeForm.get('userId')?.setValue(result.userId);
        this.Add();
      },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          console.log(response)
        }
        if (response.status == 400) {
          this.snackBar.open(`Error adding Employee: ` + response.error, 'X', { duration: 5000 });
        }
        if (response.status == 404) {
          this.snackBar.open(`Error adding Employee: ` + response.error, 'X', { duration: 5000 });
        }
        if (response.status == 409) {
          this.snackBar.open(`Error adding Employee: ` + response.error, 'X', { duration: 5000 });
        }
        if (response.status == 501) {
          this.snackBar.open(`Error adding Employee: ` + response.error, 'X', { duration: 5000 });
        }
      }
    })
  };

  Add() {
    let email: string = this.registerForm.get('emailaddress')?.value;

    this.employeeService.addEmployee(this.employeeForm.value).subscribe({
      next: (result) => { },
      error: (error: HttpErrorResponse) => {
        if (error.status === 200) {
          // save audit trail
          this.ATService.trackActivity(`Admin created employee, id: ${this.employeeForm.get('userId')?.value}`);

          this.snackBar.open("Creation in progress, please wait", 'X', { duration: 10000 });

          const mail: MailData = {
            toEmailAddress: email,
            subject: "Stockable registration notification",
            messageBody: `You have successfully been registered on the system. Your username is "${email}" and temporary password is "${this.registerForm.value.password}". Please save your password and note that it can be changed anytime from the acount screen under the change password tab.`
          }

          this.mailService.sendMail(mail).subscribe({
            next: (result: any) => { },
            error: (response: HttpErrorResponse) => {
              if (response.status == 200) {
                this.back().then((navigated: boolean) => {
                  if (navigated) {
                    this.snackBar.open(`Employee ${this.registerForm.value.emailaddress} successfully created and notified. User's password: ${this.registerForm.value.password}`, 'X', { duration: 99999999 });
                  }
                })
              }
              else {
                this.Delete(this.employeeForm.get('userId')?.value);
                this.snackBar.open(response.error, 'X', { duration: 99999999 });
              }
            }
          })
        }
        if (error.status == 400 || error.status == 404 || error.status == 500) {
          this.snackBar.open(error.error, 'X', { duration: 5000 });
        }
      }
    });
  }

  Delete(id: string) {
    this.service.deleteUser(id).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          console.log(response);
        }
        else {
          this.snackBar.open(response.error, 'X', { duration: 5000 });
        }
      }
    });
  }

  back() {
    return this.router.navigate(['/view-employee'])
  }
}
