import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { POSOrganiserService } from 'src/app/services/POS-Organiser.service';
import { environment } from '../../../../resources/environments/environment';
declare let Square : any;

@Component({
  selector: 'app-squarecheckout',
  templateUrl: './squarecheckout.component.html',
  styleUrls: ['./squarecheckout.component.scss']
})
export class SquarecheckoutComponent implements OnInit {

  appId : string = environment.squareApplicationId;
  locationId : string = environment.squareLocationId;
  baseEndpoint : string = environment.squareEndpoint;
  card : any;

  constructor(private pageRouter : Router, private cartManager : POSOrganiserService) { 

  }

  async ngOnInit(): Promise<void> {

    const payments = Square.payments(this.appId, this.locationId);
    this.card = await payments.card();
    this.card.attach('#card-container');
  }

  async onCheckout() {
    try {
      let tokResp = await this.card.tokenize()
      this.doOnSitePayment(tokResp);
    }
    catch (e) {
      console.error(e);
    }

  }

  //https://developer.squareup.com/explorer/square/payments-api/create-payment?env=sandbox&appId=sq0idp-q5eD7Vs5yNKv_i6nJcbTUA&prefill=create-payment
  async doOnSitePayment(cardData : any) {
    
    let idemK = cardData.idempotencyKey || 'adsadsadasdadsdssd';

    let paymentData = {
      idempotency_key: idemK,
      locationId: this.locationId,
      source_id: cardData.token,
      amount_money : {
        amount : this.cartManager.getTotalCostOfOrdersInCart(),
        currency : 'USD',
        label : this.cartManager.getCartOrderName()
      },
      verificationToken: cardData.verificationToken
    };

    const paymentResponse = await fetch(this.baseEndpoint+'/payments', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer EAAAELK9muY7VNHiyGPITTPkuGhorj8AFxL5qu4ReDRDWnJVFDxOKktzNBjqb9Xo',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    });

    if (paymentResponse.ok) {
      this.pageRouter.navigate(['/success'])
    } else {
      console.log(`Cannot pay with Square. Error is ${JSON.stringify(paymentData)}`);
    }
  }

}
