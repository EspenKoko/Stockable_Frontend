import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Branch } from 'src/app/models/branches';
import { Client } from 'src/app/models/clients';
import { PrinterModel } from 'src/app/models/printerModels';
import { PrinterStatus } from 'src/app/models/printerStatuses';
import { AssignedPrinterService } from 'src/app/services/assigned-printer.service';
import { BranchService } from 'src/app/services/branch.service';
import { ClientService } from 'src/app/services/client.service';
import { PrinterModelService } from 'src/app/services/printer-model.service';
import { PrinterStatusService } from 'src/app/services/printer-status.service';

@Component({
  selector: 'app-assign-printer',
  templateUrl: './assign-printer.component.html',
  styleUrls: ['./assign-printer.component.scss']
})
export class AssignPrinterComponent {
  title = "Assign Printer";

  clientData: Client[] = [];
  branchData: Branch[] = [];
  statusData: PrinterStatus[] = [];
  modelData: PrinterModel[] = [];

  addForm: FormGroup;

  constructor(private snackBar: MatSnackBar,
    private router: Router,
    private service: AssignedPrinterService,
    private clientService: ClientService,
    private branchService: BranchService,
    private printerStatusService: PrinterStatusService,
    private printerModelService: PrinterModelService,
    private fb: FormBuilder) {
    this.GetClients();
    this.GetBranches();
    this.GetStatuses();
    this.GetModels();

    this.addForm = this.fb.group({
      serialNumber: ['', Validators.required],
      clientId: [0, Validators.required],
      branchId: [0, Validators.required],
      printerStatusId: [0, Validators.required],
      printerModelId: [0, Validators.required],
    })
  }

  GetClients() {
    this.clientService.getClients().subscribe((result: any[]) => {
      this.clientData = result;
    })
  }

  GetBranches() {
    this.branchService.getBranches().subscribe((result: any[]) => {
      this.branchData = result;
    })
  }

  GetStatuses() {
    this.printerStatusService.getPrinterStatuses().subscribe((result: any[]) => {
      this.statusData = result;
    })
  }

  GetModels() {
    this.printerModelService.getPrinterModels().subscribe((result: any[]) => {
      this.modelData = result;
    })
  }

  Add() {
    this.service.addAssignedPrinter(this.addForm.value).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        console.log(this.addForm.value)
        console.log(response)
        if (response.status == 200) {
          this.back().then((navigated: boolean) => {
            if (navigated) {
              this.snackBar.open(`Printer Assigned Successfully Added`, 'X', { duration: 5000 });
            }
          })
        }
      }
    });
  }

  back() {
    return this.router.navigate(['/view-printer'])
  }
}
