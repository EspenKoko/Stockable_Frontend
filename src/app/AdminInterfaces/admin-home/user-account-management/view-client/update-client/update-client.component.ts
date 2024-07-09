import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientService } from 'src/app/services/client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from 'src/app/models/clients';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomValidators } from 'src/app/resources/custom-validators';
import { AuditTrailService } from 'src/app/services/audit-trail.service';

@Component({
  selector: 'app-update-client',
  templateUrl: './update-client.component.html',
  styleUrls: ['./update-client.component.scss']
})
export class UpdateClientComponent implements OnInit {
  title = "Client"

  client: any;

  editForm: FormGroup = new FormGroup({
    clientName: new FormControl('', [Validators.required, CustomValidators.checkSpecialCharacters]),
    clientNumber: new FormControl('', [Validators.required, Validators.pattern(/^0[0-9]{9}$/)]),
    clientEmail: new FormControl('', [Validators.required, Validators.email]),
    clientAddress: new FormControl('', [Validators.required, CustomValidators.checkSpecialCharacters])
  })

  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: ClientService,
    private snackBar: MatSnackBar,
    private ATService: AuditTrailService) {
  }

  ngOnInit(): void {
    this.service.getClient(+this.route.snapshot.params['id']).subscribe(result => {
      this.client = result;
      this.editForm.patchValue({
        clientName: this.client.clientName,
        clientNumber: this.client.clientNumber,
        clientEmail: this.client.clientEmail,
        clientAddress: this.client.clientAddress
      });
    })
  }

  edit() {
    this.service.editClient(this.client.clientId, this.editForm.value).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          //save audit trail
          this.ATService.trackActivity(`Updated client: ${this.client.clientName}`);
          
          this.back().then((navigated: boolean) => {
            if (navigated) {
              this.snackBar.open(`Client Successfully Updated`, 'X', { duration: 5000 });
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
    })
  }

  back() {
    return this.router.navigate(['/view-client']);
  }
}
