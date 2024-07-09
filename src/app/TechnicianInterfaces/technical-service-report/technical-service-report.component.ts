import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, map } from 'rxjs';
import { Employee } from 'src/app/models/employees';
import { PurchaseOrder } from 'src/app/models/purchaseOrder';
import { Repair } from 'src/app/models/repairs';
import { EmployeeService } from 'src/app/services/employee.service';
import { PurchaseOrderService } from 'src/app/services/purchase-order.service';
import { RepairService } from 'src/app/services/repair.service';
import { TechnicalServiceReportService } from 'src/app/services/technical-service-report';

@Component({
  selector: 'app-technical-service-report',
  templateUrl: './technical-service-report.component.html',
  styleUrls: ['./technical-service-report.component.scss']
})
export class TechnicalServiceReportComponent implements OnInit {
  purchaseOrder!: PurchaseOrder;

  technician: string = '';
  tsrForm: FormGroup;

  constructor(private tsrService: TechnicalServiceReportService,
    private purchaseOrderService: PurchaseOrderService,
    private employeeService: EmployeeService,
    private repairService: RepairService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar) {
    this.tsrForm = this.fb.group({
      purchaseOrderId: +this.route.snapshot.params['id'],
      repairsDone: ''
    })
  }

  ngOnInit(): void {
    this.purchaseOrderService.getPurchaseOrder(+this.route.snapshot.params['id']).subscribe((result: any) => {
      this.purchaseOrder = result;
    })

    this.GetEmployee();
  }

  addTSR() {
    this.tsrService.addTechnicalServiceReport(this.tsrForm.value).subscribe({
      next: (result: any) => { },
      error: (response1: HttpErrorResponse) => {
        if (response1.status == 200) {
          this.purchaseOrder.repair.repairStatusId = 7;

          this.repairService.editRepair(this.purchaseOrder.purchaseOrderId, this.purchaseOrder.repair).subscribe({
            next: (result) => { },
            error: (response2: HttpErrorResponse) => {
              if (response2.status == 200) {
                this.router.navigate(["purchase-orders"]).then((navigated: Boolean) => {
                  if (navigated) {
                    this.snackBar.open(`TSR Completed`, 'X', { duration: 5000 });
                  }
                });
              }
              else {
                this.snackBar.open(`An error has occured`, 'X', { duration: 5000 });
              }
            }
          })
        }
        else {
          this.snackBar.open(`An error has occured, please check conntection`, 'X', { duration: 5000 });
        }
      }
    })
  }

  //get technician
  //using promises
  async GetEmployee(): Promise<Employee> {
    const Token: any = JSON.parse(localStorage.getItem("Token") || '{}');
    const result: Employee[] = await firstValueFrom(this.employeeService.getEmployees());

    // Retrieve the Employee with the same user ID as the current user
    const employeeData = result.filter(emp => emp.userId === Token.id);
    const employee: Employee = employeeData[0];

    this.technician = employee.user.userFirstName + ' ' + employee.user.userLastName;

    return employee;
  }

  back() {
    return this.router.navigate(['purchase-orders'])
  }
}
