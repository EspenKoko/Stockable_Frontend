import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { RepairStockService } from 'src/app/services/repair-stock.service';
import { StockService } from 'src/app/services/stock.service';
import { RepairService } from 'src/app/services/repair.service';
import { AuditTrailService } from 'src/app/services/audit-trail.service';

@Component({
  selector: 'app-view-parts-request',
  templateUrl: './view-parts-request.component.html',
  styleUrls: ['./view-parts-request.component.scss']
})
export class ViewPartsRequestComponent {
  data: any;
  repairData: any;
  printerSerialNumber: string = "";
  repairId: number = 0;
  stockItem: any;
  isButtonDisabled: boolean[] = [];
  addForm: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private RepairStockService: RepairStockService,
    private RepairService: RepairService,
    private stockService: StockService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private ATService: AuditTrailService) {
    this.addForm = this.fb.group({
      qtyOnHand: [null, Validators.required],
    });

    this.getPartsRequest();
  }

  getPartsRequest() {
    this.RepairStockService.getRepairStock(+this.route.snapshot.params['id']).subscribe((result: any) => {
      this.data = result;
      this.printerSerialNumber = result[0].repair.errorLog.assignedPrinter.serialNumber;
      this.repairId = result[0].repairId;
      this.repairData = result[0].repair;
      console.log(this.data);

      // Update the bookedOutItems array based on the data
      this.isButtonDisabled = this.data.map(() => false);
    });
  }

  bookOutPart(stockId: number, quantity: number, index: number) {
    if (this.isButtonDisabled[index]) {
      return;
    }

    this.stockService.getStock(stockId).subscribe((result: any) => {
      this.stockItem = result;

      if (this.stockItem.qtyOnHand - quantity < 0) {
        this.snackBar.open(`Not enough stock. Please Order more.`, 'X', { duration: 5000 });
      } else {
        this.stockItem.qtyOnHand = this.stockItem.qtyOnHand - quantity;

        this.stockService.editStock(stockId, this.stockItem).subscribe({
          next: (result) => {
            // Handle success
            this.isButtonDisabled[index] = true;
          },
          error: (response: HttpErrorResponse) => {
            if (response.status == 200) {
              this.isButtonDisabled[index] = true;
              // save audit trail
              this.ATService.trackActivity(`${this.stockItem} booked out for printer "${this.printerSerialNumber}"`);

              this.snackBar.open(`Part(s) Booked Out`, 'X', { duration: 5000 });
            } else {
              // save audit trail
              this.ATService.trackActivity(`Failed to book out ${this.stockItem} for printer "${this.printerSerialNumber}"`);

              this.snackBar.open(`Failed to book out stock`, 'X', { duration: 5000 });
            }
          }
        });
      }
    });
  }

  back() {
    return this.router.navigate(["view-parts-requests"]);
  }

  Complete() {
    this.repairData.repairStatusId = 6;
    this.RepairService.editRepair(this.repairId, this.repairData).subscribe({
      next: (result) => {
      },
      error: (response: HttpErrorResponse) => {
        console.log(response);
        if (response.status == 200) {
          this.back().then((navigated: boolean) => {
            if (navigated) {
              this.snackBar.open(`Part(s) Compiled`, 'X', { duration: 5000 });
            }
          });
        }
        else {
          this.snackBar.open(`Failed to complete`, 'X', { duration: 5000 });
        }
      }
    })
  }
}

