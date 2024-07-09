import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { StockService } from 'src/app/services/stock.service';
import { SupplierOrderService } from 'src/app/services/supplier-order.service';
import { Stock } from 'src/app/models/stocks';
import { StockReorder } from 'src/app/viewModels/stockReorderVM';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, firstValueFrom, of } from 'rxjs';
import { SupplierOrder } from 'src/app/models/supplierOrders';
import { Employee } from 'src/app/models/employees';
import { EmployeeService } from 'src/app/services/employee.service';
import { StockSupplierOrderService } from 'src/app/services/supplier-stock-order.service';

//needs attention
@Component({
  selector: 'app-stock-order',
  templateUrl: './stock-order.component.html',
  styleUrls: ['./stock-order.component.scss']
})
export class StockOrderComponent implements OnInit {
  title = "Stock Order";
  searchError!: string

  data: any[] = [];
  searchTerm!: string;

  //automatic reorder
  //Total: number = 0; // does not work - why?
  reorderList: StockReorder[] = [];
  addForm: FormGroup;

  supplierOrderForm: FormGroup;
  mostRecentSupplierOrder!: SupplierOrder;

  constructor(private service: SupplierOrderService,
    private stockSupplierOrderService: StockSupplierOrderService,
    private employeeService: EmployeeService,
    private router: Router,
    private snackBar: MatSnackBar,
    public stockService: StockService,
    private fb: FormBuilder) {

    this.addForm = this.fb.group({
      stockId: [0, Validators.required],
      supplierOrderId: [0, Validators.required],
      qty: [0, Validators.required],
    })

    this.supplierOrderForm = this.fb.group({
      employeeId: [0, Validators.required],
      supplierId: [0, Validators.required],
      supplierOrderStatusId: [0, Validators.required],
      date: [null, Validators.required],
    })
  }

  ngOnInit(): void {
    this.stockToOrder()
    this.getSupplierOrder()
  }

  //automatic reorder
  async stockToOrder() {
    this.reorderList = await this.stockService.checkStockReorder();

    // does not work - why?
    // this.Total = this.stockService.getTotal();
  }

  getSupplierOrder() {
    this.service.getSupplierOrders().pipe(
      catchError(async (error) => {
        if (error.status === 404) {
          console.log("No existing supplier orders found. Creating a new record.");
          await this.createSupplierOrder();
        } else {
          console.error(error);
        }
        return of([]); // Return an empty array to continue with the rest of the logic
      })
    ).subscribe((result: SupplierOrder[]) => {
      // Check if there is an order with the status "Awaiting Confirmation"
      const awaitingConfirmationOrder = result.find(order => order.supplierOrderStatusId == 1);

      if (awaitingConfirmationOrder) {
        this.mostRecentSupplierOrder = awaitingConfirmationOrder;
        console.log("Found existing order with Awaiting Confirmation status: ", this.mostRecentSupplierOrder);
        localStorage.setItem("SupplierOrderId", JSON.stringify(this.mostRecentSupplierOrder.supplierOrderId));
        console.log("Using form with supplierOrderId: " + this.mostRecentSupplierOrder.supplierOrderId, this.addForm.value);
      } else {
        console.log("No order with Awaiting Confirmation status found. Creating a new order.");
        this.createSupplierOrder();
      }
    });
  }

  async createSupplierOrder() {
    let employee = await this.GetEmployee();
    this.supplierOrderForm.setValue({
      employeeId: employee.employeeId,
      supplierId: 1,
      supplierOrderStatusId: 1,
      date: new Date(),
    });

    this.service.addSupplierOrder(this.supplierOrderForm.value).subscribe({
      next: (result: any) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          console.log("New order created")
          this.service.getSupplierOrders().subscribe((result: SupplierOrder[]) => {
            // Assign the most recent order with "Awaiting Confirmation" status
            const mostRecentOrder = result.find(order => order.supplierOrderStatusId == 1);
            if (mostRecentOrder) {
              this.mostRecentSupplierOrder = mostRecentOrder;
              console.log("Using newly created supplier order with awaiting confirmation status.", mostRecentOrder);
            }

            localStorage.setItem("SupplierOrderId", JSON.stringify(this.mostRecentSupplierOrder.supplierOrderId));
            console.log("Using form with supplierOrderId: " + this.mostRecentSupplierOrder.supplierOrderId, this.addForm.value);
          });
        } else {
          this.snackBar.open(response.error, 'X', { duration: 5000 });
        }
      }
    });
  }

  //get employeeId to add to the supplierOrderForm
  async GetEmployee(): Promise<Employee> {
    const Token: any = JSON.parse(localStorage.getItem("Token") || '{}');
    const result: Employee[] = await firstValueFrom(this.employeeService.getEmployees());

    // Retrieve the Employee with the same user ID as the current user
    const employeeData = result.filter(emp => emp.userId === Token.id);
    const employee: Employee = employeeData[0];

    return employee;
  }

  //search table
  getStockItem() {
    if (this.searchTerm.length > 0) {
      this.reorderList = this.reorderList.filter(x => x.stock.stockName.toLowerCase().includes(this.searchTerm.toLowerCase()))
    }
    else {
      this.stockToOrder()
    }
  }

  //add stock in current component
  confirm(stockVM: StockReorder) {
    this.addForm.setValue({
      stockId: stockVM.stock.stockId,
      supplierOrderId: this.mostRecentSupplierOrder.supplierOrderId,
      qty: stockVM.stockReoderQuantity,
    })

    this.stockSupplierOrderService.addStockSupplierOrder(this.addForm.value).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          this.showSnackbar('Stock Order Confirmed');
        }
        else (
          this.snackBar.open("Error Occured: Part already confirmed", 'X', { duration: 5000 })
        )
      }
    });
  }

  showSnackbar(message: string) {
    const snackBarRef = this.snackBar.open(message, 'View All Orders', {
      duration: 3000,
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar'] // Optional custom CSS class for styling
    });
    snackBarRef.onAction().subscribe(() => {
      this.router.navigate(['/place-stock-order']);
    });
    snackBarRef.afterDismissed().subscribe(() => {
      // Optional code to run after the snackbar is dismissed
    });
  }

  updateStock(id: number) {
    this.router.navigate(['create-mso/' + id], { state: { fromStockOrderComponent: true } })
  }

  back() {
    return this.router.navigate(['/stock-management']);
  }
}
