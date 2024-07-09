import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { VatService } from 'src/app/services/vat.service';
import { Vat } from 'src/app/models/vat';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-view-vat',
  templateUrl: './view-vat.component.html',
  styleUrls: ['./view-vat.component.scss']
})

export class ViewVatComponent {
  data: Vat[] = [];
  amount: number = 0; //store value to be sent to html
  currentVatId!: number; // most recently added value of vat

  addForm: FormGroup;

  constructor(private router: Router,
    private service: VatService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar) {
    this.addForm = this.fb.group({
      vatPercent: [0, [Validators.required, Validators.min(1), Validators.max(99)]],
      vatDate: [new Date(), [Validators.required]]
    })

    this.GetVats();
  }

  GetVats() {
    this.service.getVats().subscribe((result: any[]) => {
      this.data = result;

      // if vat percent comes through as a whole number leave the code below commented
      // this.data.forEach((vat: any) => {
      //   vat.vatPercent = vat.vatPercent * 100;
      // })

      //gets the most recent vat amount
      if (result.length > 0) {
        const mostRecentVat: Vat = result[result.length - 1];
        this.amount = mostRecentVat.vatPercent;
        this.currentVatId = mostRecentVat.vatId;
      }
    })
  }

  //create and update function for vat
  Add() {
    if (this.addForm.valid) {
      let newVat = this.addForm.get('vatPercent')?.value / 100
      this.addForm.get('vatPercent')?.setValue(newVat.toFixed(2))

      this.service.addVat(this.addForm.value).subscribe({
        next: (result: any) => { },
        error: (response: HttpErrorResponse) => {
          if (response.status == 200) {
            this.GetVats();
            this.addForm.get('vatPercent')?.setValue(0);
          }
          else {
            this.snackBar.open(response.error + " Failed to add VAT", 'X', { duration: 5000 });
          }
        }
      });
    }
    else {
      this.snackBar.open("Failed to add VAT please ensure value is between 1-99", 'X', { duration: 5000 });
    }
  }

  edit() {
    if (this.addForm.valid) {
      let newVat = this.addForm.get('vatPercent')?.value / 100
      this.addForm.get('vatPercent')?.setValue(newVat)

      this.service.editVat(this.currentVatId, this.addForm.value).subscribe({
        next: (result: any) => { },
        error: (response: HttpErrorResponse) => {
          if (response.status == 200) {
            this.GetVats();
            this.addForm.get('vatPercent')?.setValue(0);
          }
          else {
            this.snackBar.open(response.error + " Failed to update VAT", 'X', { duration: 5000 });
          }
        }
      });
    }
    else {
      this.snackBar.open("Failed to update VAT please ensure value is between 1-99", 'X', { duration: 5000 });
    }
  }

  //delete and cancel function
  Delete() {
    this.service.deleteVat(this.currentVatId).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          // this.GetVats();
          window.location.reload(); // other functions will not work if this line is not here
        }
        else if (response.status == 500) {
          this.snackBar.open("Vat is currently associated with funtionality on the system", 'X', { duration: 5000 });
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
