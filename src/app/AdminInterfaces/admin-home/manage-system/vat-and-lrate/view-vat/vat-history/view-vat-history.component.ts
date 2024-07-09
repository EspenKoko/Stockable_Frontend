import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Vat } from 'src/app/models/vat';
import { VatService } from 'src/app/services/vat.service';

@Component({
  selector: 'app-view-vat-history',
  templateUrl: './view-vat-history.component.html',
  styleUrls: ['./view-vat-history.component.scss']
})

export class ViewVatHistoryComponent {
  title = "VAT";
  searchError!: string
  data: any[] = [];
  searchTerm!: string;

  constructor(private service: VatService,
    private router: Router,
    private snackBar: MatSnackBar) {
    this.GetVAT();
  }

  GetVAT() {
    this.service.getVats().subscribe((result: Vat[]) => {
      // stores VAT data in an array for displaying
      // Add the confirmButton property to each data object
      this.data = result.map(item => ({ ...item, confirmButton: false }));
    })
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
    this.service.deleteVat(id).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          this.data = this.data.filter(item => item.vatId !== id);
          this.snackBar.open("Delete Successful", 'X', { duration: 5000 });
        }
        else if (response.status == 500) {
          this.snackBar.open("VAT is currently associated with funtionality on the system", 'X', { duration: 5000 });
        }
        else {
          this.snackBar.open(response.error, 'X', { duration: 5000 });
        }
      }
    });
  }

  back() {
    // return this.router.navigate(['view-vat']);
    return this.router.navigate(['view-vat-lrate']);
  }
}