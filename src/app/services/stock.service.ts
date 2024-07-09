import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map, Observable } from 'rxjs';
import { Stock } from '../models/stocks';
import { StockReorder } from '../viewModels/stockReorderVM';
import { Price } from '../models/prices';
import { PriceService } from './price.service';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = this.apiService.apiUrl;  reorderTotal: number = 0;


  constructor(private httpClient: HttpClient, private apiService: ApiService, private priceService: PriceService) {

  }

  getStock(StockId: number) {
    return this.httpClient.get(`${this.apiUrl}Stock/GetStock` + "/" + StockId).pipe(map(result => result))
  }

  getStockByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}Stock/SearchStock/${name}`).pipe(
      map(result => result as any[])
    );
  }

  getStocks(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Stock/GetAllStocks`).pipe(map(result => result))
  }

  addStock(Stock: Stock): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}Stock/AddStock`, Stock, this.apiService.httpOptions)
  }

  deleteStock(StockId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}Stock/DeleteStock` + "/" + StockId, this.apiService.httpOptions)
  }

  editStock(StockId: number, Stock: Stock): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}Stock/UpdateStock/${StockId}`, Stock, this.apiService.httpOptions)
  }

  async checkStockReorder() {
    let stockList: StockReorder[] = [];

    const stockResult = await firstValueFrom(this.getStocks());
    const priceResult = await firstValueFrom(this.priceService.getPrices());

    for (const item of stockResult) {
      if (item.qtyOnHand < item.minStockThreshold) {
        // Retrieve the prices with the same stock ID as the current stock
        const filteredPrices = priceResult.filter((price: { stockId: any; }) => price.stockId === item.stockId);
        const mostRecentPrice: Price = filteredPrices[filteredPrices.length - 1];

        item.price = mostRecentPrice;

        const stock: Stock = {
          stockId: item.stockId,
          stockName: item.stockName,
          stockDescription: item.stockDescription,
          qtyOnHand: item.qtyOnHand,
          stockTypeId: item.stockTypeId,
          stockType: item.stockType,
          minStockThreshold: item.minStockThreshold,
          maxStockThreshold: item.maxStockThreshold,
        };

        const stockReorder = new StockReorder(stock, item.price?.price);
        stockList.push(stockReorder);
      }
    }

    this.reorderTotal = 0;
    stockList.forEach((stockItem: StockReorder) => {
      this.reorderTotal += stockItem.getTotal();
    });

    return stockList;
  }

}
