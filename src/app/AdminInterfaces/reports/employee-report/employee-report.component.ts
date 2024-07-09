import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';
import { Employee } from 'src/app/models/employees';
import { EmployeeTypeService } from 'src/app/services/employee-type.service';
import { firstValueFrom } from 'rxjs';

import { TDocumentDefinitions } from 'pdfmake/interfaces';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { GeneralServices } from 'src/app/services/general-services';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-employee-report',
  templateUrl: './employee-report.component.html',
  styleUrls: ['./employee-report.component.scss'],
})
export class EmployeeReportComponent {
  data: any[] = [];
  today: Date = new Date()
  employeeTypeData: any[] = [];
  selectedEmployeeTypes: number[] = []; // Array to store selected employee types

  empCount: number = 0;
  technicianCount: any[] = [];
  clerkCount: any[] = [];
  adminCount: any[] = [];
  technician: string = '';
  clerk: string = '';
  admin: string = '';
  displayedEmployeeType: string = '';

  showComponent: Boolean = true;
  notes: string = '';
  documentDefinition!: TDocumentDefinitions;
  currentDate = this.generalService.getDate();

  // Convert the image to Base64
  imageUrl1 = 'assets/download.jpeg';
  imageUrl2 = 'assets/Report Headings/Slide5.JPG';
  base64Image1: Promise<string> = this.generalService.getImageAsBase64(this.imageUrl1);
  base64Image2: Promise<string> = this.generalService.getImageAsBase64(this.imageUrl2);

  constructor(
    private employeeService: EmployeeService,
    private employeeTypeService: EmployeeTypeService,
    private router: Router,
    public generalService: GeneralServices,) {

  }

  ngOnInit(): void {
    this.getEmployeeTypes();
    this.getEmployees();
  }

  getEmployeeTypes() {
    this.employeeTypeService.getEmployeeTypes().subscribe((result: any[]) => {
      this.employeeTypeData = result;
    })
  }
  
  async getEmployees(): Promise<void> {
    try {
      this.generalService.notFound = false;
      const result: Employee[] = await firstValueFrom(this.employeeService.getEmployees());

      this.empCount = result.length;
      this.adminCount = result.filter(x => x.employeeTypeId == 1)
      this.technicianCount = result.filter(x => x.employeeTypeId == 2)
      this.clerkCount = result.filter(x => x.employeeTypeId == 3)

      //displays the pdf on page load
      //filter category by the selection
      if (this.selectedEmployeeTypes.length === 0) {
        // Set relevant properties back to an empty string
        this.admin = "";
        this.technician = "";
        this.clerk = "";
        // Set the new property for displaying employee type
        this.displayedEmployeeType = "All Employees";

        this.data = result;
        this.displayPDF();
      } else {
        if (this.adminCount && this.adminCount.length > 0 && this.selectedEmployeeTypes.includes(1)) {
          this.admin = "Admin";
        } else {
          this.admin = "";
        }
        if (this.technicianCount && this.technicianCount.length > 0 && this.selectedEmployeeTypes.includes(2)) {
          this.technician = "Technician";
        } else {
          this.technician = "";
        }
        if (this.clerkCount && this.clerkCount.length > 0 && this.selectedEmployeeTypes.includes(3)) {
          this.clerk = "Inventory clerk";
        } else {
          this.clerk = "";
        }

        // Set the new property for displaying employee type
        this.displayedEmployeeType = "";

        // Filter the data based on selected employee types
        this.data = result.filter(x => this.selectedEmployeeTypes.includes(x.employeeTypeId));
        this.displayPDF();
      }

      this.data.forEach((emp) => {
        // Check if empHireDate is a string (or any other format)
        if (typeof emp.empHireDate === 'string') {
          emp.empHireDate = new Date(emp.empHireDate); // Parse the string into a Date object
        }

        let empHireDate = emp.empHireDate.getDate();
        let date = new Date().getDate();

        emp.durationOfEmployment = date - empHireDate;
      });
    } catch (error) {
      this.generalService.handleOrdersError(error);
    }
  }

