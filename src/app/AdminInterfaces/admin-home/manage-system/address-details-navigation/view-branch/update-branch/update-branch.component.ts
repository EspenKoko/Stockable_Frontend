import { Component, OnInit } from '@angular/core';
import { City } from 'src/app/models/cities';
import { ActivatedRoute, Router } from '@angular/router';
import { CityService } from 'src/app/services/city.service';
import { BranchService } from 'src/app/services/branch.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Client } from 'src/app/models/clients';
import { ClientService } from 'src/app/services/client.service';
import { Branch } from 'src/app/models/branches';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomValidators } from 'src/app/resources/custom-validators';
import { ApiService } from 'src/app/services/api-urls';

@Component({
  selector: 'app-update-branch',
  templateUrl: './update-branch.component.html',
  styleUrls: ['./update-branch.component.scss']
})

export class UpdateBranchComponent implements OnInit {
  title = "Branch";

  branch!: Branch;

  cityData: City[] = [];
  clientData: Client[] = [];

  editForm: FormGroup = new FormGroup({
    branchName: new FormControl('', [Validators.required, CustomValidators.checkSpecialCharacters]),
    branchCode: new FormControl('', [Validators.required, CustomValidators.checkSpecialCharacters, CustomValidators.checkForWhiteSpace()]),
    cityId: new FormControl(0, [Validators.required]),
    clientId: new FormControl(0, [Validators.required]),
    assignedPrinterId: new FormControl(null),
  })

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: BranchService,
    private cityService: CityService,
    private clientService: ClientService,
    private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.service.getBranch(+this.route.snapshot.params['id']).subscribe((result: any) => {
      this.branch = result;
      this.editForm.patchValue({
        branchName: this.branch.branchName,
        branchCode: this.branch.branchCode,
        cityId: this.branch.cityId,
        clientId: this.branch.clientId,
        assignedPrinterId: this.branch.assignedPrinterId
      });
    })

    //populate city selectlist
    this.GetCities();
    this.GetClients();
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

  edit() {
    this.service.editBranch(this.branch.branchId, this.editForm.value).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        this.apiService.handleApiPutReponse(response, this.title, "branch",  `${this.branch.branchName} -> ${this.editForm.get('branchName')?.value}`);
      }
    })
  }

  back() {
    return this.router.navigate(['/view-branch'])
  }
}
