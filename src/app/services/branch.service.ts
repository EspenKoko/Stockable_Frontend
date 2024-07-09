import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Branch } from '../models/branches';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  private apiUrl = this.apiService.apiUrl;

  constructor(private httpClient: HttpClient, private apiService: ApiService) {

  }

  getBranch(BranchId: number) {
    return this.httpClient.get(`${this.apiUrl}Branch/GetBranch` + "/" + BranchId)
      .pipe(map(result => result))
  }

  getBranchByName(name: string): Observable<any[]> {
    return this.httpClient.get(`${this.apiUrl}Branch/SearchBranch/${name}`).pipe(
      map(result => result as any[])
    );
  }

  getBranches(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Branch/GetAllBranches`)
      .pipe(map(result => result))
  }

  addBranch(Branch: Branch): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}Branch/AddBranch`, Branch, this.apiService.httpOptions)
  }

  deleteBranch(BranchId: Number): Observable<any> {
    return this.httpClient.delete<string>(`${this.apiUrl}Branch/DeleteBranch` + "/" + BranchId, this.apiService.httpOptions)
  }

  editBranch(BranchId: number, Branch: Branch): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}Branch/UpdateBranch/${BranchId}`, Branch, this.apiService.httpOptions)
  }

}
