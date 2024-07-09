import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportingService {
  stockData: any[] = [];
  repairData: any[] = [];

  // set stock chart
  setStockData(data: any[]) {
    this.stockData = data;
  }

  // set repair chart
  setRepairData(data: any[]) {
    this.repairData = data;
  }

  getStockData() {
    return this.stockData;
  }

  getRepairData() {
    return this.repairData;
  }
}
