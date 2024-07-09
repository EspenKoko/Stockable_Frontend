import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { firstValueFrom, forkJoin, map } from 'rxjs';
import { Price } from 'src/app/models/prices';
import { StockSupplierOrder } from 'src/app/models/stockSupplierOrder';
import { SupplierOrder } from 'src/app/models/supplierOrders';
import { Vat } from 'src/app/models/vat';
import { ApiService } from 'src/app/services/api-urls';
import { PriceService } from 'src/app/services/price.service';
import { SupplierOrderService } from 'src/app/services/supplier-order.service';
import { StockSupplierOrderService } from 'src/app/services/supplier-stock-order.service';
import { StockSupplierOrderVM } from 'src/app/viewModels/StockSupplierOrderVM';
import { StockOrderComponent } from '../stock-order.component';
import { GeneralServices } from 'src/app/services/general-services';
import { Supplier } from 'src/app/models/suppliers';
import { SupplierService } from 'src/app/services/supplier.service';

@Component({
  selector: 'app-place-stock-order',
  templateUrl: './place-stock-order.component.html',
  styleUrls: ['./place-stock-order.component.scss']
})
export class PlaceStockOrderComponent implements OnInit {
  data: Supplier[] = [];
  consumableData: any[] = [];
  partData: any[] = [];
  printerData: any[] = [];

  consumables: any[] = [];
  printers: any[] = [];
  parts: any[] = [];

  consumableTotal: number = 0;
  partTotal: number = 0;
  printerTotal: number = 0;

  grandTotal: number = 0;
  grandTotalVat: number = 0;
  VAT!: Vat;

  supplierOrderForm: FormGroup;
  supplierOrderId: number;
  supplierOrderData: any;

  constructor(private service: SupplierOrderService,
    private stockSupplierOrderService: StockSupplierOrderService,
    private priceService: PriceService,
    private supplierService: SupplierService,
    private generealService: GeneralServices,
    private router: Router,
    private apiService: ApiService,
    private fb: FormBuilder,
    private stockOrderComponent: StockOrderComponent,
    private snackBar: MatSnackBar) {
    this.supplierOrderId = JSON.parse(localStorage.getItem("SupplierOrderId")!)

    this.supplierOrderForm = this.fb.group({
      employeeId: [, Validators.required],
      supplierId: [, Validators.required],
      supplierOrderStatusId: [, Validators.required],
      date: [, Validators.required]
    })
  }

  async ngOnInit(): Promise<void> {
    this.getStockSupplierOrders()
    this.getSuppliers()

    this.VAT = await this.generealService.getVat();

    this.service.getSupplierOrder(this.supplierOrderId).subscribe(result => {
      this.supplierOrderData = result;
      this.supplierOrderForm.patchValue({
        employeeId: this.supplierOrderData.employeeId,
        supplierOrderStatusId: this.supplierOrderData.supplierOrderStatusId,
        supplierId: this.supplierOrderData.supplierId,
        date: this.supplierOrderData.date,
      });
    })
  }

  getSuppliers() {
    this.supplierService.getSuppliers().subscribe((result: any[]) => {
      // stores supplier data in an array for displaying
      this.data = result;
    })
  }

