import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssignedPrinterService } from 'src/app/services/assigned-printer.service';
import { AssignedPrinter } from 'src/app/models/AssignedPrinters';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
//needs attention in delete and router link to update

@Component({
  selector: 'app-view-printer',
  templateUrl: './view-printer.component.html',
  styleUrls: ['./view-printer.component.scss']
})
export class ViewPrinterComponent {
  title = "Printer";

  searchError!: string
  data: any[] = [];
  searchTerm!: string;

  constructor(private service: AssignedPrinterService,
    private router: Router,
    private snackBar: MatSnackBar,
    private ATService: AuditTrailService) {
    this.GetPrinters();
  }

  GetPrinters() {
    this.service.getAssignedPrinters().subscribe((result: AssignedPrinter[]) => {
      // stores bought printer data in an array for displaying
      // Add the confirmButton property to each data object
      this.data = result.map(item => ({ ...item, confirmButton: false }));
    })
  }

  GetPrinter() {
    if (this.searchTerm.length !== 0 || this.searchTerm !== "") {
      this.service.getAssignedPrinterByName(this.searchTerm).subscribe((result: any[]) => {
        this.data = result;
      });
    }
    else {
      this.GetPrinters();
    }
  }

  //toggles the confirm and delete button on click to confirm deletion
  toggleConfirmButton(index: number, id: number) {

    //if the button property is set to false it will be a delete button and if true a confirm button.
    // when a confirm button and clicked again it will delete the table row
    if (this.data[index].confirmButton) {
      this.Delete(id)
    }
    else {
      this.data[index].confirmButton = !this.data[index].confirmButton;
    }
  }

  Delete(id: Number) {
    this.service.deleteAssignedPrinter(id).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          // save audit trail
          const printer: AssignedPrinter = this.data.find(item => item.printerId == id);
          this.ATService.trackActivity("Deleted printer: " + printer.serialNumber);

          this.data = this.data.filter(item => item.printerIdd !== id);
          this.snackBar.open("Delete Successful", 'X', { duration: 5000 });
        }
        if (response.status == 400 || response.status == 404 || response.status == 500) {
          this.snackBar.open(response.error, 'X', { duration: 5000 });
        }
      }
    });
  }

  back() {
    return this.router.navigate(['/manage-systems'])
  }
}