import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { AuditTrail } from 'src/app/models/auditTrail';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-activity-stream',
  templateUrl: './activity-stream.component.html',
  styleUrls: ['./activity-stream.component.scss']
})
export class ActivityStreamComponent implements OnInit {
  searchTerm: string = '';
  data: any[] = [];
  fromSelectedSalePeriod: Date = new Date(0);
  toSelectedSalePeriod: Date = new Date();
  today: Date = new Date();

  constructor(private service: AuditTrailService, private router: Router) {

  }

  ngOnInit(): void {
    this.GetActivities();
  }

  GetActivities() {
    this.service.getAuditTrails().subscribe((result: AuditTrail[]) => {
      // stores audit trail data in an array for displaying
      this.data = result;
    })
  }

  async GetActivity() {
    console.log("From: ", this.fromSelectedSalePeriod, " To ", this.toSelectedSalePeriod)
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    //trail of type audit trail
    const trail: any[] = await firstValueFrom(this.service.getAuditTrails());

    // on form reset properties are initialised to null
    // when calling the property in the new Date() thje newly declared const are set to the value of new Date(0) which is "Thu Jan 01 1970 02:00:00 GMT+0200 (South Africa Standard Time)"
    // this will only change when a new input is selected in the dart time picker for the one, the other or both date time pickers
    const fromDate = new Date(this.fromSelectedSalePeriod);
    const toDate = new Date(this.toSelectedSalePeriod);

    // re-initialise the new property to default as trail
    let filteredtrail = trail;
    console.log("From: ", fromDate, " To ", toDate)

    //must use selectedSalePeriod value here becuase locally declared properties will be "Thu Jan 01 1970 02:00:00 GMT+0200 (South Africa Standard Time)" at this point
    if (this.fromSelectedSalePeriod == null && this.toSelectedSalePeriod == null) {
      //filters to only display report for current month
      filteredtrail = trail.filter(x => new Date(x.date) > firstDayOfMonth);
      console.log("not nice")
    }
    //for a period starting from a certain point onwards
    else if (fromDate && this.fromSelectedSalePeriod != null && toDate && this.toSelectedSalePeriod == null) {
      filteredtrail = trail.filter(x => new Date(x.date) >= fromDate);
      console.log("nice+")
    }
    //for a period leading up to a certain point
    else if (fromDate && this.fromSelectedSalePeriod == null && toDate && this.toSelectedSalePeriod != null) {
      filteredtrail = trail.filter(x => new Date(x.date) <= toDate);
      console.log("nice-")
    }
    //for a period between two dates
    else if (fromDate != new Date(0) && this.fromSelectedSalePeriod != null && toDate != this.today && this.toSelectedSalePeriod != null) {
      // Filter the data based on the clientInvoiceDate within the selected sale period
      filteredtrail = trail.filter(x =>
        new Date(x.date) >= fromDate &&
        new Date(x.date) <= toDate);
      console.log("nice")
    }

    if (this.searchTerm.length !== 0 || this.searchTerm !== "") {
      this.data = filteredtrail.filter(x => x.userAction.toLowerCase().includes(this.searchTerm.toLowerCase())
        || x.userName.toLowerCase().includes(this.searchTerm.toLowerCase())
        || x.userId.toLowerCase().includes(this.searchTerm.toLowerCase()));
    }
    else {
      this.data = filteredtrail;
    }
  }

  clearFilters() {
    this.GetActivities();
    this.searchTerm = "";
    this.fromSelectedSalePeriod = new Date(0);
    this.toSelectedSalePeriod = new Date();
  }

  back() {
    return this.router.navigate(['/manage-systems']);
  }
}
