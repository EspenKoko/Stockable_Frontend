import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { LabourRate } from '../models/labourRate';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})

export class LabourRateService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getLabourRate(LabourRateId: number) {
    return this.httpClient.get(`${this.apiUrl}LabourRate/GetLabourRate` + "/" + LabourRateId)
      .pipe(map(result => result))
  }

  getLabourRates(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}LabourRate/GetAllLabourRates`)
      .pipe(map(result => result))
  }

  getLabourRateByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}LabourRate/SearchLabourRate/${name}`).pipe(
      map(result => result as any[])
    );
  }

  addLabourRate(LabourRate: LabourRate): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}LabourRate/AddLabourRate`, LabourRate, this.apiService.httpOptions)
  }

  deleteLabourRate(LabourRateId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}LabourRate/DeleteLabourRate` + "/" + LabourRateId, this.apiService.httpOptions)
  }

  editLabourRate(LabourRateId: number, LabourRate: LabourRate): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}LabourRate/UpdateLabourRate/${LabourRateId}`, LabourRate, this.apiService.httpOptions)
  }

}