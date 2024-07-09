import { Component } from '@angular/core';
import { EmployeeTypeService } from 'src/app/services/employee-type.service';
import { Router } from '@angular/router';
import { EmployeeType } from 'src/app/models/employeeTypes';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuditTrailService } from 'src/app/services/audit-trail.service';

@Component({
  selector: 'app-view-employee-type',
  templateUrl: './view-employee-type.component.html',
  styleUrls: ['./view-employee-type.component.scss']
})
export class ViewEmployeeTypeComponent {
  title = "Employee Type";
  searchError!: string
  data: any[] = [];
  searchTerm!: string;

  constructor(private service: EmployeeTypeService,
    private router: Router,
    private snackBar:MatSnackBar,
    private ATService: AuditTrailService) {
    this.GetEmployeeTypes();
  }

  GetEmployeeTypes() {
    this.service.getEmployeeTypesFromStoredProcedure().subscribe((result: any[]) => {
      // stores employee type data in an array for displaying
      // Add the confirmButton property to each data object
      this.data = result.map(item => ({ ...item, confirmButton: false }));
    })
  }

  GetEmployeeType() {
    if (this.searchTerm.length !== 0 || this.searchTerm !== "") {
      this.service.getEmployeeTypeByName(this.searchTerm).subscribe((result: any[]) => {
        this.data = result;
      });
    }
    else {
      this.GetEmployeeTypes();
    }
  }

  //toggles the confirm and delete button on click to confirm deletion
  toggleConfirmButton(index: number, id: number) {

    //if the button property is set to false it will be a delete button and if true a confirm button.
    // when a confirm button and clicked again it will delete the table row
    if (this.data[index].confirmButton) {
      this.Delete(id)
    }
    else {
      this.data[index].confirmButton = !this.data[index].confirmButton;
    }
  }

  Delete(id: Number) {
    this.service.deleteEmployeeType(id).subscribe({
    next: (result) => { },
    error:  (response: HttpErrorResponse) => {
        if (response.status == 200) {
          // save audit trail
          const employeeType: EmployeeType = this.data.find(item => item.employeeTypeId == id);
          this.ATService.trackActivity("Deleted employee type: " + employeeType.employeeTypeName);

          this.data = this.data.filter(item => item.employeeTypeId !== id);
          this.snackBar.open("Delete Successful", 'X', { duration: 5000 });
        }
        else if (response.status == 500) {
          this.snackBar.open("Employee type is currently associated with funtionality on the system", 'X', { duration: 5000 });
        }
        else{
          this.snackBar.open(response.error, 'X', { duration: 5000 });
        }
      }
    });
  }

  back() {
    return this.router.navigate(['/manage-systems'])
  }
}