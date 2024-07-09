import { Component } from '@angular/core';
import { City } from 'src/app/models/cities';
import { CityService } from 'src/app/services/city.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuditTrailService } from 'src/app/services/audit-trail.service';

@Component({
  selector: 'app-view-city',
  templateUrl: './view-city.component.html',
  styleUrls: ['./view-city.component.scss']
})

export class ViewCityComponent {
  title = "City";
  searchError!: string
  data: any[] = [];
  searchTerm!: string;

  constructor(private service: CityService,
    private router: Router,
    private snackBar: MatSnackBar,
    private ATService: AuditTrailService) {
    this.GetCities();
  }

  GetCities() {
    this.service.getCities().subscribe((result: any[]) => {
      // stores city data in an array for displaying
      // Add the confirmButton property to each data object
      this.data = result.map(item => ({ ...item, confirmButton: false }));
    })
  }

  GetCity() {
    if (this.searchTerm.length !== 0 || this.searchTerm !== "") {
      this.service.getCityByName(this.searchTerm).subscribe((result: any[]) => {
        this.data = result;
      });
    }
    else {
      this.GetCities();
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
    this.service.deleteCity(id).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          // save audit trail
          const city: City = this.data.find(item => item.cityId == id);
          this.ATService.trackActivity("Deleted city: " + city.cityName);

          this.data = this.data.filter(item => item.cityId !== id);
          this.snackBar.open("Delete Successful", 'X', { duration: 5000 });
        }
        else if (response.status == 500) {
          this.snackBar.open("City is currently associated with funtionality on the system", 'X', { duration: 5000 });
        }
        else {
          this.snackBar.open(response.error, 'X', { duration: 5000 });
        }
      }
    });
  }

  back() {
    return this.router.navigate(['/address-details'])
  }
}
