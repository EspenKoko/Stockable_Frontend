import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-update-assigned-printer',
  templateUrl: './update-assigned-printer.component.html',
  styleUrls: ['./update-assigned-printer.component.scss']
})
export class UpdateAssignedPrinterComponent {
  title = "Assigned Printer"
  AssignedPrinter: any;

  clientData: Client[] = [];
  branchData: Branch[] = [];
  statusData: PrinterStatus[] = [];
  modelData: PrinterModel[] = [];

  editForm: FormGroup = new FormGroup({
    serialNumber: new FormControl('', Validators.required),
    clientId: new FormControl(0, Validators.required),
    branchId: new FormControl(0, Validators.required),
    printerStatusId: new FormControl(0, Validators.required),
    printerModelId: new FormControl(0, Validators.required),
  })

  constructor(private route: ActivatedRoute, private router: Router, private service: AssignedPrinterService,
   private clientService: ClientService, private branchervice: BranchService, private printerStatusService:PrinterStatusService,
   private printerModelService:PrinterModelService, private snackBar: MatSnackBar) {
    this.GetClient();
    this.GetBranch();
    this.GetStatuses();
    this.GetModels();
  }

  GetClient() {
    this.clientService.getClients().subscribe((result: any[]) => {
      this.clientData = result;
    })
  }

  
  GetBranch() {
    this.branchervice.getBranches().subscribe((result: any[]) => {
      this.branchData = result;
    })
  }

  GetModels() {
    this.printerModelService.getPrinterModels().subscribe((result: any[]) => {
      this.statusData = result;
    })
  }  
  
  GetStatuses() {
    this.printerStatusService.getPrinterStatuses().subscribe((result: any[]) => {
      this.statusData = result;
    })
  }

  ngOnInit(): void {

    this.service.getAssignedPrinter(+this.route.snapshot.params['id']).subscribe(result => {
      this.AssignedPrinter = result;
      this.editForm.patchValue({
        printerName: this.AssignedPrinter.printerName,
        clientId: this.AssignedPrinter.clientId,
        branchId: this.AssignedPrinter.branchId,
        printerStatusId: this.AssignedPrinter.printerStatusId,
        printerModelId: this.AssignedPrinter.printerModelId
      });
    })
  }

  edit() {
    this.service.editAssignedPrinter(this.AssignedPrinter.printerId, this.editForm.value).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
      console.log(this.editForm.value)
          this.router.navigate(['/view-printer']).then((navigated: boolean) => {
            if (navigated) {
              this.snackBar.open(`Printer Assigned Successfully Updated`, 'X', { duration: 5000 });
            }
          })
        }
         if (response.status == 400 || response.status == 404 || response.status == 500) {
          this.snackBar.open(response.error, 'X', { duration: 5000 });
        }
      }
    })
  }

  back() {
    return this.router.navigate(['/view-printer'])
  }
}
