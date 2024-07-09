import { Component, OnInit } from '@angular/core';
import { HelpService } from '../services/help.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Help } from '../models/help';
import { AuditTrailService } from '../services/audit-trail.service';

@Component({
  selector: 'app-view-help',
  templateUrl: './view-help.component.html',
  styleUrls: ['./view-help.component.scss']
})
export class ViewHelpComponent implements OnInit {
  title = "FAQ";
  searchError!: string
  data: any[] = [];
  searchTerm!: string;

  constructor(private service: HelpService,
    private router: Router,
    private snackBar: MatSnackBar,
    private ATService: AuditTrailService) { }

  ngOnInit(): void {
    this.GetFAQs();
  }

  GetFAQs() {
    this.service.getFAQs().subscribe((result: any[]) => {
      // stores employee data in an array for displaying
      // Add the confirmButton property to each data object
      this.data = result.map(item => ({ ...item, confirmButton: false }));
    })
  }

  GetFAQ() {
    if (this.searchTerm.length !== 0 || this.searchTerm !== "") {
      this.service.getFAQByName(this.searchTerm).subscribe((result: any[]) => {
        this.data = result;
      });
    }
    else {
      this.GetFAQs();
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
    this.service.deleteFAQ(id).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          // save audit trail
          const help: Help = this.data.find(item => item.helpId == id);
          this.ATService.trackActivity("Deleted help: " + help.helpName);

          this.data = this.data.filter(item => item.helpId !== id);
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
