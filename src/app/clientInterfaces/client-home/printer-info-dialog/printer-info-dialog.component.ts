import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-printer-info-dialog',
  templateUrl: './printer-info-dialog.component.html',
  styleUrls: ['./printer-info-dialog.component.scss']
})
export class PrinterInfoDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

}