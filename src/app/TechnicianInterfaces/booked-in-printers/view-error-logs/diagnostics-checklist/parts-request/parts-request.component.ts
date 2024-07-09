import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, firstValueFrom, map } from 'rxjs';
import { PurchaseOrder } from 'src/app/models/purchaseOrder';
import { Repair } from 'src/app/models/repairs';
import { Stock } from 'src/app/models/stocks';
import { ErrorLogService } from 'src/app/services/error-log.service';
import { PurchaseOrderService } from 'src/app/services/purchase-order.service';
import { RepairStockService } from 'src/app/services/repair-stock.service';
import { RepairService } from 'src/app/services/repair.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-parts-request',
  templateUrl: './parts-request.component.html',
  styleUrls: ['./parts-request.component.scss']
})
export class PartsRequestComponent {

  stockData: any[] = [];
  data: any;
  date: Date = new Date;
  searchTerm!: string;
  repairTime: number = 1;

  purchaseOrderForm: FormGroup;

  repairStockForm: FormGroup;
  repairForm: FormGroup = new FormGroup({
    errorLogId: new FormControl(0),
    repairStatusId: new FormControl(0),
    employeeId: new FormControl(0)
  })
  partsList: any[] = [];

  static lsPartsName = "ls_parts";

  constructor(private stockService: StockService,
    private service: ErrorLogService,
    private purchaseOrderService: PurchaseOrderService,
    private repairStockService: RepairStockService,
    private repairService: RepairService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private fb: FormBuilder) {
    this.service.getErrorLog(+this.route.snapshot.params['id']).subscribe((result: any) => {
      this.data = result;
    })

    this.purchaseOrderForm = this.fb.group({
      purchaseOrderDate: [new Date(), Validators.required],
      purchaseOrderStatusId: [0, Validators.required],
      repairTime: [0, Validators.required],
      repairId: [0, Validators.required]
    })

    this.repairStockForm = this.fb.group({
      stockId: [0, Validators.required],
      repairId: [0, Validators.required],
      purchaseOrderId: [0, Validators.required],
      qty: [0, Validators.required],
    })

    this.getParts();

    //update second table
    let storedParts = localStorage.getItem(PartsRequestComponent.lsPartsName)
    if (storedParts) {
      this.partsList = JSON.parse(storedParts);
    }
  }

  //get all parts for table
  getParts() {
    this.stockService.getStocks().subscribe((result: Stock[]) => {
      //check qty before displaying in store
      for (const stock of result) {
        if (stock.qtyOnHand > 0) {
          this.stockData.push(stock)
        }
      }

      // stores stock based on the type "parts" data in an array for displaying
      this.stockData = this.stockData.filter(x => x.stockType.stockCategory.stockCategoryName == "Part");
    })
  }

  //get a single part for search
  getPart() {
    if (this.searchTerm.length !== 0 || this.searchTerm !== "") {
      this.stockService.getStockByName(this.searchTerm).subscribe((result: Stock[]) => {
        this.stockData = result;
      });
    }
    else {
      this.getParts();
    }
  }

  getPartsFromLocalStorage() {
    let storedParts = localStorage.getItem(PartsRequestComponent.lsPartsName);

    let lsParts = [];
    if (storedParts) {
      lsParts = JSON.parse(storedParts);
    }

    return lsParts
  }

  //using observables. refer to technical service report component for version using promises with employee
  getRepair(): Observable<Repair> {
    return this.repairService.getRepairs().pipe(
      map((result: Repair[]) => {
        let repairs = result.filter(x => x.errorLogId === this.data.errorLogId);
        return repairs[0];
      })
    );
  }

  async requestParts() {
    let storedParts = this.getPartsFromLocalStorage();
    let isSuccessful: boolean = false

    const repair = await firstValueFrom(this.getRepair());
    const repairId = repair?.repairId;

    this.generatePurchaseOrder(this.repairTime, repairId);

    const purchaseOrders = await firstValueFrom(this.purchaseOrderService.getPurchaseOrders());
    const mostRecentPurchaseOrder: PurchaseOrder = purchaseOrders[purchaseOrders.length - 1];

    for (let i = 0; i < storedParts.length; i++) {
      let element = storedParts[i];

      const stockId = element.stockId;
      const partQuantity = element.quantity;

      this.repairStockForm.setValue({
        stockId: stockId,
        repairId: repairId,
        purchaseOrderId: mostRecentPurchaseOrder.purchaseOrderId,
        qty: partQuantity,
      });

      try {
        const addResult = await firstValueFrom(this.repairStockService.addRepairStock(this.repairStockForm.value));
        isSuccessful = true;

        this.router.navigate(["technician-dashboard"]).then((navigated: Boolean) => {
          if (navigated) {
            localStorage.removeItem(PartsRequestComponent.lsPartsName);
            this.snackBar.open(`Parts have been requested and a purchase order has been created`, 'X', { duration: 5000 });
          }
        });
      } catch (error) {
        // Handle the error here if needed
        console.error(error)
      }
    }

    if (isSuccessful) {
      this.repairForm.get('repairStatusId')?.setValue(3);

      this.repairService.editRepair(repairId, this.repairForm.value).subscribe({
        next: (result) => {
        }, error: (response: HttpErrorResponse) => {
          if (response.status == 200) {
            console.log("Repair updated successfully");
          }
        }
      })
    }
  }

  generatePurchaseOrder(time: any, repairId: any) {
    if (time > 0) {
      this.purchaseOrderForm.setValue({
        purchaseOrderDate: new Date(),
        purchaseOrderStatusId: 1,
        repairTime: time,
        repairId: repairId
      })

      this.purchaseOrderService.addPurchaseOrder(this.purchaseOrderForm.value).subscribe({
        next: (result: any) => {

        }, error: (reponse: HttpErrorResponse) => {
          if (reponse.status == 200) {
            console.log("Purchase order created")
          }
          else {
            console.log("Purchase order creation failed")
          }
        }
      })
    }
    else {
      this.snackBar.open("Please enter a valid time with a positive value", 'X', { duration: 5000 });
    }
  }

  addPart(stockItem: Stock) {
    let parts = this.getPartsFromLocalStorage()

    // Check if the stockItem is already in the parts array
    const existingPart = parts.find((part: Stock) => part.stockId === stockItem.stockId);

    if (existingPart) {
      // If the stockItem already exists in the partsList, increase the quantity by 1
      existingPart.quantity++;
    } else {
      // If the stockItem does not exist in the partsList, add it with quantity 1
      parts.push({ ...stockItem, quantity: 1 });
    }

    localStorage.setItem(PartsRequestComponent.lsPartsName, JSON.stringify(parts));

    // Update the second table
    this.partsList = [...parts];
  }

  removePart(stockItem: Stock) {
    let parts = this.getPartsFromLocalStorage();

    // Check if the stockItem is already in the partsList
    const existingPart = parts.find((part: Stock) => part.stockId === stockItem.stockId);

    if (existingPart) {
      // If the stockItem already exists in the partsList, decrease the quantity by 1
      existingPart.quantity--;
      if (existingPart.quantity < 1) {
        for (var idx = 0; idx < parts.length; idx++) {
          if (parts[idx].stockId == stockItem.stockId) {
            parts.splice(idx, 1);
            break;
          }
        }
      }
    }

    localStorage.setItem(PartsRequestComponent.lsPartsName, JSON.stringify(parts))

    // Create a new array reference after modifying the partsList array
    this.partsList = [...parts];
  }

  back() {
    return this.router.navigate(['diagnostic-checklist/' + this.data.errorLogId], { state: { fromDiagnosticChecklistComponent: true } })
  }
}
