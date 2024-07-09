import { Component } from '@angular/core';
import { ClientService } from 'src/app/services/client.service';
import { Client } from 'src/app/models/clients';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomValidators } from 'src/app/resources/custom-validators';
import { AuditTrailService } from 'src/app/services/audit-trail.service';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss']
})

export class CreateClientComponent {
  title = "Client"

  addForm: FormGroup;

  constructor(private snackBar: MatSnackBar,
    private service: ClientService,
    private router: Router,
    private fb: FormBuilder,
    private ATService: AuditTrailService) {
    this.addForm = this.fb.group({
      clientName: ['', [Validators.required, CustomValidators.checkSpecialCharacters]],
      clientEmail: ['', [Validators.required, Validators.email]],
      clientNumber: ['', [Validators.required, Validators.pattern(/^0[0-9]{9}$/)]],
      clientAddress: ['', [Validators.required, CustomValidators.checkSpecialCharacters]],
    })

  }

  Add() {
    this.service.addClient(this.addForm.value).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          //save audit trail
          this.ATService.trackActivity(`Created client: ${this.addForm.get('clientName')?.value}`);
          
          this.back().then((navigated: boolean) => {
            if (navigated) {
              this.snackBar.open(`Client Successfully Added`, 'X', { duration: 5000 });
            }
          })
        }
        else if (response.status == 400) {
          if (response.error.errors.clientName) this.snackBar.open(response.error.errors.clientName[0], 'X', { duration: 5000 });
          if (response.error.errors.clientNumber) this.snackBar.open(response.error.errors.clientNumber[0], 'X', { duration: 5000 });
        }
        else {
          this.snackBar.open(response.error, 'X', { duration: 5000 });
        }
      }
    });
  }

  back() {
    return this.router.navigate(['/view-client']);
  }
}