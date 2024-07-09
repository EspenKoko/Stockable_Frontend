import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, firstValueFrom, map } from 'rxjs';
import { Diagnostics } from 'src/app/models/diagnostics';
import { Repair } from 'src/app/models/repairs';
import { DiagnosticsService } from 'src/app/services/diagnostics.service';
import { ErrorLogService } from 'src/app/services/error-log.service';
import { RepairService } from 'src/app/services/repair.service';

@Component({
  selector: 'app-diagnostics-checklist',
  templateUrl: './diagnostics-checklist.component.html',
  styleUrls: ['./diagnostics-checklist.component.scss']
})
export class DiagnosticsChecklistComponent {
  rerouted: Boolean;

  data: any;
  diagnosticChecklist: FormGroup;
  checklist: any;

  constructor(private router: Router,
    private service: ErrorLogService,
    private route: ActivatedRoute,
    private repairService: RepairService,
    private diagnosticService: DiagnosticsService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar) {
    this.service.getErrorLog(+this.route.snapshot.params['id']).subscribe((result: any) => {
      this.data = result;
    })

    const navigationState = this.router.getCurrentNavigation()?.extras.state;
    if (navigationState && navigationState['fromDiagnosticChecklistComponent']) {
      // Navigated from the DiagnosticChecklistComponent
      console.log('Navigated from DiagnosticChecklistComponent');
      this.rerouted = true;
    } else {
      // Navigated from a different URL
      console.log('Navigated from a different URL');
      this.rerouted = false;
    }

    this.diagnosticChecklist = this.fb.group({
      repairId: [0, Validators.required],
      diagnosticComment: ['', Validators.required],
      rollerCheck: [false, Validators.required],
      lcdScreenCheck: [false, Validators.required],
      powerSupplyCheck: [false, Validators.required],
      motherboardCheck: [false, Validators.required],
      hopperCheck: [false, Validators.required],
      beltCheck: [false, Validators.required],
      ethernetPortCheck: [false, Validators.required],
    })
  }

  ngOnInit(): void {
    this.diagnosticService.getDiagnostic(+this.route.snapshot.params['id']).subscribe(result => {
      this.checklist = result;
      this.diagnosticChecklist.patchValue({
        repairId: this.checklist.repairId,
        diagnosticComment: this.checklist.diagnosticComment,
        rollerCheck: this.checklist.rollerCheck,
        lcdScreenCheck: this.checklist.lcdScreenCheck,
        powerSupplyCheck: this.checklist.powerSupplyCheck,
        motherboardCheck: this.checklist.motherboardCheck,
        hopperCheck: this.checklist.hopperCheck,
        beltCheck: this.checklist.beltCheck,
        ethernetPortCheck: this.checklist.ethernetPortCheck,
      });
    })
  }

  //check whether user routed to the page in the from dashboard or rerouted from parts request
  checkState() {
    if (!this.rerouted) {
      this.performDiagnosticCheck();
    }
    else {
      this.updateDiagnosticCheck();
    }
  }

  //get repair whith the relevent errorlog we are currently working on
  getRepair(): Observable<Repair> {
    return this.repairService.getRepairs().pipe(
      map((result: Repair[]) => {
        let repairs = result.filter(x => x.errorLogId === this.data.errorLogId);
        return repairs[0];
      })
    );
  }

  // create diagnostic record
  async performDiagnosticCheck() {
    const repair = await firstValueFrom(this.getRepair());
    this.diagnosticChecklist.get('repairId')?.setValue(repair?.repairId);


    this.diagnosticService.addDiagnostic(this.diagnosticChecklist.value).subscribe({
      next: (result: any) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {

          //update repair status
          repair.repairStatusId = 2;
          this.repairService.editRepair(repair.repairId, repair).subscribe({
            next: (result) => { },
            error: (response: HttpErrorResponse) => {
              if (response.status == 200) {
                this.navigate().then((navigated: boolean) => {
                  if (navigated) {
                    this.snackBar.open(`Diagnostic Submitted`, 'X', { duration: 5000 });
                  }
                })
              }
              else{
                this.snackBar.open(`Diagnostic Submittion, check connection`, 'X', { duration: 5000 });

              }
            }
          })
        }
        else {
          this.snackBar.open(`Failed to submit, check connection`, 'X', { duration: 5000 });
        }
      }
    })
  }

  updateDiagnosticCheck() {
    this.diagnosticService.editDiagnostic(this.checklist.diagnosticsId, this.diagnosticChecklist.value).subscribe({
      next: (result: any) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          this.navigate().then((navigated: boolean) => {
            if (navigated) {
              this.snackBar.open(`Diagnostic Resubmitted`, 'X', { duration: 5000 });
            }
          })
        }
        else {
          this.snackBar.open(`Failed to submit, check connection`, 'X', { duration: 5000 });
        }
      }
    })
  }

  navigate() {
    return this.router.navigate(["parts-requests/" + this.data.errorLogId])
  }

  back() {
    return this.router.navigate(["technician-error-logs/" + this.data.errorLogId])
  }
}
