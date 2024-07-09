import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Employee } from 'src/app/models/employees';
import { StockTake } from 'src/app/models/stockTake';
import { StockTakeStock } from 'src/app/models/stockTakeStock';
import { EmployeeService } from 'src/app/services/employee.service';
import { StockTakeStockService } from 'src/app/services/stock-take-stock.service';
import { StockTakeService } from 'src/app/services/stock-take.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-stock-take',
  templateUrl: './stock-take.component.html',
  styleUrls: ['./stock-take.component.scss']
})
export class StockTakeComponent {
  data: any[] = [];
  employeeData: Employee | undefined;

  stockTakeForm: FormGroup;
  stockTakeStockForm: FormGroup;

  constructor(private service: StockService,
    private stockTakeService: StockTakeService,
    private stockTakeStockService: StockTakeStockService,
    private employeeService: EmployeeService,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar) {
    this.stockTakeForm = this.fb.group({
      stockTakeDate: [new Date(), Validators.required],
      employeeId: [0, Validators.required],
    })

    this.stockTakeStockForm = this.fb.group({
      stockTakeId: [0, Validators.required],
      stockId: [0, Validators.required],
      qty: [0, Validators.required]
    })
  }

  ngOnInit(): void {
    this.GetStocks();
  }

  GetStocks() {
    this.service.getStocks().subscribe((result: any[]) => {
      // stores stock data in an array for displaying
      this.data = result;
    })
  }

  //get employeeId to add to the stock take form
  async GetEmployee(): Promise<Employee> {
    const Token: any = JSON.parse(localStorage.getItem("Token") || '{}');
    const result: Employee[] = await firstValueFrom(this.employeeService.getEmployees());

    // Retrieve the Employee with the same user ID as the current user
    const employeeData = result.filter(emp => emp.userId === Token.id);
    const employee: Employee = employeeData[0];

    return employee;
  }

  async createStockTake() {
    this.stockTakeForm.setValue({
      stockTakeDate: new Date(),
      employeeId: (await (this.GetEmployee())).employeeId
    })

    if (this.stockTakeForm.valid) {
      this.stockTakeService.addStockTake(this.stockTakeForm.value).subscribe({
        next: (result: any) => { },
        error: (response: HttpErrorResponse) => {
          if (response.status == 200) {
            console.log("Stock take creation completed")
          }
          else {
            console.error("Stock take creation failed")
          }
        }
      })
    }
    else {
      console.error("Error creating stock take record. check date or employee authentication")
    }
  }

  createStockTakeStock() {
    this.stockTakeStockService.addStockTakeStock(this.stockTakeStockForm.value).subscribe({
      next: (result: any) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          this.back().then((navigated: boolean) => {
            if (navigated) {
              this.snackBar.open("Stock take completed", 'X', { duration: 5000 })
            }
          })
        }
        else {
          this.snackBar.open("Error completing stock take", 'X', { duration: 5000 })
        }
      }
    })
  }

  back() {
    return this.router.navigate(['/view-stock']);
  }
}