  //checks input for filtering
  updateSelectedEmployeeType(id: number) {
    const index = this.selectedEmployeeTypes.indexOf(id);
    if (index !== -1) {
      this.selectedEmployeeTypes.splice(index, 1);
    } else {
      this.selectedEmployeeTypes.push(id);
    }
    this.getEmployees(); // Call the filter function after updating selected types
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
        title: 'ACS Fintech Altron Employee Report',
        author: 'Espen Koko',
        subject: 'Report on employees on the system',
        keywords: 'Report on employees on the system',
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
        fontSize: 70,
        color: 'orange',
        opacity: 0.1,
        bold: true,
        angle: 300
      },
      styles: {
        header: {
          fontSize: 10,
          color: 'gray',
          marginTop: 25,
          marginLeft: 25,
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
          absolutePosition: { x: 530, y: 0 },
        },
        { text: '\n' },
        { text: 'As of today there are ' + this.empCount + ' employees working for ACS Fintech, of which we have' },
        { text: this.adminCount.length + ' admin(s), ' + this.technicianCount.length + ' technicians(s) and ' + this.clerkCount.length + ' inventory clerks(s).' },
        { text: '\n' },
        { text: 'Currently displaying: ' },
        { text: this.displayedEmployeeType },
        { text: this.admin },
        { text: this.technician },
        { text: this.clerk },
        { text: '\n' },
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            headerRows: 1,
            widths: [150, 100, 120, 150, 200],
            body: [
              // Table header row with tableHeader style applied
              [{ text: 'Employee Name', style: 'tableHeader', noWrap: true },
              { text: 'Contact Number', style: 'tableHeader', noWrap: true },
              { text: 'Employee Type', style: 'tableHeader' },
              { text: 'Email', style: 'tableHeader' },
              { text: 'Duration Of Employment (Days)', style: 'tableHeader', noWrap: true }],
              ...this.data.map(item => [
                { text: item.user.userFirstName + " " + item.user.userLastName, style: 'tableCell' },
                { text: item.user.phoneNumber, style: 'tableCell' },
                { text: item.employeeType.employeeTypeName, style: 'tableCell' },
                { text: item.user.email, style: 'tableCell' },
                { text: item.durationOfEmployment, style: 'tableCell' },
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
        title: 'ACS Fintech Altron Employee Report',
        author: 'Espen Koko',
        subject: 'Report on employees on the system',
        keywords: 'Report on employees on the system',
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
        fontSize: 70,
        color: 'orange',
        opacity: 0.1,
        bold: true,
        angle: 300
      },
      styles: {
        header: {
          fontSize: 10,
          color: 'gray',
          marginTop: 25,
          marginLeft: 25,
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
          absolutePosition: { x: 530, y: 0 },
        },
        { text: '\n' },
        { text: 'As of today there are ' + this.empCount + ' employees working for ACS Fintech, of which we have' },
        { text: this.adminCount.length + ' admin(s), ' + this.technicianCount.length + ' technicians(s) and ' + this.clerkCount.length + ' inventory clerks(s).' },
        { text: '\n' },
        { text: 'Currently displaying: ' },
        { text: this.displayedEmployeeType },
        { text: this.admin },
        { text: this.technician },
        { text: this.clerk },
        { text: '\n' },
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            headerRows: 1,
            widths: [150, 100, 120, 150, 200],
            body: [
              // Table header row with tableHeader style applied
              [{ text: 'Employee Name', style: 'tableHeader', noWrap: true },
              { text: 'Contact Number', style: 'tableHeader', noWrap: true },
              { text: 'Employee Type', style: 'tableHeader' },
              { text: 'Email', style: 'tableHeader' },
              { text: 'Duration Of Employment (Days)', style: 'tableHeader', noWrap: true }],
              ...this.data.map(item => [
                { text: item.user.userFirstName + " " + item.user.userLastName, style: 'tableCell' },
                { text: item.user.phoneNumber, style: 'tableCell' },
                { text: item.employeeType.employeeTypeName, style: 'tableCell' },
                { text: item.user.email, style: 'tableCell' },
                { text: item.durationOfEmployment, style: 'tableCell' },
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
    pdfDocGenerator.download('ACS_Employee_Report_' + this.currentDate + '.pdf');
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