  //changes statuses thus ending order use case
  async placeOrder() {
    const employee = this.stockOrderComponent.GetEmployee()
    this.supplierOrderForm.setValue({
      supplierId: this.supplierOrderForm.get('supplierId')?.value,
      supplierOrderStatusId: 2,
      employeeId: (await employee).employeeId,
      date: new Date(),
    });

    this.service.editSupplierOrder(this.supplierOrderId, this.supplierOrderForm.value).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          // for presentation purposes will redirect to dashboard on submit
          this.router.navigate(['admin-dashboard']).then((navigated: boolean) => {
            // this.back().then((navigated: boolean) => {
            if (navigated) {
              this.snackBar.open(`Stock order placed`, 'X', { duration: 5000 });
              localStorage.removeItem("SupplierOrderId");
            }
          })
        }
        else {
          this.snackBar.open(`Error Occured:` + response.error, 'X', { duration: 5000 });
        }
      }
    })
  }

  getStockSupplierOrders() {
    this.stockSupplierOrderService.getStockSupplierOrders().subscribe((result: StockSupplierOrder[]) => {
      let mostRecentOrder = result.filter(x => x.supplierOrder.supplierOrderStatus.supplierOrderStatusName == "Awaiting Confirmation"); // should only be one order in thoery

      this.consumableData = mostRecentOrder.filter(x => x.stock.stockType.stockCategory.stockCategoryName == "Consumable");
      this.partData = mostRecentOrder.filter(x => x.stock.stockType.stockCategory.stockCategoryName == "Part");
      this.printerData = mostRecentOrder.filter(x => x.stock.stockType.stockCategory.stockCategoryName == "Printer");

      // ###################
      // An array to hold the observables from getPrices() calls for consumables
      const consumablePriceObservables = this.consumableData.map((stock: any) => {
        return this.priceService.getPrices().pipe(
          map((result: any) => {
            const stockPrices: any[] = result;
            const filteredPrices = stockPrices.filter(price => price.stockId === stock.stockId);
            const mostRecentPrice: Price = filteredPrices[filteredPrices.length - 1];

            const consumables = new StockSupplierOrderVM(stock, mostRecentPrice);
            return consumables;
          })
        );
      });

      // Wait for all observables to complete using forkJoin
      forkJoin(consumablePriceObservables).subscribe((consumables: StockSupplierOrderVM[]) => {
        this.consumables = consumables;

        // Calculate the total price for consumables
        this.consumableTotal = this.consumables.reduce((total, consumable) => total + (consumable.spOrder.qty * consumable.price.price), 0);

        // Calculate the grand total
        this.grandTotalVat = (this.consumableTotal + this.partTotal + this.printerTotal) * this.VAT.vatPercent;
        this.grandTotal = this.grandTotalVat + this.consumableTotal + this.partTotal + this.printerTotal;
      });

      // ###################
      // An array to hold the observables from getPrices() calls for parts
      const partPriceObservables = this.partData.map((stock: any) => {
        return this.priceService.getPrices().pipe(
          map((result: any) => {
            const stockPrices: any[] = result;
            const filteredPrices = stockPrices.filter(price => price.stockId === stock.stockId);
            const mostRecentPrice: Price = filteredPrices[filteredPrices.length - 1];

            const parts = new StockSupplierOrderVM(stock, mostRecentPrice);
            return parts;
          })
        );
      });

      // Wait for all observables to complete using forkJoin
      forkJoin(partPriceObservables).subscribe((parts: StockSupplierOrderVM[]) => {
        this.parts = parts;

        // Calculate the total price for parts
        this.partTotal = this.parts.reduce((total, part) => total + (part.spOrder.qty * part.price.price), 0);

        // Calculate the grand total
        this.grandTotalVat = (this.consumableTotal + this.partTotal + this.printerTotal) * this.VAT.vatPercent;
        this.grandTotal = this.grandTotalVat + this.consumableTotal + this.partTotal + this.printerTotal;
      });

      // ###################
      // An array to hold the observables from getPrices() calls for printers
      const printerPriceObservables = this.printerData.map((stock: any) => {
        return this.priceService.getPrices().pipe(
          map((result: any) => {
            const stockPrices: any[] = result;
            const filteredPrices = stockPrices.filter(price => price.stockId === stock.stockId);
            const mostRecentPrice: Price = filteredPrices[filteredPrices.length - 1];

            const printers = new StockSupplierOrderVM(stock, mostRecentPrice);
            return printers;
          })
        );
      });

      // Wait for all observables to complete using forkJoin
      forkJoin(printerPriceObservables).subscribe((printers: StockSupplierOrderVM[]) => {
        this.printers = printers;

        // Calculate the total price for printers
        this.printerTotal = this.printers.reduce((total, printer) => total + (printer.spOrder.qty * printer.price.price), 0);

        // Calculate the grand total
        this.grandTotalVat = (this.consumableTotal + this.partTotal + this.printerTotal) * this.VAT.vatPercent;
        this.grandTotal = this.grandTotalVat + this.consumableTotal + this.partTotal + this.printerTotal;
      });
    });
  }

  //doesnt work but cool to have
  // ggetStockSupplierOrders() {
  //   this.stockSupplierOrderService.getStockSupplierOrders().subscribe((result: StockSupplierOrder[]) => {
  //     this.consumableData = result.filter(x => x.stock.stockType.stockCategory.stockCategoryName == "Consumable");
  //     this.partData = result.filter(x => x.stock.stockType.stockCategory.stockCategoryName == "Part")
  //     this.printerData = result.filter(x => x.stock.stockType.stockCategory.stockCategoryName == "Printer")

  //     // Process consumableData
  //     this.processData(this.consumableData, this.consumables);

  //     // Process partData
  //     this.processData(this.partData, this.parts);

  //     // Process printerData
  //     this.processData(this.printerData, this.printers);
  //   });
  // }

  // processData(data: any[], targetArray: any[]) {
  //   // An array to hold the observables from getPrices() calls
  //   const priceObservables = data.map((stock: any) => {
  //     return this.priceService.getPrices().pipe(
  //       map((result: any) => {
  //         const stockPrices: any[] = result;
  //         const filteredPrices = stockPrices.filter(price => price.stockId === stock.stockId);
  //         const mostRecentPrice: Price = filteredPrices[filteredPrices.length - 1];

  //         const item = new StockSupplierOrderVM(stock, mostRecentPrice);
  //         return item;
  //       })
  //     );
  //   });

  //   // Wait for all observables to complete using forkJoin
  //   forkJoin(priceObservables).subscribe((items: StockSupplierOrderVM[]) => {
  //     targetArray = items;

  //     // Calculate the total price for the current data
  //     const total = targetArray.reduce((acc, item) => acc + (item.spOrder.qty * item.price.price), 0);
  //     console.log(targetArray);

  //     // Set the corresponding total value based on the targetArray
  //     if (targetArray === this.consumables) {
  //       this.consumableTotal = total;
  //     } else if (targetArray === this.parts) {
  //       this.partTotal = total;
  //     } else if (targetArray === this.printers) {
  //       this.printerTotal = total;
  //     }
  //   });
  // }

  // ##################################
  //stock order item deletion section below
  selectedItems: StockSupplierOrderVM[] = [];

  toggleSelection(item: StockSupplierOrderVM) {
    if (this.isSelected(item)) {
      // If the item is already selected, remove it from the selection
      this.selectedItems = this.selectedItems.filter(selectedItem => selectedItem !== item);
    } else {
      // If the item is not selected, add it to the selection
      this.selectedItems.push(item);
    }
  }

  //delete selected stock items
  isSelected(item: StockSupplierOrderVM): boolean {
    // Check if the item is in the selectedItems array
    return this.selectedItems.includes(item);
  }

  storeSelection(stockOrder: StockSupplierOrderVM) {
    let deleteList: any[] = []
    deleteList.push(stockOrder.spOrder.stockId)
    console.log(deleteList)
  }

  deleteSelection(event: Event) {
    // event.preventDefault()
    const idsToDelete = this.selectedItems.map(item => item.spOrder.stockId);
    this.Delete([1, 2]);// must be removed and fixed in the html when api is updated
    // this.Delete(idsToDelete);
  }

  Delete(ids: Number[]) {
    for (const id of ids) {
      this.stockSupplierOrderService.deleteStockSupplierOrder(id).subscribe({
        next: (result) => {
          // After deleting, you can remove the items from consumables, parts, or printers arrays as well
          this.consumables = this.consumables.filter(item => !ids.includes(item.spOrder.stockId));
          this.parts = this.parts.filter(item => !ids.includes(item.spOrder.stockId));
          this.printers = this.printers.filter(item => !ids.includes(item.spOrder.stockId));
        },
        error: (response: HttpErrorResponse) => {
          this.apiService.handleApiDeleteReponse(response);
        }
      });
    }
    // Clear the selectedItems array after deletion
    this.selectedItems = [];
  }

  back() {
    return this.router.navigate(['/stock-order']);
  }
}
