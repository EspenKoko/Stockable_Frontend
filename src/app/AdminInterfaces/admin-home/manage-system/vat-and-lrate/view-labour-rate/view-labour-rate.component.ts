import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LabourRateService } from 'src/app/services/labour-rate.service';
import { LabourRate } from 'src/app/models/labourRate';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-view-labour-rate',
  templateUrl: './view-labour-rate.component.html',
  styleUrls: ['./view-labour-rate.component.scss']
})

export class ViewLabourRateComponent {
  data: LabourRate[] = [];
  amount: number = 0; //store value to be sent to html
  currentLabourRateId!: number; // most recently added value of Labour Rate

  addForm: FormGroup;

  constructor(private router: Router, private service: LabourRateService, private snackBar: MatSnackBar,
    private fb: FormBuilder) {
    this.addForm = this.fb.group({
      labourRate: [0, [Validators.required, Validators.min(1)]],
      labourRateDate: [new Date(), [Validators.required]]
    })

    this.GetLabourRates();
  }

  GetLabourRates() {
    this.service.getLabourRates().subscribe((result: any[]) => {
      this.data = result;

      // if LabourRate percent comes through as a whole number leave the code below commented
      // this.data.forEach((LabourRate: any) => {
      //   LabourRate.LabourRatePercent = LabourRate.LabourRatePercent * 100;
      // })

      //gets the most recent LabourRate amount
      if (result.length > 0) {
        const mostRecentLabourRate: LabourRate = result[result.length - 1];
        this.amount = mostRecentLabourRate.labourRate;
        this.currentLabourRateId = mostRecentLabourRate.labourRateId;
      }
    })
  }

  //create and update function for LabourRate
  Add() {
    if (this.addForm.valid) {
      this.service.addLabourRate(this.addForm.value).subscribe({
        next: (result: any) => { },
        error: (response: HttpErrorResponse) => {
          if (response.status == 200) {
            this.GetLabourRates();
            this.addForm.get('labourRate')?.setValue(0);
          }
          else {
            this.snackBar.open(response.error + " Failed to add labour rate", 'X', { duration: 5000 });
          }
        }
      });
    }
    else {
      this.snackBar.open("Failed to add labour rate please ensure value is greater than 1", 'X', { duration: 5000 });
    }
  }

  edit() {
    if (this.addForm.valid) {
      this.service.editLabourRate(this.currentLabourRateId, this.addForm.value).subscribe({
        next: (result: any) => { },
        error: (response: HttpErrorResponse) => {
          if (response.status == 200) {
            this.GetLabourRates();
            this.addForm.get('labourRate')?.setValue(0);
          }
          else {
            this.snackBar.open(response.error + " Failed to add labour rate", 'X', { duration: 5000 });
          }
        }
      });
    }
    else {
      this.snackBar.open("Failed to add labour rate please ensure value is greater than 1", 'X', { duration: 5000 });
    }
  }

  //delete and cancel function
  Delete() {
    this.service.deleteLabourRate(this.currentLabourRateId).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          // this.GetLabourRates()
          window.location.reload(); // other functions will not work if this line is not here
        }
        else if (response.status == 500) {
          this.snackBar.open("Labour rate is currently associated with funtionality on the system", 'X', { duration: 5000 });
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
