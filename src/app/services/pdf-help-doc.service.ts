import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { ApiService } from './api-urls';

@Injectable({
  providedIn: 'root'
})
export class PDFHelpDocService {
  private apiUrl = this.apiService.apiUrl;

  httpOptions = {
    'responseType': 'arraybuffer' as 'json'
  };

  constructor(private httpClient: HttpClient, private apiService: ApiService) {}

  getPDFHelpDocs(): Observable<any> {
    return this.httpClient
      .get<ArrayBuffer>(`${this.apiUrl}PDFHelpDoc/GetAllPDFHelpDoc`, this.httpOptions)
      .pipe(
        map(response => {
          this.downloadPDF(response);
          return response;
        })
      );
  }

  private downloadPDF(response: ArrayBuffer) {
    const blob = new Blob([response], { type: 'application/pdf' });
    saveAs(blob, 'help_document.pdf');
  }

  addPDFHelpDoc(PDFHelpDoc: FormData): Observable<any> {
    return this.httpClient.post(
      `${this.apiUrl}PDFHelpDoc/AddPDFHelpDoc`,
      PDFHelpDoc
    );
  }

  deletePDFHelpDoc(PDFHelpDocId: number): Observable<any> {
    return this.httpClient.delete<string>(
      `${this.apiUrl}PDFHelpDoc/DeletePDFHelpDoc` + '/' + PDFHelpDocId,
      this.apiService.httpOptions
    );
  }

  editPDFHelpDoc(
    PDFHelpDocId: number,
    PDFHelpDoc: FormData
  ): Observable<any> {
    return this.httpClient.put(
      `${this.apiUrl}PDFHelpDoc/UpdatePDFHelpDoc/${PDFHelpDocId}`,
      PDFHelpDoc,
      this.apiService.httpOptions
    );
  }
}
