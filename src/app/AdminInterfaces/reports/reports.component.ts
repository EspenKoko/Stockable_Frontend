import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// https://www.chartjs.org/docs/latest/

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})

export class ReportsComponent implements OnInit {
  data: any;

  constructor(private router: Router) {

  }

  ngOnInit(): void {
 
  }

  @ViewChild('contentToPrint') contentToPrint!: ElementRef;

  generateHelpPDF() {
    const content = this.contentToPrint.nativeElement;

    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Convert the HTML element to a canvas using html2canvas
    html2canvas(content).then(canvas => {
      // Get the canvas data as an image URI
      const imgData = canvas.toDataURL('image/png');

      // Add the image to the PDF document
      doc.addImage(imgData, 'PNG', 10, 10, doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() - 20);

      // Save the PDF document
      doc.save('output.pdf');
    });
  }



  back() {
    return this.router.navigate(['/admin-dashboard'])
  }
}


