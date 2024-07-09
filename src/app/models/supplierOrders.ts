import { Employee } from "./employees";
import { SupplierOrderStatus } from "./supplierOrderStatuses";
import { Supplier } from "./suppliers";

export interface SupplierOrder {
  supplierOrderId: number;
  date: Date;

  //fk
  employeeId: number;
  employee: Employee;

  //fk
  supplierId: number
  supplier: Supplier

  //fk
  supplierOrderStatusId: number;
  supplierOrderStatus: SupplierOrderStatus;
}
