import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ProvinceService } from 'src/app/services/province.service';
import { Province } from 'src/app/models/provinces';
import { AuditTrailService } from 'src/app/services/audit-trail.service';

@Component({
  selector: 'app-view-province',
  templateUrl: './view-province.component.html',
  styleUrls: ['./view-province.component.scss']
})

export class ViewProvinceComponent {
  title = "Province";
  searchError!: string
  data: any[] = [];
  searchTerm!: string;

  constructor(private service: ProvinceService,
    private router: Router,
    private snackBar: MatSnackBar,
    private ATService: AuditTrailService) {
    this.GetProvinces();
  }

  GetProvinces() {
    this.service.getProvinces().subscribe((result: any[]) => {
      // stores province data in an array for displaying
      // Add the confirmButton property to each data object
      this.data = result.map(item => ({ ...item, confirmButton: false }));
    })
  }

  GetProvince() {
    if (this.searchTerm.length !== 0 || this.searchTerm !== "") {
      this.service.getProvinceByName(this.searchTerm).subscribe((result: any[]) => {
        this.data = result;
      });
    }
    else {
      this.GetProvinces();
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
    this.service.deleteProvince(id).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          // save audit trail
          const province: Province = this.data.find(item => item.provinceId == id);
          this.ATService.trackActivity("Deleted province: " + province.provinceName);

          this.data = this.data.filter(item => item.provinceId !== id);
          this.snackBar.open("Delete Successful", 'X', { duration: 5000 });
        }
        else if (response.status == 500) {
          this.snackBar.open("Province is currently associated with funtionality on the system", 'X', { duration: 5000 });
        }
        else {
          this.snackBar.open(response.error, 'X', { duration: 5000 });
        }
      }
    });
  }

  back() {
    return this.router.navigate(['/address-details']);
  }
}