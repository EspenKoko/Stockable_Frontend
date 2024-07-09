import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from 'src/app/resources/custom-validators';
import { ApiService } from 'src/app/services/api-urls';
import { ErrorCodeService } from 'src/app/services/error-code.service';

@Component({
  selector: 'app-create-error-codes',
  templateUrl: './create-error-codes.component.html',
  styleUrls: ['./create-error-codes.component.scss']
})
export class CreateErrorCodesComponent {
  title = "Error Code";

  selectedErrorCode: number | undefined;

  addForm:FormGroup;
  
  constructor(private router:Router,
    private service: ErrorCodeService,
    private fb:FormBuilder,
    private apiService: ApiService) {
    this.addForm = this.fb.group({
      errorCodeName: ['', [Validators.required, CustomValidators.checkSpecialCharacters]],
      errorCodeDescription: ['', [Validators.required, CustomValidators.checkSpecialCharacters]]
    })
  }

  Add() {
    this.service.addErrorCode(this.addForm.value).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        this.apiService.handleApiPostReponse(response, "error-code", "error code", this.addForm.get('errorCodeName')?.value);
      }
    });
  }

  back() {
    return this.router.navigate(['/view-error-code']);
  }
}
