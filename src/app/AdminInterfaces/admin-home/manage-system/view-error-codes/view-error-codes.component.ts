import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ErrorCode } from 'src/app/models/errorCodes';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { ErrorCodeService } from 'src/app/services/error-code.service';

@Component({
  selector: 'app-view-error-codes',
  templateUrl: './view-error-codes.component.html',
  styleUrls: ['./view-error-codes.component.scss']
})
export class ViewErrorCodesComponent {
  title = "Error Code";
  searchError!: string
  data: any[] = [];
  searchTerm!: string;

  constructor(private service: ErrorCodeService,
    private router: Router,
    private snackBar: MatSnackBar,
    private ATService: AuditTrailService) {
    this.GetErrorCodes();
  }

  GetErrorCodes() {
    this.service.getErrorCodes().subscribe((result: any[]) => {
      // stores error code data in an array for displaying
      // Add the confirmButton property to each data object
      this.data = result.map(item => ({ ...item, confirmButton: false }));
    })
  }

  GetErrorCode() {
    if (this.searchTerm.length !== 0 || this.searchTerm !== "") {
      this.service.getErrorCodeByName(this.searchTerm).subscribe((result: any[]) => {
        this.data = result;
      });
    }
    else {
      this.GetErrorCodes();
    }
  }

  //toggles the confirm and delete button on click to confirm deletion
  toggleConfirmButton(index: number, id: number) {

    //if the button property is set to false it will be a delete button and if true a confirm button.
    // when a confirm button and clicked again it will delete the table row
    if (this.data[index].confirmButton) {
      this.Delete(id)
    }
    else {
      this.data[index].confirmButton = !this.data[index].confirmButton;
    }
  }

  Delete(id: Number) {
    this.service.deleteErrorCode(id).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          // save audit trail
          const errorCode: ErrorCode = this.data.find(item => item.errorCodeId == id);
          this.ATService.trackActivity("Deleted error code: " + errorCode.errorCodeName);

          this.data = this.data.filter(item => item.errorCodeId !== id);
          this.snackBar.open("Delete Successful", 'X', { duration: 5000 });
        }
        else if (response.status == 500) {
          this.snackBar.open("Error codes is currently associated with funtionality on the system", 'X', { duration: 5000 });
        }
        else {
          this.snackBar.open(response.error, 'X', { duration: 5000 });
        }
      }
    });
  }

  back() {
    return this.router.navigate(['/manage-systems'])
  }
}
