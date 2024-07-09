import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from 'src/app/services/client.service';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { GeneralServices } from 'src/app/services/general-services';
import { catchError, of } from 'rxjs';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-client-report',
  templateUrl: './client-report.component.html',
  styleUrls: ['./client-report.component.scss']
})
export class ClientReportComponent {
  data: any[] = [];
  clientCount: number = this.data.length;

  documentDefinition!: TDocumentDefinitions;
  notes: string = '';
  currentDate = this.generalService.getDate();

  // Convert the image to Base64
  imageUrl1 = 'assets/download.jpeg';
  imageUrl2 = 'assets/Report Headings/Slide4.JPG';
  base64Image1: Promise<string> = this.generalService.getImageAsBase64(this.imageUrl1);
  base64Image2: Promise<string> = this.generalService.getImageAsBase64(this.imageUrl2);

 constructor(private clientService: ClientService,
    public generalService: GeneralServices,
    private router: Router) {
  }

  ngOnInit(): void {
    this.GetClients();
  }

  GetClients() {
    this.clientService.getClients().pipe(
      catchError(async (error) => {
        if (error.status === 404) {
          this.generalService.notFound = true;
        } else {
          console.error(error);
        }
        return of([]); // Return an empty array to continue with the rest of the logic
      })
    ).subscribe((result: any[]) => {
      this.generalService.notFound = false;
      this.data = result;
      this.displayPDF()
    });
  }

  //refresh pdf everytime a note is added
  refreshPDF() {
    if (this.notes.length > 0 && this.notes != '') {
      this.displayPDF();
    }
    else {
      this.notes = '';
      this.displayPDF();
    }
  }

  // pdf made with pdfMake
  @ViewChild('iframeContainer') iframeContainer!: ElementRef;
  private iframe: HTMLIFrameElement | null = null; // Track the iframe element

  // for display purposes
  async displayPDF(): Promise<void> {
    const headerFunction = () => {
      return { text: this.currentDate, style: 'header' };
    };

    this.documentDefinition = {
      info: {
        title: 'ACS Fintech Altron Client Report',
        author: 'Espen Koko',
        subject: 'Report on clients on system',
        keywords: 'Report on clients on system',
      },
      permissions: {
        printing: 'highResolution',
        modifying: false,
        copying: true,
        annotating: true,
        fillingForms: true,
        contentAccessibility: true,
        documentAssembly: true
      },
      // a string or { width: number, height: number }
      pageSize: 'A4',

      // by default is portrait, you can change it to landscape if you wish
      pageOrientation: 'landscape',

      // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
      // pageMargins: [40, 60, 40, 60],

      watermark: {
        text: 'ACS Fintech Altron',
        fontSize: 90,
        color: 'orange',
        opacity: 0.1,
        bold: true,
        angle: 300
      },
      styles: {
        header: {
          fontSize: 39,
          bold: true,
          // background: 'blue', 
          // color: 'white',
        },
        footer: {
          fontSize: 10,
          color: 'gray',
          marginLeft: 25,
        },
       tableHeader: {
          bold: true,
          fontSize: 14,
          fillColor: '#CCCCCC', // Light gray background color
        },
        tableFooter: {
          bold: true,
          fontSize: 13,
          fillColor: '#CCCCCC', // Light gray background color
        },
        tableCell: {
          fontSize: 12,
        },
        notesSection: {
          marginLeft: 80,
        }
      },
      content: [
        {
          image: await this.base64Image1,
          width: 250,
          height: 150,
          alignment: 'left', // Center align the image horizontally
          margin: [0, 0], // Adjust the left and top margin
        },
        {
          image: await this.base64Image2,
          width: 310,
          height: 225,
          absolutePosition: { x: 300, y: 0 },
          margin: [0, 0], // Adjust the left and top margin
        },
        { text: '\n' },
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*'],
            body: [
              // Table header row with tableHeader style applied
              [{ text: 'Client Name', style: 'tableHeader' },
              { text: 'Contact Number', style: 'tableHeader' },
              { text: 'Email', style: 'tableHeader' },
              { text: 'Address', style: 'tableHeader' }],
              ...this.data.map(item => [
                { text: item.clientName, style: 'tableCell' },
                { text: item.clientNumber, style: 'tableCell' },
                { text: item.clientEmail, style: 'tableCell' },
                { text: item.clientAddress, style: 'tableCell' },
              ])
            ]
          }
        },
        { text: '\n' },
        { text: this.notes },
      ],

