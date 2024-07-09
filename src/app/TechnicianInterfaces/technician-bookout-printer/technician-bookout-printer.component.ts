import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AssignedTechnician } from 'src/app/models/assignedTechnician';
import { ErrorLog } from 'src/app/models/errorLogs';
import { AssignedTechnicianService } from 'src/app/services/assigned-technician.service';
import { ErrorLogService } from 'src/app/services/error-log.service';

@Component({
  selector: 'app-technician-bookout-printer',
  templateUrl: './technician-bookout-printer.component.html',
  styleUrls: ['./technician-bookout-printer.component.scss']
})
export class TechnicianBookoutPrinterComponent {
  data: any[] = [];
  Token: any;

  constructor(private router: Router,
    private assignedTechnicianService: AssignedTechnicianService,
    private errorLogService: ErrorLogService) {
    if (localStorage.getItem("Token")) {
      this.Token = JSON.parse(localStorage.getItem("Token")!)
    }

    this.GetErrorLogs();
  }

  // get the error logged printers for the technician assigned to them
  GetErrorLogs() {
    this.assignedTechnicianService.getAssignedTechnicians().subscribe((result: AssignedTechnician[]) => {
      const assignedTechnicians = result.filter(x => x.employee.userId == this.Token.id);
  
      this.errorLogService.getErrorLogs().subscribe((result: ErrorLog[]) => {
        // Filter the error logs based on assignedTechnicians
        this.data = result.filter(x => assignedTechnicians.some(t => t.errorLogId == x.errorLogId && x.errorLogStatusId == 3));
  
        console.log(this.data);
      })
    })
  }

  back(): void {
    this.router.navigate(['/technician-dashboard'])
  }

}
