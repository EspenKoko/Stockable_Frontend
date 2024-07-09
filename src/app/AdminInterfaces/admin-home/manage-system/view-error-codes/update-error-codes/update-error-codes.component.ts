import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from 'src/app/resources/custom-validators';
import { ApiService } from 'src/app/services/api-urls';
import { ErrorCodeService } from 'src/app/services/error-code.service';

@Component({
  selector: 'app-update-error-codes',
  templateUrl: './update-error-codes.component.html',
  styleUrls: ['./update-error-codes.component.scss']
})
export class UpdateErrorCodesComponent {
  title = "Error Code";

  ErrorCode: any;

  editForm: FormGroup = new FormGroup({
    errorCodeName: new FormControl('', [Validators.required, CustomValidators.checkSpecialCharacters]),
    errorCodeDescription: new FormControl('', [Validators.required, CustomValidators.checkSpecialCharacters]),
  })

  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: ErrorCodeService,
    private apiService: ApiService) {

  }

  ngOnInit(): void {
    this.service.getErrorCode(+this.route.snapshot.params['id']).subscribe(result => {
      this.ErrorCode = result;
      this.editForm.patchValue({
        errorCodeName: this.ErrorCode.errorCodeName,
        errorCodeDescription: this.ErrorCode.errorCodeDescription
      });
    })
  }

  edit() {
    this.service.editErrorCode(this.ErrorCode.errorCodeId, this.editForm.value).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        this.apiService.handleApiPutReponse(response, "error-code", "error code", `${this.ErrorCode.errorCodeName} -> ${this.editForm.get('errorCodeName')?.value}`);
      }
    })
  }

  back() {
    return this.router.navigate(['/view-error-code'])
  }
}
