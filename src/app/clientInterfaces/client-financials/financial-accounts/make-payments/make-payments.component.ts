import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LabourRate } from 'src/app/models/labourRate';
import { Markup } from 'src/app/models/markup';
import { Vat } from 'src/app/models/vat';
import { Price } from 'src/app/models/prices';
import { PurchaseOrder } from 'src/app/models/purchaseOrder';
import { PriceService } from 'src/app/services/price.service';
import { PurchaseOrderService } from 'src/app/services/purchase-order.service';
import { RepairStockService } from 'src/app/services/repair-stock.service';
import { RepairService } from 'src/app/services/repair.service';
import { GeneralServices } from 'src/app/services/general-services';
import { HttpClient } from '@angular/common/http';
import { Md5 } from 'ts-md5';
import { environment } from '../../../../resources/environments/environment';
declare function payfast_do_onsite_payment(param1: any, callback: any): any;

@Component({
  selector: 'app-make-payments',
  templateUrl: './make-payments.component.html',
  styleUrls: ['./make-payments.component.scss']
})
export class MakePaymentsComponent implements OnInit {
  data: any[] = [];
  purchaseOrderId!: number;
  VATExclusiveTotal: number = 0;

  VAT!: Vat;
  markup!: Markup;
  labourRate!: LabourRate;

  constructor(private purchaseOrderService: PurchaseOrderService,
    private repairStockService: RepairStockService,
    private generalService: GeneralServices,
    private priceService: PriceService,
    private repairService: RepairService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private httpComms: HttpClient,
    private router: Router) {
    this.initializeProperties();
    this.getPurchaseOrders();
  }

  async ngOnInit(): Promise<void> {
    this.labourRate = await this.generalService.getLabourRate()
    this.VAT = await this.generalService.getVat()
    this.markup = await this.generalService.getMarkup()
  }

  // for if ngOninit doesnt work
  private async initializeProperties() {
    try {
      this.labourRate = await this.generalService.getLabourRate()
      this.VAT = await this.generalService.getVat();
      this.markup = await this.generalService.getMarkup();
    } catch (error) {
      console.error("Error initializing properties:", error);
    }
  }

  async getPurchaseOrders() {
    const result: PurchaseOrder[] = await firstValueFrom(this.purchaseOrderService.getPurchaseOrders());
    const filteredData = result.filter(x => x.repair.repairStatusId == 7);

    for (const pOrder of filteredData) {
      let PO_Data: any = pOrder;

      const repairStock: any[] = await firstValueFrom(this.repairStockService.getRepairStocks());

      let RepairVATAmount: number = 0;
      let totExVat: number = 0;

      for (const repairs of repairStock.filter(x => x.purchaseOrderId == pOrder.purchaseOrderId)) {
        const stockPrices: any[] = await firstValueFrom(this.priceService.getPrices());

        const filteredPrices = stockPrices.filter(price => price.stockId === repairs.stockId);
        const mostRecentPrice: Price = filteredPrices[filteredPrices.length - 1];

        totExVat += ((mostRecentPrice?.price * repairs.qty) + (mostRecentPrice?.price * repairs.qty) * this.markup?.markupPercent);
        RepairVATAmount += totExVat * this.VAT.vatPercent;

        repairs.price = mostRecentPrice;
        PO_Data.TotalExVat = totExVat + (this.labourRate?.labourRate * PO_Data.repairTime);
        PO_Data.vatTotal = RepairVATAmount;
      }
      this.data.push(PO_Data);
    }
  }

  makePayment(pOrder: any) {
    pOrder.repair.repairStatusId = 8;
    this.repairService.editRepair(pOrder.repairId, pOrder.repair).subscribe({
      next: (result: any) => { },
      error: async (response: HttpErrorResponse) => {
        if (response.status == 200) {
          console.log("Make Payment Successful")
          // await this.doOnSitePayment(pOrder)
        }
        else {
          this.snackBar.open(response.error + " Please check connection", 'X', { duration: 5000 });
        }
      }
    })
  }

  getRepairName(): string {
    return "Repair Payment @ " + Date.now();
  }

  getSignature(data: Map<string, string>): string {
    let tmp = new URLSearchParams();
    data.forEach((v, k) => {
      tmp.append(k, v)
    });
    let queryString = tmp.toString();
    let sig = Md5.hashStr(queryString);
    return sig;
  }

  async doOnSitePayment(pOrder: any) {
    const total = (pOrder.TotalExVat + pOrder.vatTotal).toFixed(2);

    let onSiteUserData = new Map<string, string>();
    onSiteUserData.set("merchant_id", "10030440")
    onSiteUserData.set("merchant_key", "q43dsfl4me85n")

    onSiteUserData.set('return_url', window.location.origin + '/success')
    onSiteUserData.set('cancel_url', window.location.origin + '/cancel')

    onSiteUserData.set("email_address", 'test@user.com');

    onSiteUserData.set("amount", total.toString());
    onSiteUserData.set("item_name", this.getRepairName());

    onSiteUserData.set('passphrase', 'stockablemoney');

    let signature = this.getSignature(onSiteUserData);
    onSiteUserData.set('signature', signature);


    let formData = new FormData();
    onSiteUserData.forEach((val, key) => {
      formData.append(key, val);
    });

    let response = await fetch(environment.payfastOnsiteEndpoint, {
      method: 'POST',
      body: formData,
      redirect: 'follow'
    });

    let respJson = await response.json();
    console.log(respJson)

    let uuid = respJson['uuid'];
    payfast_do_onsite_payment({ 'uuid': uuid }, async (res: any) => {
      if (res == true) {
        this.makePayment(pOrder)
        this.router.navigate(['success'], { state: { fromMakePaymentComponent: true } })
      }
      else {
        this.router.navigate(['/cancel'], { state: { fromRepairPaymentComponent: true } })
      }
    });
  }

  doFormPayment(pOrder: any) {
    let onSiteUserData = new Map<string, string>();
    onSiteUserData.set("merchant_id", "10030440")
    onSiteUserData.set("merchant_key", "q43dsfl4me85n")

    onSiteUserData.set('return_url', window.location.origin + '/success')
    onSiteUserData.set('cancel_url', window.location.origin + '/cancel')

    onSiteUserData.set("email_address", 'test@user.com');

    onSiteUserData.set("amount", (pOrder.TotalExVat + pOrder.vatTotal).toString());
    onSiteUserData.set("item_name", this.getRepairName());

    onSiteUserData.set('passphrase', 'stockablemoney');

    let signature = this.getSignature(onSiteUserData);
    onSiteUserData.set('signature', signature);

    let autoPaymentForm = this.fb.group(onSiteUserData);

    this.httpComms.post('https://sandbox.payfast.co.za/eng/process', onSiteUserData).subscribe(resp => {
      console.log(resp);
    });
  }

  back() {
    return this.router.navigate(['financial-account']);
  }
}
