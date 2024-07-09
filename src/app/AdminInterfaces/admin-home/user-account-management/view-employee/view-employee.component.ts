import { Component } from '@angular/core';
import { Employee } from 'src/app/models/employees';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { User } from 'src/app/models/users';

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.scss']
})
export class ViewEmployeeComponent {
  title = "Employee";
  data: any[] = [];

  searchTerm!: string;
  searchError!: string

  constructor(private employeeService: EmployeeService,
    private service: AuthenticationService,
    private router: Router,
    private snackBar: MatSnackBar,
    private ATService:AuditTrailService) {
    this.GetUsers();
  }

  GetUsers() {
    this.service.getAllUsers().subscribe((result: any[]) => {
      // stores client data in an array for displaying
      // Filter the result to include only users with userType "Employee"
      // Add the confirmButton property to each data object
      this.data = result.filter(item => item.userType === "Employee").map(item => ({ ...item, confirmButton: false }));

      this.data.forEach((user: any) => {
        this.employeeService.getEmployees().subscribe((result: Employee[]) => {

          // Retrieve the Employee with the same user ID as the current user
          const employeeData = result.filter(emp => emp.userId === user.id);
          let employee: Employee = employeeData[0]

          //set employee in Employee user table
          user.employee = employee
        })
      })
    })
  }

  GetUser() {
    if (this.searchTerm.length !== 0 || this.searchTerm !== "") {
      this.service.getAllUsers().subscribe((result: any[]) => {
        // Filter the result to include only searched users with userType "Employee"
        let user = result.filter(item => item.userType === "Employee");
        this.data = user.filter(x => x.userFirstName.toLowerCase().includes(this.searchTerm.toLowerCase()) || x.userLastName.toLowerCase().includes(this.searchTerm.toLowerCase())).map(item => ({ ...item, confirmButton: false }))

        this.data.forEach((user: any) => {
          this.employeeService.getEmployees().subscribe((result: Employee[]) => {

            // Retrieve the employee with the same user ID as the current user
            const employeeData = result.filter(emp => emp.userId === user.id);
            let employee: Employee = employeeData[0];

            //set employee in Client user table
            user.employee = employee;
          })
        })
      })
    }
    else {
      this.GetUsers();
    }
  }

  //toggles the confirm and delete button on click to confirm deletion
  toggleConfirmButton(index: number, id: string) {

    //if the button property is set to false it will be a delete button and if true a confirm button.
    // when a confirm button and clicked again it will delete the table row
    if (this.data[index].confirmButton) {
      this.Delete(id)
    }
    else {
      this.data[index].confirmButton = !this.data[index].confirmButton;
    }
  }

  Delete(id: string) {
    this.service.deleteUser(id).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          // save audit trail
          const employee: User = this.data.find(item => item.id == id);
          this.ATService.trackActivity(`Deleted employee: + ${employee.id}`);

          this.data = this.data.filter(item => item.id !== id);
          this.snackBar.open("Delete Successful", 'X', { duration: 5000 });
        }
        else if (response.status == 500) {
          this.snackBar.open("Employee is currently associated with funtionality on the system", 'X', { duration: 5000 });
        }
        else {
          this.snackBar.open(response.error, 'X', { duration: 5000 });
        }
      }
    });
  }

  //table sorter
  currentSortColumn!: string; //used for getting selected column in table sorter
  isAscending: boolean = true; // arranges the column of the sorted table

  sortTable(column: string) {
    if (this.currentSortColumn === column) {
      this.isAscending = !this.isAscending;
    } else {
      this.currentSortColumn = column;
      this.isAscending = true;
    }

    if (this.isAscending) {
      this.data.sort((a, b) => (a[column] > b[column] ? 1 : -1));
    } else {
      this.data.sort((a, b) => (a[column] < b[column] ? 1 : -1));
    }
  }

  back() {
    return this.router.navigate(['/user-account-management'])
  }
}