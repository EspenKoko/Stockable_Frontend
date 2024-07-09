import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/services/branch.service';
import { Branch } from 'src/app/models/branches';
import { AuditTrailService } from 'src/app/services/audit-trail.service';

@Component({
  selector: 'app-view-branch',
  templateUrl: './view-branch.component.html',
  styleUrls: ['./view-branch.component.scss']
})

export class ViewBranchComponent {
  title = "Branch";

  searchError!: string
  data: any[] = [];
  searchTerm!: string;

  constructor(private service: BranchService,
    private router: Router,
    private snackBar: MatSnackBar,
    private ATService: AuditTrailService) {
    this.GetBranches();
  }

  GetBranches() {
    this.service.getBranches().subscribe((result: any[]) => {
      // stores branch data in an array for displaying
      // Add the confirmButton property to each data object
      this.data = result.map(item => ({ ...item, confirmButton: false }));
    })
  }

  GetBranch() {
    if (this.searchTerm.length !== 0 || this.searchTerm !== "") {
      this.service.getBranchByName(this.searchTerm).subscribe((result: any[]) => {
        this.data = result.map(item => ({ ...item, confirmButton: false }));
      });
    }
    else {
      this.GetBranches();
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
    this.service.deleteBranch(id).subscribe({
      next: (result) => { },
      error: (response: HttpErrorResponse) => {
        // this.apiService.handleApiDeleteReponse(response);

        if (response.status == 200) {
          // save audit trail
          const branch: Branch = this.data.find(item => item.branchId == id);
          this.ATService.trackActivity("Deleted branch: " + branch.branchName);

          this.data = this.data.filter(item => item.branchId !== id);
          this.snackBar.open("Delete Successful", 'X', { duration: 5000 });
        }
        else if (response.status == 500) {
          this.snackBar.open("Branch is currently associated with funtionality on the system", 'X', { duration: 5000 });
        }
        else {
          this.snackBar.open(response.error, 'X', { duration: 5000 });
        }
      }
    });
  }

  back() {
    return this.router.navigate(['/manage-systems']);
  }
}
