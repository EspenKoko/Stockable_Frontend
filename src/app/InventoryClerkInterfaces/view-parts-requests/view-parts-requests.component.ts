import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RepairStockService } from 'src/app/services/repair-stock.service';

@Component({
  selector: 'app-view-parts-requests',
  templateUrl: './view-parts-requests.component.html',
  styleUrls: ['./view-parts-requests.component.scss']
})
export class ViewPartsRequestsComponent {

  partsRequestdata: any[] = [];

  constructor(
    private router: Router,
    private RepairStockService: RepairStockService) {
    this.GetPartsRequests();
  }

  GetPartsRequests() {
    this.RepairStockService.getRepairStocks().subscribe((result: any[]) => {
      const uniqueRequestsMap = new Map();

      result.forEach(requests => {
        const repairId = requests.repairId;
        if (!uniqueRequestsMap.has(repairId)) {
          uniqueRequestsMap.set(repairId, requests);
        }
      });
      const uniqueRequests = Array.from(uniqueRequestsMap.values());
      this.partsRequestdata = uniqueRequests.filter(request => request.repair.repairStatusId === 5 && request.purchaseOrder.purchaseOrderStatusId == 2);
      console.log(this.partsRequestdata);
    });
  }

  back() {
    return this.router.navigate(['/inventory-clerk-dashboard'])
  }
}
