import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { RepairStock } from '../models/repairStock';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})

export class RepairStockService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getRepairStock(RepairStockId: number) {
    return this.httpClient.get(`${this.apiUrl}RepairStock/GetRepairStock` + "/" + RepairStockId)
      .pipe(map(result => result))
  }

  getRepairStocks(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}RepairStock/GetAllRepairStock`)
      .pipe(map(result => result))
  }

  getRepairStockByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}RepairStock/SearchRepairStock/${name}`).pipe(
      map(result => result as any[])
    );
  }

  addRepairStock(RepairStock: RepairStock): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}RepairStock/AddRepairStock`, RepairStock, this.apiService.httpOptions)
  }

  deleteRepairStock(RepairStockId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}RepairStock/DeleteRepairStock` + "/" + RepairStockId, this.apiService.httpOptions)
  }

  editRepairStock(RepairStockId: number, RepairStock: RepairStock): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}RepairStock/UpdateRepairStock/${RepairStockId}`, RepairStock, this.apiService.httpOptions)
  }

}