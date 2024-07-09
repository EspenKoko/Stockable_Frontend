import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MarkupService } from 'src/app/services/markup.service';
import { Markup } from 'src/app/models/markup';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-view-markup',
  templateUrl: './view-markup.component.html',
  styleUrls: ['./view-markup.component.scss']
})

export class ViewMarkupComponent {
  data: Markup[] = [];
  amount: number = 0; //store value to be sent to html
  currentMarkupId!: number; // most recently added value of markup

  addForm: FormGroup;

  constructor(private router: Router,
    private service: MarkupService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar) {
    this.addForm = this.fb.group({
      markupPercent: [0, [Validators.required, Validators.min(1), Validators.max(99)]],
      markupDate: [new Date(), [Validators.required]]
    })

    this.GetMarkup();
  }

  GetMarkup() {
    this.service.getMarkups().subscribe((result: any[]) => {
      this.data = result;

      // if markup percent comes through as a whole number leave the code below commented
      // this.data.forEach((markup: any) => {
      //   markup.markupPercent = markup.markupPercent * 100;
      // })

      //gets the most recent markup amount
      if (result.length > 0) {
        const mostRecentMarkup: Markup = result[result.length - 1];
        this.amount = mostRecentMarkup.markupPercent;
        this.currentMarkupId = mostRecentMarkup.markupId;
      }
    })
  }

  //create and update function for markup
  Add() {
    if (this.addForm.valid) {
      let newMarkup = this.addForm.get('markupPercent')?.value / 100
      this.addForm.get('markupPercent')?.setValue(newMarkup.toFixed(2))

      this.service.addMarkup(this.addForm.value).subscribe({
        next: (result: any) => { },
        error: (response: HttpErrorResponse) => {
          if (response.status == 200) {
            this.GetMarkup();
            this.addForm.get('markupPercent')?.setValue(0);
          }
          else {
            this.snackBar.open(response.error + " Failed to add markup", 'X', { duration: 5000 });
          }
        }
      });
    }
    else {
      this.snackBar.open("Failed to add markup please ensure value is between 1-99", 'X', { duration: 5000 });
    }
  }

  edit() {
    if (this.addForm.valid) {
      let newMarkup = this.addForm.get('markupPercent')?.value / 100
      this.addForm.get('markupPercent')?.setValue(newMarkup)

      this.service.editMarkup(this.currentMarkupId, this.addForm.value).subscribe({
        next: (result: any) => { },
        error: (response: HttpErrorResponse) => {
          if (response.status == 200) {
            this.GetMarkup();
            this.addForm.get('markupPercent')?.setValue(0);
          }
          else {
            this.snackBar.open(response.error + " Failed to update markup", 'X', { duration: 5000 });
          }
        }
      });
    }
    else {
      this.snackBar.open("Failed to update markup please ensure value is between 1-99", 'X', { duration: 5000 });
    }
  }

  //delete and cancel function
  Delete() {
    this.service.deleteMarkup(this.currentMarkupId).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          // this.GetMarkup();
          window.location.reload(); // other functions will not work if this line is not here
        }
        else if (response.status == 500) {
          this.snackBar.open("Markup is currently associated with funtionality on the system", 'X', { duration: 5000 });
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
