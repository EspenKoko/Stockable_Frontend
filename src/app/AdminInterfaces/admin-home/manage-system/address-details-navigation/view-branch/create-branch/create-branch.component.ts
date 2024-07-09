import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from 'src/app/resources/custom-validators';
import { BranchService } from 'src/app/services/branch.service';
import { CityService } from 'src/app/services/city.service';
import { ClientService } from 'src/app/services/client.service';
import { Branch } from 'src/app/models/branches';
import { City } from 'src/app/models/cities';
import { Client } from 'src/app/models/clients';
import { ApiService } from 'src/app/services/api-urls';

@Component({
  selector: 'app-create-branch',
  templateUrl: './create-branch.component.html',
  styleUrls: ['./create-branch.component.scss']
})
export class CreateBranchComponent {
  title = "Branch";

  cityData: City[] = [];
  clientData: Client[] = [];

  addForm: FormGroup;

  constructor(private router: Router,
    private service: BranchService,
    private fb: FormBuilder,
    private clientService: ClientService,
    private cityService: CityService,
    private apiService: ApiService) {

    this.addForm = this.fb.group({
      branchName: [, [Validators.required, CustomValidators.checkSpecialCharacters]],
      branchCode: [, [Validators.required, CustomValidators.checkForWhiteSpace(), CustomValidators.checkSpecialCharacters]],
      cityId: [, [Validators.required]],
      clientId: [, [Validators.required]],
      assignedPrinterId: [null],
    })

    //populate city selectlist
    this.GetCities()
    this.GetClients()
  }

  GetCities() {
    this.cityService.getCities().subscribe((result: any[]) => {
      this.cityData = result;
    })
  }

  GetClients() {
    this.clientService.getClients().subscribe((result: any[]) => {
      this.clientData = result;
    })
  }

  Add() {
    this.service.addBranch(this.addForm.value).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        this.apiService.handleApiPostReponse(response, this.title, "branch", this.addForm.get('branchName')?.value);
      }
    });
  }

  back() {
    return this.router.navigate(['/view-branch'])
  }
}
