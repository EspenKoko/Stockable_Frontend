import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorLog } from 'src/app/models/errorLogs';
import { Repair } from 'src/app/models/repairs';
import { ErrorLogService } from 'src/app/services/error-log.service';
import { RepairService } from 'src/app/services/repair.service';

@Component({
  selector: 'app-booked-in-printers',
  templateUrl: './booked-in-printers.component.html',
  styleUrls: ['./booked-in-printers.component.scss']
})
export class BookedInPrintersComponent {

  data: any[] = [];

  constructor(private router: Router, private repairService: RepairService) {
    this.GetErrorCodes();
  }

  GetErrorCodes() {
    this.repairService.getRepairs().subscribe((result: Repair[]) => {
      console.log(result)
      this.data = result.filter(x => x.repairStatusId == 1 || x.repairStatusId == 2)
    })
  }

  back() {
    return this.router.navigate(['/technician-dashboard'])
  }
}
