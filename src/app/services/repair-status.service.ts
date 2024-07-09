import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { RepairStatus } from '../models/RepairStatus';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})

export class RepairStatusService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getRepairStatus(RepairStatusId: number) {
    return this.httpClient.get(`${this.apiUrl}RepairStatus/GetRepairStatus` + "/" + RepairStatusId)
      .pipe(map(result => result))
  }

  getRepairStatuss(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}RepairStatus/GetAllRepairStatus`)
      .pipe(map(result => result))
  }

  getRepairStatusByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}RepairStatus/SearchRepairStatus/${name}`).pipe(
      map(result => result as any[])
    );
  }

  addRepairStatus(RepairStatus: RepairStatus): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}RepairStatus/AddRepairStatus`, RepairStatus, this.apiService.httpOptions)
  }

  deleteRepairStatus(RepairStatusId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}RepairStatus/DeleteRepairStatus` + "/" + RepairStatusId, this.apiService.httpOptions)
  }

  editRepairStatus(RepairStatusId: number, RepairStatus: RepairStatus): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}RepairStatus/UpdateRepairStatus/${RepairStatusId}`, RepairStatus, this.apiService.httpOptions)
  }

}