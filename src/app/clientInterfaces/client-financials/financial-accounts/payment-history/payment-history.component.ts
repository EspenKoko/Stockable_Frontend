import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ClientOrder } from 'src/app/models/clientOrders';
import { ClientUser } from 'src/app/models/clientUsers';
import { ClientOrderService } from 'src/app/services/client-order.service';
import { ClientUserService } from 'src/app/services/client-user.service';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss']
})
export class PaymentHistoryComponent implements OnInit {
  data: ClientOrder[] = []
  searchTerm: string = '';

  constructor(private clientOrderService: ClientOrderService,
    private clientUserService: ClientUserService,
    private router: Router) {
  }
  
  async ngOnInit(): Promise<void> {
    await this.getReceipts()
  }

  //get clientUser to filter payment history by
  async getClientUser(): Promise<ClientUser> {
    const Token: any = JSON.parse(localStorage.getItem("Token") || '{}');
    const result: ClientUser[] = await firstValueFrom(this.clientUserService.getClientUsers());

    // Retrieve the Employee with the same user ID as the current user
    const clientUserData = result.filter(clu => clu.userId === Token.id);
    const clientUser: ClientUser = clientUserData[0];

    return clientUser;
  }

  async getReceipts() {
    const clu = await this.getClientUser();

    this.clientOrderService.getClientOrders().subscribe((result: ClientOrder[]) => {
      this.data = result.filter(x => x.clientUser.clientId == clu?.clientId);
    })
  }

  getReceipt() {
    if (this.searchTerm.length > 0 && this.searchTerm !== '') {
      this.clientOrderService.getClientOrders().subscribe((result: ClientOrder[]) => {
        this.data = result.filter(x => x.clientInvoice.clientInvoiceNumber.toLowerCase().includes(this.searchTerm.toLowerCase()));
      })
    }
    else {
      this.getReceipts();
    }
  }

  back() {
    return this.router.navigate(['financial-account'])
  }
}
