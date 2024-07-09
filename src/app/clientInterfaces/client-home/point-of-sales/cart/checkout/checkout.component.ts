import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, firstValueFrom, lastValueFrom, map, of } from 'rxjs';
import { ClientInvoice } from 'src/app/models/clientInvoices';
import { ClientUser } from 'src/app/models/clientUsers';
import { PaymentType } from 'src/app/models/paymentType';
import { Stock } from 'src/app/models/stocks';
import { POSOrganiserService } from 'src/app/services/POS-Organiser.service';
import { ClientInvoiceService } from 'src/app/services/client-invoice.service';
import { ClientOrderService } from 'src/app/services/client-order.service';
import { ClientOrderStockService } from 'src/app/services/client-stock-order.service';
import { ClientUserService } from 'src/app/services/client-user.service';
import { PaymentTypeService } from 'src/app/services/payment-method.service';
import { StockService } from 'src/app/services/stock.service';
import { CartStock } from 'src/app/viewModels/cartVM.model';
import { Markup } from 'src/app/models/markup';
import { Vat } from 'src/app/models/vat';
import { GeneralServices } from 'src/app/services/general-services';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  markup!: Markup;
  VAT!: Vat;

  Token: any;

  ordersInCart: CartStock[] = [];
  totalCostOfOrdersInCart: number = 0;
  printersToAssigned: any[] = []; // type stock

  paymentTypes: any[] = [];
  purchaserName: string = '';
  invoiceForm: FormGroup;

  clientOrderForm: FormGroup;
  clientOrderStockForm: FormGroup;
  addPrinterForm: FormGroup;

  constructor(public cartManager: POSOrganiserService,
    private stockService: StockService,
    private clientInvoiceService: ClientInvoiceService,
    private clientUserService: ClientUserService,
    private clientOrderService: ClientOrderService,
    private clientOrderStockService: ClientOrderStockService,
    private paymentTypeService: PaymentTypeService,
    private generalService: GeneralServices,
    private snackBar: MatSnackBar,
    private Fb: FormBuilder) {
    this.Token = JSON.parse(localStorage.getItem("Token")!)
    this.purchaserName = this.Token.firstName;

    this.initializeProperties();
    this.getPaymentTypes();
    this.loadSubscriptions();

    cartManager.cartProductsNumberDS.subscribe(num => {
      this.loadSubscriptions();
    });

    this.invoiceForm = this.Fb.group({
      clientInvoiceNumber: this.generalService.generateId(),
      clientInvoiceDate: new Date()
    })

    this.clientOrderForm = this.Fb.group({
      clientOrderStatusId: [0, Validators.required],
      clientInvoiceId: [0, Validators.required],
      paymentTypeId: [0, Validators.required],
      clientUserId: [0, Validators.required],
    })

    this.clientOrderStockForm = this.Fb.group({
      stockId: [0, Validators.required],
      clientOrderId: [0, Validators.required],
      qty: [0, Validators.required]
    })

    this.addPrinterForm = this.Fb.group({
      serialNumber: ['', Validators.required],
      clientId: [0, Validators.required],
      printerModelId: [0, Validators.required],
      printerStatusId: [0, Validators.required]
    })
  }

  async ngOnInit(): Promise<void> {
    this.markup = await this.generalService.getMarkup()
    this.VAT = await this.generalService.getVat();
  }

  // for if ngOninit doesnt work
  private async initializeProperties() {
    try {
      this.VAT = await this.generalService.getVat();
      this.markup = await this.generalService.getMarkup();
    } catch (error) {
      console.error("Error initializing properties:", error);
    }
  }

  loadSubscriptions() {
    this.ordersInCart = this.cartManager.getOrdersInCart();
    this.totalCostOfOrdersInCart = this.cartManager.getTotalCostOfOrdersInCart();
  }

  //display methods of payment in select list
  getPaymentTypes() {
    this.paymentTypeService.getPaymentTypes().subscribe((result: PaymentType[]) => {
      this.paymentTypes = result;
    })
  }

  // used to populate the client users id in the clientOrder Form
  async getClientUser(): Promise<ClientUser> {
    const result: ClientUser[] = await firstValueFrom(this.clientUserService.getClientUsers());

    // Retrieve the client user with the same user ID as the current user
    const clientUserData = result.filter(clu => clu.userId === this.Token.id);
    const clientUser: ClientUser = clientUserData[0];

    return clientUser;
  }

  // create invoice for client order
  async createInvoice(): Promise<void> {
    await firstValueFrom(this.clientInvoiceService.addClientInvoice(this.invoiceForm.value)
    .pipe(map(response => response), // Map the response to itself
      catchError(error => {
        if (error.status === 200) {
          console.log("Invoice created");
        } else {
          console.error(error);
        }
        return of([]); // Return an empty array to continue with the rest of the logic
      })
    )
    )
  }

  // used to populate the invoice id in the clientOrder Form
  async getInvoice(): Promise<ClientInvoice> {
    const result: ClientInvoice[] = await firstValueFrom(this.clientInvoiceService.getClientInvoices());
    // Retrieve the latest invoice
    const clientInvoice: ClientInvoice = result[result.length - 1];
    return clientInvoice
  }

  async checkout() {
    if (!this.clientOrderForm.get('paymentTypeId')?.value || this.clientOrderForm.get('paymentTypeId')?.value == 0) {
      this.snackBar.open("Please select a method of payment", 'X', { duration: 5000 });
    }
    else {
      try {
        await this.createInvoice();

        //throws errors
        // const invoice = await firstValueFrom(this.clientInvoiceService.addClientInvoice(this.invoiceForm.value))

        const invoiceId = (await this.getInvoice()).clientInvoiceId;
        const clientUserId = (await this.getClientUser()).clientUserId

        this.clientOrderForm.get('clientOrderStatusId')?.setValue(1)
        this.clientOrderForm.get('clientInvoiceId')?.setValue(invoiceId)
        this.clientOrderForm.get('clientUserId')?.setValue(clientUserId)
        this.clientOrderForm.get('paymentTypeId')?.setValue(+this.clientOrderForm.get('paymentTypeId')?.value)

        // create client order
        await this.createClientOrder();

        //get most recent client order which was created above
        const clientOrders = await lastValueFrom(this.clientOrderService.getClientOrders());

        //loop through orders in cart and save them with the quantity
        for (let index = 0; index < this.ordersInCart.length; index++) {
          let order = this.ordersInCart[index];

          //push stock item with category of "printer" for assigned
          if (order.stock.stockType.stockCategoryId == 3) {
            this.printersToAssigned.push(order);
          }

          this.clientOrderStockForm.setValue({
            stockId: order.stock.stockId,
            clientOrderId: clientOrders[clientOrders.length - 1].clientOrderId,
            qty: order.quantity,
          })
          await this.createClientStockOrders(order);
        }
      } catch (error) {
        console.log("Error occured during checkout:", error)
      }
    }
  }

  //create the client order
  async createClientOrder(): Promise<void> {
    await firstValueFrom(this.clientOrderService.addClientOrder(this.clientOrderForm.value)
    .pipe(map(response => response),
      catchError(error => {
        if (error.status === 200) {
          console.log("Client order created")
        } else {
          console.error(error);
        }
        return of([]); // Return an empty array to continue with the rest of the logic
      })
    )
    );
  }

  //create client stock order
  async createClientStockOrders(order: CartStock) {
    // Create client stock order and handle non-error response with 200 status
    await firstValueFrom(this.clientOrderStockService.addClientOrderStock(this.clientOrderStockForm.value)
    .pipe(map(response => response),
      catchError(error => {
        if (error.status === 200) {
          console.log("Client stock order created")
          this.updateStockMinusQuantity(order)
        } else {
          console.error(error);
        }
        return of([]); // Return an empty array to continue with the rest of the logic
      })
    )
    );
  }

  // Function to update(reduce) stock quantity in the database
  async updateStockMinusQuantity(order: CartStock) {
    try {
      let stockId: number = 0;
      let newQtyOnHand: number = 0;
      let Stock: Stock;

      stockId = order.stock.stockId;
      newQtyOnHand = order.stock.qtyOnHand - order.quantity;
      Stock = {
        qtyOnHand: newQtyOnHand,
        stockId: stockId,
        stockName: order.stock.stockName,
        stockDescription: order.stock.stockDescription,
        minStockThreshold: order.stock.minStockThreshold,
        maxStockThreshold: order.stock.maxStockThreshold,
        stockTypeId: order.stock.stockTypeId,
        stockType: order.stock.stockType,
      };

      // Convert the stock update request to a promise
      await firstValueFrom(this.stockService.editStock(stockId, Stock)
      .pipe(map(response => response),
          catchError(error => {
            if (error.status === 200) {
              console.log("Stock Updated", error);
            } else {
              console.error(error);
            }
            return of([]); // Return an empty array to continue with the rest of the logic
          })
        )
      );
    } catch (error) {
      console.log("An error occurred while updating stock:", error);
    }
  }
}
