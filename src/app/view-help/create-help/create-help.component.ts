import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from 'src/app/resources/custom-validators';
import { ApiService } from 'src/app/services/api-urls';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-create-help',
  templateUrl: './create-help.component.html',
  styleUrls: ['./create-help.component.scss']
})
export class CreateHelpComponent {
  title = "FAQ";

  selectedHelp: number | undefined;

  addForm: FormGroup;

  constructor(private router: Router,
    private service: HelpService,
    private fb: FormBuilder,
    private apiService: ApiService) {
    this.addForm = this.fb.group({
      helpName: ['', [Validators.required, CustomValidators.checkSpecialCharacters]],
      helpDescription: ['', [Validators.required]]
    })
  }

  Add() {
    this.service.addFAQ(this.addForm.value).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        this.apiService.handleApiPostReponse(response, "help", "help", this.addForm.get('helpName')?.value);
      }
    });
  }

  back() {
    return this.router.navigate(['/view-help']);
  }
}
