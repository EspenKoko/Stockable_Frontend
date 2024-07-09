import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Repair } from '../models/repairs';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})

export class RepairService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getRepair(RepairId: number) {
    return this.httpClient.get(`${this.apiUrl}Repair/GetRepair` + "/" + RepairId)
      .pipe(map(result => result))
  }

  getRepairs(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Repair/GetAllRepairs`)
      .pipe(map(result => result))
  }

  getRepairByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}Repair/SearchRepair/${name}`).pipe(
      map(result => result as any[])
    );
  }

  addRepair(Repair: Repair): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}Repair/AddRepair`, Repair, this.apiService.httpOptions)
  }

  deleteRepair(RepairId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}Repair/DeleteRepair` + "/" + RepairId, this.apiService.httpOptions)
  }

  editRepair(RepairId: number, Repair: Repair): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}Repair/UpdateRepair/${RepairId}`, Repair, this.apiService.httpOptions)
  }

}