import { ClientInvoice } from "./clientInvoices";
import { ClientOrderStatus } from "./clientOrderStatuses";
import { ClientUser } from "./clientUsers";
import { PaymentType } from "./paymentType";

export interface ClientOrder {
  clientOrderId: number;

  //fk
  clientOrderStatusId: number;
  clientOrderStatus: ClientOrderStatus;

  //fk
  paymentTypeId: number;
  paymentType: PaymentType;

  //fk
  clientInvoiceId: number;
  clientInvoice: ClientInvoice;

  //fk
  clientUserId: number;
  clientUser: ClientUser;
}
