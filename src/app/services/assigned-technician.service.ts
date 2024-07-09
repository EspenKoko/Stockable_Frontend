import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AssignedTechnician } from '../models/assignedTechnician';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})
export class AssignedTechnicianService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getAssignedTechnician(AssignedTechnicianId: number) {
    return this.httpClient.get(`${this.apiUrl}AssignedTechnician/GetAssignedTechnician` + "/" + AssignedTechnicianId)
      .pipe(map(result => result))
  }

  getAssignedTechnicianByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}AssignedTechnician/SearchAssignedTechnician/${name}`).pipe(
      map(result => result as any[])
    );
  }

  getAssignedTechnicians(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}AssignedTechnician/GetAllAssignedTechnicians`)
      .pipe(map(result => result))
  }

  addAssignedTechnician(AssignedTechnician: AssignedTechnician): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}AssignedTechnician/AddAssignedTechnician`, AssignedTechnician, this.apiService.httpOptions)
  }

  deleteAssignedTechnician(AssignedTechnicianId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}AssignedTechnician/DeleteAssignedTechnician` + "/" + AssignedTechnicianId, this.apiService.httpOptions)
  }

  editAssignedTechnician(AssignedTechnicianId: number, AssignedTechnician: AssignedTechnician): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}AssignedTechnician/UpdateAssignedTechnician/${AssignedTechnicianId}`, AssignedTechnician, this.apiService.httpOptions)
  }
}
