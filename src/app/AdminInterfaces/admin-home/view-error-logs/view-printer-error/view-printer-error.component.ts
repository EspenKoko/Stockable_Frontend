import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorLogService } from 'src/app/services/error-log.service';

@Component({
  selector: 'app-view-printer-error',
  templateUrl: './view-printer-error.component.html',
  styleUrls: ['./view-printer-error.component.scss']
})
export class ViewPrinterErrorComponent {
  data: any;

  ErrorForm: FormGroup = new FormGroup({
    errorLogId: new FormControl(''),
    errorLogDate: new FormControl(''),
    errorLogDescription: new FormControl(''),
    errorLogStatusId: new FormControl(''),
    clientUserId: new FormControl(''),
    clientName: new FormControl(''),
    assignedPrinterId: new FormControl(''),
    serialNumber: new FormControl(''),
    errorCodeId: new FormControl(''),
    errorCodeName: new FormControl(''),
  })

  constructor(private service: ErrorLogService, private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit(): void {

    this.service.getErrorLog(+this.route.snapshot.params['id']).subscribe((result:any) => {
      this.data = result;
      this.ErrorForm.patchValue({
        errorLogId: this.data.errorLogId,
        errorLogDate: this.data.errorLogDate,
        errorLogDescription: this.data.errorLogDescription,
        errorLogStatusId: this.data.errorLogStatusId,
        clientUserId: this.data.clientUserId,
        clientName: this.data.clientUser.client.clientName,
        assignedPrinterId: this.data.assignedPrinterId,
        serialNumber: this.data.assignedPrinter.serialNumber,
        errorCodeId: this.data.errorCodeId,
        errorCodeName: this.data.errorCode.errorCodeName,
      });
    })
  }
  back() {
    return this.router.navigate(["admin-error-log"])
  }
}
