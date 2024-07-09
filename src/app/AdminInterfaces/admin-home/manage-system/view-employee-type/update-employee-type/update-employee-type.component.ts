import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from 'src/app/resources/custom-validators';
import { ApiService } from 'src/app/services/api-urls';
import { EmployeeTypeService } from 'src/app/services/employee-type.service';

@Component({
  selector: 'app-update-employee-type',
  templateUrl: './update-employee-type.component.html',
  styleUrls: ['./update-employee-type.component.scss']
})
export class UpdateEmployeeTypeComponent {
  title = "Employee Type";

  employeeType: any;

  editForm: FormGroup = new FormGroup({
    employeeTypeName: new FormControl('', [Validators.required, CustomValidators.checkSpecialCharacters]),
    employeeTypeDescription: new FormControl('', [Validators.required, CustomValidators.checkSpecialCharacters]),
  })

  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: EmployeeTypeService,
    private snackBar: MatSnackBar,
    private apiService: ApiService) {

  }

  ngOnInit(): void {
    this.service.getEmployeeType(+this.route.snapshot.params['id']).subscribe(result => {
      this.employeeType = result;
      this.editForm.patchValue({
        employeeTypeName: this.employeeType.employeeTypeName,
        employeeTypeDescription: this.employeeType.employeeTypeDescription
      });
    })
  }

  edit() {
    this.service.editEmployeeType(this.employeeType.employeeTypeId, this.editForm.value).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        this.apiService.handleApiPutReponse(response, "employee-type", "employee type",  `${this.employeeType.employeeTypeName} -> ${this.editForm.get('employeeTypeName')?.value}`);
      }
    })
  }

  back() {
    return this.router.navigate(['/view-employee-type'])
  }
}
