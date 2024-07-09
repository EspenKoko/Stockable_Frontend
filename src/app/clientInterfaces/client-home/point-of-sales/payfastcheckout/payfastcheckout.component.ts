import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5';
import { FormBuilder } from '@angular/forms'
import { POSOrganiserService } from 'src/app/services/POS-Organiser.service';
import { environment } from '../../../../resources/environments/environment';
import { CheckoutComponent } from '../cart/checkout/checkout.component';
declare function payfast_do_onsite_payment(param1 : any, callback: any): any;

@Component({
  selector: 'app-payfastcheckout',
  templateUrl: './payfastcheckout.component.html',
  styleUrls: ['./payfastcheckout.component.scss']
})
export class PayfastcheckoutComponent implements OnInit {

  constructor(private httpComms : HttpClient,
    private pageRouter : Router,
    private cartManager : POSOrganiserService,
    private checkoutComponent: CheckoutComponent,
    private formBuilder: FormBuilder) {
    
  }

  ngOnInit(): void {

  }

  getSignature(data : Map<string, string>) : string {
    let tmp = new URLSearchParams();
    data.forEach((v, k)=> {
      tmp.append(k, v)
    });
    let queryString = tmp.toString();
    let sig = Md5.hashStr(queryString);
    return sig;
  }

  async doOnSitePayment() {
    let onSiteUserData = new Map<string, string>();
    onSiteUserData.set("merchant_id", "10030440")
    onSiteUserData.set("merchant_key", "q43dsfl4me85n")

    onSiteUserData.set('return_url', window.location.origin + '/success')
    onSiteUserData.set('cancel_url', window.location.origin + '/cancel')

    onSiteUserData.set("email_address", 'test@user.com');
    
    onSiteUserData.set("amount", this.cartManager.getTotalCostOfOrdersInCart().toFixed(2).toString());
    onSiteUserData.set("item_name", this.cartManager.getCartOrderName());

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
    payfast_do_onsite_payment({'uuid': uuid},  async (res: any) => {
      if (res == true) {
        await this.checkoutComponent.checkout();

        this.pageRouter.navigate(['/success'])
      }
      else {
        this.pageRouter.navigate(['/cancel'])
      }
    });
  }

  doFormPayment() {
    let onSiteUserData = new Map<string, string>();
    onSiteUserData.set("merchant_id", "10030440")
    onSiteUserData.set("merchant_key", "q43dsfl4me85n")

    onSiteUserData.set('return_url', window.location.origin + '/success')
    onSiteUserData.set('cancel_url', window.location.origin + '/cancel')

    onSiteUserData.set("email_address", 'test@user.com');
    
    onSiteUserData.set("amount", this.cartManager.getTotalCostOfOrdersInCart().toString());
    onSiteUserData.set("item_name", this.cartManager.getCartOrderName());

    onSiteUserData.set('passphrase', 'stockablemoney');

    let signature = this.getSignature(onSiteUserData);
    onSiteUserData.set('signature', signature);

    let autoPaymentForm = this.formBuilder.group(onSiteUserData);
    
    this.httpComms.post('https://sandbox.payfast.co.za/eng/process', onSiteUserData).subscribe(resp => {
      console.log(resp);
    });
  }

}
