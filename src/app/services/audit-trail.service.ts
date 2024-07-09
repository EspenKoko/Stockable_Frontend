import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuditTrail } from '../models/auditTrail';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})
export class AuditTrailService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getAuditTrail(AuditTrailId: number) {
    return this.httpClient.get(`${this.apiUrl}AuditTrail/GetAuditTrail` + "/" + AuditTrailId)
      .pipe(map(result => result))
  }

  getAuditTrails(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}AuditTrail/GetAllAuditTrail`)
      .pipe(map(result => result))
  }

  addAuditTrail(AuditTrail: AuditTrail): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}AuditTrail/AddAuditTrail`, AuditTrail, this.apiService.httpOptions)
  }

  deleteAuditTrail(AuditTrailId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}AuditTrail/DeleteAuditTrail` + "/" + AuditTrailId, this.apiService.httpOptions)
  }

  editAuditTrail(AuditTrailId: number, AuditTrail: AuditTrail): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}AuditTrail/UpdateAuditTrail/${AuditTrailId}`, AuditTrail, this.apiService.httpOptions)
  }

  trackActivity(action: string) {
    const Token: any = JSON.parse(localStorage.getItem("Token") || '{}');

    let auditTrail: AuditTrail = {
      auditTrailId: 0,
      date: new Date(),
      userId: Token.id,
      userName: Token.firstName + " " + Token.lastName,
      userAction: action
    }

    this.addAuditTrail(auditTrail).subscribe({
      next: (value: any) => { },
      error: (err: HttpErrorResponse) => {
        if (err.status == 200) {
          console.log("success")
        }
        else {
          console.error(err);
        }
      },
    })
  }
}
