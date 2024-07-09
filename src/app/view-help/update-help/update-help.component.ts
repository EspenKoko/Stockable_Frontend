import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from 'src/app/resources/custom-validators';
import { ApiService } from 'src/app/services/api-urls';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-update-help',
  templateUrl: './update-help.component.html',
  styleUrls: ['./update-help.component.scss']
})
export class UpdateHelpComponent {
  title = "FAQ";

  Help: any;

  editForm: FormGroup = new FormGroup({
    helpName: new FormControl('', [Validators.required, CustomValidators.checkSpecialCharacters]),
    helpDescription: new FormControl('', [Validators.required]),
  })

  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: HelpService,
    private apiService: ApiService) {

  }

  ngOnInit(): void {
    this.service.getFAQ(+this.route.snapshot.params['id']).subscribe(result => {
      this.Help = result;
      this.editForm.patchValue({
        helpName: this.Help.helpName,
        helpDescription: this.Help.helpDescription
      });
    })
  }

  edit() {
    this.service.editFAQ(this.Help.helpId, this.editForm.value).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        this.apiService.handleApiPutReponse(response, "help", "help", this.editForm.get('helpName')?.value);
      }
    })
  }

  back() {
    return this.router.navigate(['/view-help'])
  }
}
