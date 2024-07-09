import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './api-urls';
import { MailData } from '../models/MailData';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  sendMail(mailData: MailData): Observable<any> {
   return this.httpClient.post(`${this.apiUrl}Mail/SendMail`, mailData, this.apiService.httpOptions)
  }
}
