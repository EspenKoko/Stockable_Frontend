import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, firstValueFrom, of } from 'rxjs';
import { Employee } from 'src/app/models/employees';
import { Stock } from 'src/app/models/stocks';
import { SupplierOrder } from 'src/app/models/supplierOrders';
import { EmployeeService } from 'src/app/services/employee.service';
import { StockService } from 'src/app/services/stock.service';
import { SupplierOrderService } from 'src/app/services/supplier-order.service';
import { StockSupplierOrderService } from 'src/app/services/supplier-stock-order.service';

@Component({
  selector: 'app-create-manual-stock-order',
  templateUrl: './create-manual-stock-order.component.html',
  styleUrls: ['./create-manual-stock-order.component.scss']
})
export class CreateManualStockOrderComponent implements OnInit{
  title = "Stock";
  data: any[] = [];
  stockCategoryData: any[] = [];
  stockTypeData: any[] = [];
  navigated: boolean = false;

  addForm: FormGroup;
  supplierOrderForm: FormGroup;
  mostRecentSupplierOrder!: SupplierOrder;

  constructor(private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private service: StockService,
    private employeeService: EmployeeService,
    private supplierOrderService: SupplierOrderService,
    private stockSupplierOrderService: StockSupplierOrderService,
    private fb: FormBuilder) {

    const navigationState = this.router.getCurrentNavigation()?.extras.state;
    if (navigationState && navigationState['fromStockOrderComponent']) {
      // Navigated from the CreateStockComponent
      console.log('Navigated from CreateStockOrderComponent');
      this.navigated = true;
      this.service.getStock(+this.route.snapshot.params['id']).subscribe((result: any) => {
        this.stockToOrder(+this.route.snapshot.params['id']);
      })
    } else {
      // Navigated from a different URL
      console.log('Navigated from a different URL');
      this.GetStocks();
    }

    this.addForm = this.fb.group({
      stockId: [0, Validators.required],
      supplierOrderId: [0, Validators.required],
      qty: [0, [Validators.required, Validators.min(1)]],
    })

    this.supplierOrderForm = this.fb.group({
      employeeId: [0, Validators.required],
      supplierId: [0, Validators.required],
      supplierOrderStatusId: [0, Validators.required],
      date: [null, Validators.required],
    })
  }

  ngOnInit(): void {
    this.getSupplierOrder()
  }

  GetStocks() {
    this.service.getStocks().subscribe((result: Stock[]) => {
      //only show stock items that are not already on the stock order table
      this.data = result.filter(x => x.qtyOnHand > x.minStockThreshold);
    })
  }

  async stockToOrder(stockId: number) {
    let reorderList = await this.service.checkStockReorder();

    // Find the StockReorder object with the matching stockId
    const stockReorderItem = reorderList.find(item => item.stock.stockId === stockId);
    if (stockReorderItem) {
      // Set the found StockReorder item as the first index of the data property
      this.data[0] = stockReorderItem;
      this.addForm.get('stockId')?.setValue(stockReorderItem.stock.stockId)
      this.addForm.get('qty')?.setValue(stockReorderItem.stock.qtyOnHand)
    }
  }

  getSupplierOrder() {
    this.supplierOrderService.getSupplierOrders().pipe(
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
        console.log("Found existing order with Awaiting Confirmation status.");
      } else {
        console.log("No order with Awaiting Confirmation status found. Creating a new order.");
        this.createSupplierOrder();
      }
      this.addForm.get('supplierOrderId')?.setValue(this.mostRecentSupplierOrder.supplierOrderId);
      localStorage.setItem("SupplierOrderId", JSON.stringify(this.mostRecentSupplierOrder.supplierOrderId));
      console.log("Using form with supplierOrderId: " + this.mostRecentSupplierOrder.supplierOrderId, this.addForm.value);
    });
  }

  async createSupplierOrder() {
    let employee = await this.GetEmployee();
    this.supplierOrderForm.setValue({
      employeeId: employee.employeeId,
      supplierId: 1,
      supplierOrderStatusId: 1,
      date: new Date()
    });

    this.supplierOrderService.addSupplierOrder(this.supplierOrderForm.value).subscribe({
      next: (result: any) => {
        console.log("New supplier order created");
      },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          this.supplierOrderService.getSupplierOrders().subscribe((result: SupplierOrder[]) => {
            // Assign the most recent order with "Awaiting Confirmation" status
            const mostRecentOrder = result.find(order => order.supplierOrderStatusId == 1);
            if (mostRecentOrder) {
              this.mostRecentSupplierOrder = mostRecentOrder;
              console.log("Using newly created supplier order with awaiting confirmation status.", mostRecentOrder);
            }
            this.addForm.get('supplierOrderId')?.setValue(this.mostRecentSupplierOrder.supplierOrderId);
            localStorage.setItem("SupplierOrderId", JSON.stringify(this.mostRecentSupplierOrder.supplierOrderId));
            console.log("Using form with supplierOrderId: " + this.mostRecentSupplierOrder.supplierOrderId, this.addForm.value);
          });
        } else {
          this.snackBar.open(response.error, 'X', { duration: 5000 });
        }
      }
    });
  }

  // get employeeId to add to the supplierOrderForm
  async GetEmployee(): Promise<Employee> {
    const Token: any = JSON.parse(localStorage.getItem("Token") || '{}');
    const result: Employee[] = await firstValueFrom(this.employeeService.getEmployees());

    // Retrieve the Employee with the same user ID as the current user
    const employeeData = result.filter(emp => emp.userId === Token.id);
    const employee: Employee = employeeData[0];

    return employee;
  }

  manuallyAddStock() {
    console.log(this.addForm.value)
    if (this.addForm.get('qty')?.value > 0 && this.addForm.get('stockId')?.value > 0) {
      this.stockSupplierOrderService.addStockSupplierOrder(this.addForm.value).subscribe({
        next: (result) => { },
        error: (response: HttpErrorResponse) => {
          if (response.status == 200) {
            this.router.navigate(['place-stock-order'], { state: { fromStockComponent: true } }).then((navigated: boolean) => {
              if (navigated) {
                this.snackBar.open(`Stock order placed`, 'X', { duration: 5000 });
              }
            })
          }
          else (
            this.snackBar.open("Error Occured: Part already confirmed", 'X', { duration: 5000 })
          )
        }
      });
    } else {
      this.snackBar.open("Error Occured: Please select a valid part and positive quantity value", 'X', { duration: 5000 })
    }
  }

  back() {
    return this.router.navigate(['/stock-order'])
  }
}
