import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClientOrderStockService } from 'src/app/services/client-stock-order.service';
import { AssignedPrinterService } from 'src/app/services/assigned-printer.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuditTrailService } from 'src/app/services/audit-trail.service';

@Component({
  selector: 'app-assign-printer-stock',
  templateUrl: './assign-printer-stock.component.html',
  styleUrls: ['./assign-printer-stock.component.scss'],
})
export class AssignPrinterStockComponent {
  clientOrderId!: number;
  clientId!: number;
  orderstock: any;
  clientName: string = '';
  printerModel: string = '';
  qtyPurchased: number = 0; // To store the quantity of printers purchased
  completedFormCount: number = 0; // To track how many times the form has been completed

  assignPrinterForm: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clientOrderStockService: ClientOrderStockService,
    private assignedPrinterService: AssignedPrinterService,
    private Fb: FormBuilder,
    private snackBar: MatSnackBar,
    private ATService: AuditTrailService) {
    this.route.params.subscribe((params) => {
      this.clientOrderId = +params['id'];
    });

    this.GetClientOrder();

    this.assignPrinterForm = this.Fb.group({
      serialNumber: ['', Validators.required],
      clientId: [0, Validators.required],
      printerModel: ['', Validators.required],
      printerStatusId: [0, Validators.required],
    });
  }

  GetClientOrder() {
    this.clientOrderStockService.getClientOrderStock(this.clientOrderId).subscribe((result: any) => {
      if (Array.isArray(result)) {
        // Filter stock items of the "Printer" category
        this.orderstock = result.filter((item: any) => {
          return item.stock.stockType.stockCategory.stockCategoryName === 'Printer';
        });

        // Now, the "orderstock" array contains only the stock items of the "Printer" category
        console.log(this.orderstock);

        // You can also access other properties from the filtered items, such as clientName and quantity purchased (qty)
        if (this.orderstock.length > 0) {
          this.clientId = this.orderstock[0].clientOrder.clientUser.clientId;
          this.clientName = this.orderstock[0].clientOrder.clientUser.client.clientName;
          this.printerModel = this.orderstock[0].stock.stockName;
          this.qtyPurchased = this.orderstock[0].qty;
          console.log(this.clientName);
        }
      }
    });
  }

  assign() {
    this.assignPrinterForm.setValue({
      serialNumber: this.assignPrinterForm.get('serialNumber')?.value,
      clientId: this.clientId,
      printerModel: this.printerModel,
      printerStatusId: 3,
    });

    // Simulate sending the form data to the server
    this.assignedPrinterService.addAssignedPrinter(this.assignPrinterForm.value).subscribe({
      next: (result) => {
        // Increase the completed form count when the form is successfully submitted
        this.completedFormCount++;

        // Clear the serial number control
        this.assignPrinterForm.get('serialNumber')?.reset();

        // Check if the completed form count equals the quantity purchased
        if (this.completedFormCount === this.qtyPurchased) {
          // If all forms are completed, navigate back to the "view-client-orders" page
          this.router.navigate(['/view-client-order']);
        }
      },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          // save audit trail
          this.ATService.trackActivity(`Printer ${this.assignPrinterForm.get('serialNumber')?.value} assigned`);

          // Increase the completed form count when the form is successfully submitted
          this.completedFormCount++;

          // Clear the serial number control
          this.assignPrinterForm.get('serialNumber')?.reset();

          // Check if the completed form count equals the quantity purchased
          if (this.completedFormCount === this.qtyPurchased) {
            // If all forms are completed, navigate back to the "view-client-orders" page
            this.router.navigate(['/view-client-order']);
          }
        } else {
          // save audit trail
          this.ATService.trackActivity(`Assigning printer ${this.assignPrinterForm.get('serialNumber')?.value} failed`);

          this.snackBar.open(`Failed to assign printer`, 'X', { duration: 5000 });
        }
      },
    });
  }

  back() {
    return this.router.navigate(['/view-client-order']);
  }
}
