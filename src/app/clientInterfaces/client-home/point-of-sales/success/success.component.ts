import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { POSOrganiserService } from 'src/app/services/POS-Organiser.service';
import { AuditTrailService } from 'src/app/services/audit-trail.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {
  navigated: boolean = false;
  message: string = "Transaction completed"
  returnUrl: string = "acs-store";

  constructor(private cartManager: POSOrganiserService,
    private ATService: AuditTrailService,
    private router: Router) {
    const navigationState = this.router.getCurrentNavigation()?.extras.state;
    if (navigationState && navigationState['fromMakePaymentComponent']) {
      // Navigated from the MakePaymentComponent
      console.log('Navigated from MakePaymentComponent');
      // save audit trail
      this.ATService.trackActivity("Repair payment made");

      this.message = "Repair payment Successful";
      this.returnUrl = "make-payment";
    } else {
      // Navigated from a different URL
      console.log('Navigated from a different URL');
      // save audit trail
      this.ATService.trackActivity(`Store payment made`);

      this.cartManager.clearCart();
    }
  }

  ngOnInit(): void {
  }

  back() {
    return this.router.navigate([this.returnUrl])
  }
}