      header: headerFunction,
      footer: function (currentPage: number, pageCount: number) {
        return { text: `Page ${currentPage} of ${pageCount}`, style: 'footer' };
      }
    };

    const pdfDocGenerator = pdfMake.createPdf(this.documentDefinition);

    pdfDocGenerator.getDataUrl(async (dataUrl) => {
      if (this.iframe) {
        this.iframe.remove(); // Remove the previous iframe if it exists
      }

      this.iframe = document.createElement('iframe');
      this.iframe.src = dataUrl;
      this.iframe.style.width = '100%';

      // Calculate the height to maintain A4 paper aspect ratio (1:1.414)
      const a4AspectRatio = 1.414;
      const a4WidthInPixels = 600;
      const a4HeightInPixels = a4WidthInPixels * a4AspectRatio;
      this.iframe.style.height = `${a4HeightInPixels}px`;

      this.iframeContainer.nativeElement.appendChild(this.iframe);
    });
    setTimeout(() => {
      // After the PDF generation is done, scroll to the iframeContainer element.
      if (this.iframeContainer && this.iframeContainer.nativeElement) {
        this.iframeContainer.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
      else {
        console.error("No element");
      }
    }, 500);
  }

  // for downloading purposes
  async generatePDF() {
    const headerFunction = () => {
      return { text: this.currentDate, style: 'header' };
    };

    this.documentDefinition = {
      info: {
        title: 'ACS Fintech Altron Client Report',
        author: 'Espen Koko',
        subject: 'Report on clients on system',
        keywords: 'Report on clients on system',
      },
      userPassword: '123',
      ownerPassword: '123456',
      permissions: {
        printing: 'highResolution',
        modifying: false,
        copying: true,
        annotating: true,
        fillingForms: true,
        contentAccessibility: true,
        documentAssembly: true
      },
      // a string or { width: number, height: number }
      pageSize: 'A4',

      // by default is portrait, you can change it to landscape if you wish
      pageOrientation: 'landscape',

      // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
      // pageMargins: [40, 60, 40, 60],

      watermark: {
        text: 'ACS Fintech Altron',
        fontSize: 90,
        color: 'orange',
        opacity: 0.1,
        bold: true,
        angle: 300
      },
      styles: {
        header: {
          fontSize: 39,
          bold: true,
        },
        footer: {
          fontSize: 10,
          color: 'gray',
          marginLeft: 25,
        },
       tableHeader: {
          bold: true,
          fontSize: 14,
          fillColor: '#CCCCCC', // Light gray background color
        },
        tableFooter: {
          bold: true,
          fontSize: 13,
          fillColor: '#CCCCCC', // Light gray background color
        },
        tableCell: {
          fontSize: 12,
        },
        notesSection: {
          marginLeft: 80,
        }
      },
      content: [
        {
          image: await this.base64Image1,
          width: 250,
          height: 150,
          alignment: 'left', // Center align the image horizontally
          margin: [0, 0], // Adjust the left and top margin
        },
        {
          image: await this.base64Image2,
          width: 310,
          height: 225,
          absolutePosition: { x: 300, y: 0 },
          margin: [0, 0], // Adjust the left and top margin
        },
        { text: '\n' },
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*'],
            body: [
              // Table header row with tableHeader style applied
              [{ text: 'Client Name', style: 'tableHeader' }, { text: 'Contact Number', style: 'tableHeader' }, { text: 'Email', style: 'tableHeader' }, { text: 'Address', style: 'tableHeader' }],
              ...this.data.map(item => [
                { text: item.clientName, style: 'tableCell' },
                { text: item.clientNumber, style: 'tableCell' },
                { text: item.clientEmail, style: 'tableCell' },
                { text: item.clientAddress, style: 'tableCell' },
              ])
            ]
          }
        },
        { text: '\n' },
        { text: this.notes },
      ],

      header: headerFunction,
      footer: function (currentPage: number, pageCount: number) {
        return { text: `Page ${currentPage} of ${pageCount}`, style: 'footer' };
      }
    };

    const pdfDocGenerator = pdfMake.createPdf(this.documentDefinition);
    pdfDocGenerator.download('ACS_Client_Report_' + this.currentDate + '.pdf');
  }

  // download selector
  onDownload(fileType: string, event: Event): void {
    event.preventDefault(); // Prevent the default link behavior

    if (fileType === 'pdf') {
      this.generatePDF();
    } else if (fileType === 'word') {
      // Generate Word file logic
    } else if (fileType === 'xsl') {
      // Generate XSL file logic
    }
  }

  back() {
    this.router.navigate(['/view-reports']);
  }
}
