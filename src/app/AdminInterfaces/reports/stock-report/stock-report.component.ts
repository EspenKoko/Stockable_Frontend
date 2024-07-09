import { Component, ElementRef, OnInit, VERSION, ViewChild } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { StockService } from 'src/app/services/stock.service';
import { Stock } from 'src/app/models/stocks';
import { ReportingService } from 'src/app/services/reporting.service';
import { PriceService } from 'src/app/services/price.service';
import { Price } from 'src/app/models/prices';
import { CurrencyPipe } from '@angular/common';
import { StockCategoryService } from 'src/app/services/stock-category.service';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { GeneralServices } from 'src/app/services/general-services';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

Chart.register(...registerables);

@Component({
  selector: 'app-stock-report',
  templateUrl: './stock-report.component.html',
  styleUrls: ['./stock-report.component.scss']
})
export class StockReportComponent implements OnInit {
  data: any[] = [];
  stockCategoryData: any[] = [];
  selectedStockCategories: number[] = []; // Array to store selected stock types

  printersCount: any[] = [];
  consumablesCount: any[] = [];
  partsCount: any[] = [];
  stockCount: number = 0;
  consumables: string = '';
  parts: string = '';
  printers: string = '';
  displayedAllStock: string = '';
  currencyPipe = new CurrencyPipe('en-ZA'); // Use 'en-ZA' locale for South African Rand

  documentDefinition!: TDocumentDefinitions;
  chart: any;
  notes: string = '';
  currentDate = this.generalService.getDate();

  // Convert the image to Base64
  imageUrl1 = 'assets/download.jpeg';
  imageUrl2 = 'assets/Report Headings/Slide1.JPG';
  base64Image1: Promise<string> = this.generalService.getImageAsBase64(this.imageUrl1);
  base64Image2: Promise<string> = this.generalService.getImageAsBase64(this.imageUrl2);

  constructor(private stockService: StockService,
    private stockCategoryService: StockCategoryService,
    public generalService: GeneralServices,
    private router: Router,
    private chartDataService: ReportingService,
    private priceService: PriceService) {
    // wont work in the ngOnInit
    this.stockService.getStocks().subscribe((result: any[]) => {
      this.populateChartData(result);
    });
  }

  async ngOnInit() {
    this.getStockCategories();
    await this.getStock()
  }

  async getStock(): Promise<void> {
    try {
      this.generalService.notFound = false;
      const result: any[] = await firstValueFrom(this.stockService.getStocks());
      this.stockCount = result.length;
      this.partsCount = result.filter(x => x.stockType.stockCategoryId == 1)
      this.consumablesCount = result.filter(x => x.stockType.stockCategoryId == 2)
      this.printersCount = result.filter(x => x.stockType.stockCategoryId == 3)

      for (const stock of result) {
        const result: any = await firstValueFrom(this.priceService.getPrices());
        const stockPrices: any[] = result;

        const filteredPrices = stockPrices.filter(price => price.stockId === stock.stockId);
        const mostRecentPrice: Price = filteredPrices[filteredPrices.length - 1];

        stock.price = mostRecentPrice;
      }

      //displays the pdf on page load
      //filter category by the selection
      if (this.selectedStockCategories.length === 0) {
        // Set relevant properties back to an empty string
        this.printers = "";
        this.consumables = "";
        this.parts = "";
        // Set the new property for displaying stock type
        this.displayedAllStock = "All Stock";

        this.data = result;
        this.displayPDF();
      } else {
        if (this.printersCount && this.printersCount.length > 0 && this.selectedStockCategories.includes(3)) {
          this.printers = "Printers";
        } else {
          this.printers = "";
        }
        if (this.consumablesCount && this.consumablesCount.length > 0 && this.selectedStockCategories.includes(2)) {
          this.consumables = "Consumables";
        } else {
          this.consumables = "";
        }
        if (this.partsCount && this.partsCount.length > 0 && this.selectedStockCategories.includes(1)) {
          this.parts = "Parts";
        } else {
          this.parts = "";
        }

        // Set the new property for displaying stock type
        this.displayedAllStock = "";

        // Filter the data based on selected stock types
        this.data = result.filter(x => this.selectedStockCategories.includes(x.stockType.stockCategoryId));
        this.displayPDF();
      }
    } catch (error) {
      this.generalService.handleOrdersError(error);
    }
  }

  getStockCategories() {
    this.stockCategoryService.getStockCategories().subscribe((result: any[]) => {
      // stores Stock Category data in an array for displaying
      this.stockCategoryData = result;
    })
  }

