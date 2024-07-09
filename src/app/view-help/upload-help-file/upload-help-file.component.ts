import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EmployeeType } from 'src/app/models/employeeTypes';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { EmployeeTypeService } from 'src/app/services/employee-type.service';
import { PDFHelpDocService } from 'src/app/services/pdf-help-doc.service';

@Component({
  selector: 'app-upload-help-file',
  templateUrl: './upload-help-file.component.html',
  styleUrls: ['./upload-help-file.component.scss']
})
export class UploadHelpFileComponent implements OnInit {
  data: any[] = [];
  selectedFile: File | null = null;
  formData = new FormData();
  userType: string = '';

  constructor(private fileUploadService: PDFHelpDocService,
    private employeeTypeService: EmployeeTypeService,
    private ATService: AuditTrailService,
    private snackBar: MatSnackBar,
    private router: Router) {

  }

  ngOnInit(): void {
    this.GetEmployeeTypes();
  }

  GetEmployeeTypes() {
    this.employeeTypeService.getEmployeeTypes().subscribe((result: EmployeeType[]) => {
      this.data = result;
    })
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadPdf() {
    if (this.selectedFile && this.userType) {
      const formData = new FormData();
      formData.append('pdfFile', this.selectedFile);
      formData.append('userType', this.userType);

      this.fileUploadService.addPDFHelpDoc(formData).subscribe({
        next: (result) => { },
        error: (response: HttpErrorResponse) => {
          if (response.status == 200) {
            this.selectedFile = null;
            this.userType = '';
            this.ATService.trackActivity("help Pdf uploaded for user type" + this.userType)
            this.snackBar.open('File uploaded successfully', 'X', { duration: 3000 });
          }
          else{
            console.error('File upload failed:', response);
            this.snackBar.open('File upload failed. Please try again.', 'X', { duration: 3000 });
          }
        }
      });
    } else {
      this.snackBar.open('Please select a file and user type before uploading.', 'X', { duration: 3000 });
    }
  }

  back() {
    return this.router.navigate(['/view-help']);
  }
}

