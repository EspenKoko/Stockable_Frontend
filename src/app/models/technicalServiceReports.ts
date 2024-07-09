import { PurchaseOrder } from "./purchaseOrder";

export interface TechnicalServiceReport {
    technicalServiceReportId: number;
    repairsDone: string;
    // timeElapsed: number;
    // TSRDate: Date;

    //fk
    purchaseOrderId: number;
    purchaseOrder: PurchaseOrder;
}
