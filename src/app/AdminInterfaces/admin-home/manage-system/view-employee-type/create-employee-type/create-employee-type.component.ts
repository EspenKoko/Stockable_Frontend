import { Component } from '@angular/core';
import { EmployeeType } from 'src/app/models/employeeTypes';
import { Router } from '@angular/router';
import { EmployeeTypeService } from 'src/app/services/employee-type.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/resources/custom-validators';
import { ApiService } from 'src/app/services/api-urls';

@Component({
  selector: 'app-create-employee-type',
  templateUrl: './create-employee-type.component.html',
  styleUrls: ['./create-employee-type.component.scss']
})
export class CreateEmployeeTypeComponent {
  title = "Employee Type";

  selectedEmployeeType: number | undefined;

  addForm: FormGroup;

  constructor(private router: Router,
    private service: EmployeeTypeService,
    private fb: FormBuilder,
    private apiService: ApiService) {
    this.addForm = this.fb.group({
      employeeTypeName: ['', [Validators.required, CustomValidators.checkSpecialCharacters]],
      employeeTypeDescription: ['', [Validators.required, CustomValidators.checkSpecialCharacters]]
    })
  }

  Add() {
    this.service.addEmployeeType(this.addForm.value).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        this.apiService.handleApiPostReponse(response, "employee-type", "employee type", this.addForm.get('employeeTypeName')?.value);
      }
    });
  }

  back() {
    return this.router.navigate(['/view-employee-type']);
  }
}
