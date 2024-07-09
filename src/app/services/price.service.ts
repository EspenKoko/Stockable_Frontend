import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Price } from '../models/prices';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})

export class PriceService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getPrice(PriceId: number) {
    return this.httpClient.get(`${this.apiUrl}Price/GetPrice` + "/" + PriceId)
      .pipe(map(result => result))
  }

  getPrices(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Price/GetAllPrices`)
      .pipe(map(result => result))
  }

  getPriceByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}Price/SearchPrice/${name}`).pipe(
      map(result => result as any[])
    );
  }

  addPrice(Price: Price): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}Price/AddPrice`, Price, this.apiService.httpOptions)
  }

  deletePrice(PriceId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}Price/DeletePrice` + "/" + PriceId, this.apiService.httpOptions)
  }

  editPrice(PriceId: number, Price: Price): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}Price/UpdatePrice/${PriceId}`, Price, this.apiService.httpOptions)
  }
}