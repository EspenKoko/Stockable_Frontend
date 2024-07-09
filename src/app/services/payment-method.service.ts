import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PaymentType } from '../models/paymentType';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})

export class PaymentTypeService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getPaymentType(PaymentTypeId: number) {
    return this.httpClient.get(`${this.apiUrl}PaymentType/GetPaymentType` + "/" + PaymentTypeId)
      .pipe(map(result => result))
  }

  getPaymentTypes(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}PaymentType/GetAllPaymentTypes`)
      .pipe(map(result => result))
  }

  getPaymentTypeByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}PaymentType/SearchPaymentType/${name}`).pipe(
      map(result => result as any[])
    );
  }

  addPaymentType(PaymentType: PaymentType): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}PaymentType/AddPaymentType`, PaymentType, this.apiService.httpOptions)
  }

  deletePaymentType(PaymentTypeId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}PaymentType/DeletePaymentType` + "/" + PaymentTypeId, this.apiService.httpOptions)
  }

  editPaymentType(PaymentTypeId: number, PaymentType: PaymentType): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}PaymentType/UpdatePaymentType/${PaymentTypeId}`, PaymentType, this.apiService.httpOptions)
  }

}