import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorLog } from 'src/app/models/errorLogs';
import { ErrorLogService } from 'src/app/services/error-log.service';

@Component({
  selector: 'app-view-error-logs',
  templateUrl: './view-error-logs.component.html',
  styleUrls: ['./view-error-logs.component.scss']
})
export class AdminErrorLogsComponent {
  data: any[] = [];

  constructor(private router: Router, private errorLogService: ErrorLogService) {
    this.GetErrorLogs();
  }

  //display every error logged printer that does not have a status of repaired
  GetErrorLogs() {
    this.errorLogService.getErrorLogs().subscribe((result: ErrorLog[]) => {
      //only show printers with an error status of "logged"
      this.data = result.filter(x => x.errorLogStatusId != 7)
    })
  }

  back(): void {
    this.router.navigate(['/admin-dashboard'])
  }
}