  //checks input for filtering
  updateselectedStockCategories(id: number) {
    const index = this.selectedStockCategories.indexOf(id);
    if (index !== -1) {
      this.selectedStockCategories.splice(index, 1);
    } else {
      this.selectedStockCategories.push(id);
    }
    this.getStock(); // Call the filter function after updating selected types
  }

  //generate hidden chart in html which displays on the printers dashboard
  populateChartData(data: Stock[]) {
    let labelsData: string[] = [];
    let labelsQuantity: number[] = [];

    data.forEach((element: any) => {
      labelsData.push(element.stockName);
      labelsQuantity.push(element.qtyOnHand)
    });

    // if (this.chart) {
    //   this.chart.destroy(); // Destroy the previous chart instance before rendering a new one
    // }

    this.chartDataService.setStockData(data);

    this.chart = new Chart("stockChart", {
      type: 'bar',
      data: {
        labels: labelsData,
        datasets: [{
          label: '# of stock available',
          data: labelsQuantity,
          borderWidth: 2,
          borderColor: 'black',
          backgroundColor: 'rgb(0, 187, 255)',
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              borderColor: 'black', // Change the color of the vertical grid lines
              color: 'rgba(255, 255, 255, 1)', // Change the color of the horizontal grid lines
            },
          },
        }
      }
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
        title: 'ACS Fintech Altron Stock Report',
        author: 'Espen Koko',
        subject: 'Report on current stock levels',
        keywords: 'Report on current stock levels',
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
      pageOrientation: 'portrait',

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
          width: 260,
          height: 180,
          absolutePosition: { x: 300, y: 10 },
        },
        { text: '\n' },
        { text: 'As of today there are ' + this.stockCount + ' different items of stock on the system, of which we have' },
        { text: this.printersCount.length + ' printer(s), ' + this.consumablesCount.length + ' consumable(s) and ' + this.partsCount.length + ' inventory part(s).' },
        { text: '\n' },
        { text: 'Currently displaying: ' },
        { text: this.displayedAllStock },
        { text: this.printers },
        { text: this.consumables },
        { text: this.parts },
        { text: '\n' },
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*'],
            body: [
              // Table header row with tableHeader style applied
              [{ text: 'Stock Name', style: 'tableHeader' },
              { text: 'Stock Type', style: 'tableHeader' },
              { text: 'Stock Category', style: 'tableHeader' },
              { text: 'QTY On Hand', style: 'tableHeader' },
              { text: 'Price', style: 'tableHeader' }],
              ...this.data.map(item => [
                { text: item.stockName, style: 'tableCell' },
                { text: item.stockType.stockTypeName, style: 'tableCell' },
                { text: item.stockType.stockCategory.stockCategoryName, style: 'tableCell' },
                { text: item.qtyOnHand, style: 'tableCell' },
                { text: this.currencyPipe.transform(item.price?.price, 'R ', 'symbol', '1.2-2') || "TBP", style: 'tableCell' }
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
        title: 'ACS Fintech Altron Stock Report',
        author: 'Espen Koko',
        subject: 'Report on current stock levels',
        keywords: 'Report on current stock levels',
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
      // pageOrientation: 'portrait',

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
          absolutePosition: { x: 280, y: 10 },
        },
        { text: '\n' },
        { text: 'As of today there are ' + this.stockCount + ' different items of stock on the system, of which we have' },
        { text: this.printersCount.length + ' printer(s), ' + this.consumablesCount.length + ' consumable(s) and ' + this.partsCount.length + ' inventory part(s).' },
        { text: '\n' },
        { text: 'Currently displaying: ' },
        { text: this.displayedAllStock },
        { text: this.printers },
        { text: this.consumables },
        { text: this.parts },
        { text: '\n' },
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*'],
            body: [
              // Table header row with tableHeader style applied
              [{ text: 'Stock Name', style: 'tableHeader' },
              { text: 'Stock Type', style: 'tableHeader' },
              { text: 'Stock Category', style: 'tableHeader' },
              { text: 'QTY On Hand', style: 'tableHeader' },
              { text: 'Price', style: 'tableHeader' }],
              ...this.data.map(item => [
                { text: item.stockName, style: 'tableCell' },
                { text: item.stockType.stockTypeName, style: 'tableCell' },
                { text: item.stockType.stockCategory.stockCategoryName, style: 'tableCell' },
                { text: item.qtyOnHand, style: 'tableCell' },
                { text: this.currencyPipe.transform(item.price?.price, 'R ', 'symbol', '1.2-2') || "TBP", style: 'tableCell' }
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
    pdfDocGenerator.download('ACS_Stock_Report_' + this.currentDate + '.pdf');
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
    return this.router.navigate(['/view-reports'])
  }
}
