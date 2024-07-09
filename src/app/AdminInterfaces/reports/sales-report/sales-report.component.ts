import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom, forkJoin, map } from 'rxjs';
import { Price } from 'src/app/models/prices';
import { PriceService } from 'src/app/services/price.service';
import { ClientOrderService } from 'src/app/services/client-order.service';
import { ClientOrderStockService } from 'src/app/services/client-stock-order.service';
import { ClientOrder } from 'src/app/models/clientOrders';
import { ClientOrderStock } from 'src/app/models/clientOrderStock';
import { Markup } from 'src/app/models/markup';
import { Vat } from 'src/app/models/vat';
import { PaymentTypeService } from 'src/app/services/payment-method.service';
import { PaymentType } from 'src/app/models/paymentType';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { GeneralServices } from 'src/app/services/general-services';
import { clientStockOrderVM } from 'src/app/viewModels/clientStockOrderVM';
import { ClientService } from 'src/app/services/client.service';
import { Client } from 'src/app/models/clients';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.scss']
})
export class SalesReportComponent {
  data: any[] = []; // of type clientOrder
  cosData: any[] = []; // of type clientOrderStock
  paymentTypeData: any[] = []; //of type PaymenType
  selectedPaymentTypes: number[] = []; // Array to store selected stock categories

  //############
  stockCatData: { [key: string]: any[] } = {
    consumableData: [],
    partData: [],
    printerData: []
  };

  consumableData: any[] = [];
  partData: any[] = [];
  printerData: any[] = [];

  consumables: any[] = [];
  printers: any[] = [];
  parts: any[] = [];

  consumableTotal: number = 0;
  partTotal: number = 0;
  printerTotal: number = 0;

  grandTotal2: number = 0;
  grandTotalVat: number = 0;
  // #############

  fromSelectedSalePeriod: Date = new Date(0);
  toSelectedSalePeriod: Date = new Date();
  today: Date = new Date();

  VAT!: Vat;
  markup!: Markup;
  grandTotal: number = 0;
  vatTotal: number = 0;
  profit: number = 0;
  currencyPipe = new CurrencyPipe('en-ZA'); // Use 'en-ZA' locale for South African Rand

  documentDefinition!: TDocumentDefinitions;

  notes: string = '';
  currentDate = this.generalService.getDate();

  // Convert the image to Base64
  imageUrl1 = 'assets/download.jpeg';
  imageUrl2 = 'assets/Report Headings/Slide2.JPG';
  base64Image1: Promise<string> = this.generalService.getImageAsBase64(this.imageUrl1);
  base64Image2: Promise<string> = this.generalService.getImageAsBase64(this.imageUrl2);
  clientData: Client[] = [];

  constructor(private clientOrderService: ClientOrderService,
    private cosService: ClientOrderStockService,
    private paymentTypeService: PaymentTypeService,
    public generalService: GeneralServices,
    private router: Router,
    private priceService: PriceService,
    private datePipe: DatePipe) {
    this.getStockClientOrders();
    // this.getOrders();
  }

  async ngOnInit() {
    this.cosService.getClientOrderStocks().subscribe((result: ClientOrderStock[]) => {
      this.consumableData = result.filter(x => x.stock.stockType.stockCategory.stockCategoryName == "Consumable");
      this.partData = result.filter(x => x.stock.stockType.stockCategory.stockCategoryName == "Part");
      this.printerData = result.filter(x => x.stock.stockType.stockCategory.stockCategoryName == "Printer");
      console.log(this.consumableData, this.printerData, this.partData);
    })

    this.VAT = await this.generalService.getVat()
    this.markup = await this.generalService.getMarkup()
    this.getPaymentTypes();
    this.getStockClientOrders();
    await this.getOrders();
  }

  getPaymentTypes() {
    this.paymentTypeService.getPaymentTypes().subscribe((result: any[]) => {
      this.paymentTypeData = result;
    })
  }

  getStockClientOrders() {
    // ###################
    // An array to hold the observables from getPrices() calls for consumables
    const consumablePriceObservables = this.consumableData.map((stock: any) => {
      return this.priceService.getPrices().pipe(
        map((result: any) => {
          const stockPrices: any[] = result;
          const filteredPrices = stockPrices.filter(price => price.stockId === stock.stockId);
          const mostRecentPrice: Price = filteredPrices[filteredPrices.length - 1];

          const consumables = new clientStockOrderVM(stock, mostRecentPrice);
          return consumables;
        })
      );
    });

    // Wait for all observables to complete using forkJoin
    forkJoin(consumablePriceObservables).subscribe((consumables: clientStockOrderVM[]) => {
      const consumableMap = new Map();

      consumables.forEach(order => {
        const clientOrderId = order.cosData.clientOrderId;

        if (!consumableMap.has(consumables)) {
          // Create an object for the unique client order
          const uniqueOrder = { ...order, QTY: 0, Total: 0 };

          // Add the current stock to the stocks array
          uniqueOrder.QTY += order.cosData.qty;
          uniqueOrder.Total += (order.cosData.qty * order.price.price);

          // Store the unique client order in the map
          consumableMap.set(clientOrderId, uniqueOrder);
        } else {
          // If the client order already exists, add the current stock to its stocks array
          const existingOrder = consumableMap.get(clientOrderId);
          existingOrder.stocks.push(order.cosData);
        }
      });

      // Convert the map values to an array
      this.consumables = Array.from(consumableMap.values());

      // Calculate the total price for consumables
      this.consumableTotal = this.consumables.reduce((total, consumable) => total + (consumable.cosData.qty * consumable.price.price), 0);
    });

    // ###################
    // An array to hold the observables from getPrices() calls for parts
    const partPriceObservables = this.partData.map((stock: any) => {
      return this.priceService.getPrices().pipe(
        map((result: any) => {
          const stockPrices: any[] = result;
          const filteredPrices = stockPrices.filter(price => price.stockId === stock.stockId);
          const mostRecentPrice: Price = filteredPrices[filteredPrices.length - 1];

          const parts = new clientStockOrderVM(stock, mostRecentPrice);
          return parts;
        })
      );
    });

    // Wait for all observables to complete using forkJoin
    forkJoin(partPriceObservables).subscribe((parts: clientStockOrderVM[]) => {
      const partMap = new Map();

      parts.forEach(order => {
        const clientOrderId = order.cosData.clientOrderId;

        if (!partMap.has(parts)) {
          // Create an object for the unique client order
          const uniqueOrder = { ...order, QTY: 0, Total: 0 };

          // Add the current stock to the stocks array
          uniqueOrder.QTY += order.cosData.qty;
          uniqueOrder.Total += (order.cosData.qty * order.price.price);

          // Store the unique client order in the map
          partMap.set(clientOrderId, uniqueOrder);
        } else {
          // If the client order already exists, add the current stock to its stocks array
          const existingOrder = partMap.get(clientOrderId);
          existingOrder.stocks.push(order.cosData);
        }
      });

      // Convert the map values to an array
      this.parts = Array.from(partMap.values());

      // Calculate the total price for parts
      this.partTotal = this.parts.reduce((total, part) => total + (part.cosData.qty * part.price.price), 0);
    });

    // ###################
    // An array to hold the observables from getPrices() calls for printers
    const printerPriceObservables = this.printerData.map((stock: any) => {
      return this.priceService.getPrices().pipe(
        map((result: any) => {
          const stockPrices: any[] = result;
          const filteredPrices = stockPrices.filter(price => price.stockId === stock.stockId);
          const mostRecentPrice: Price = filteredPrices[filteredPrices.length - 1];

          const printers = new clientStockOrderVM(stock, mostRecentPrice);
          return printers;
        })
      );
    });

    // Wait for all observables to complete using forkJoin
    forkJoin(printerPriceObservables).subscribe((printers: clientStockOrderVM[]) => {
      const printerMap = new Map();

      printers.forEach(order => {
        const clientOrderId = order.cosData.clientOrderId;

        if (!printerMap.has(printers)) {
          // Create an object for the unique client order
          const uniqueOrder = { ...order, QTY: 0, Total: 0 };

          // Add the current stock to the stocks array
          uniqueOrder.QTY += order.cosData.qty;
          uniqueOrder.Total += (order.cosData.qty * order.price.price);

          // Store the unique client order in the map
          printerMap.set(clientOrderId, uniqueOrder);
        } else {
          // If the client order already exists, add the current stock to its stocks array
          const existingOrder = printerMap.get(clientOrderId);
          existingOrder.stocks.push(order.cosData);
        }
      });

      // Convert the map values to an array
      this.printers = Array.from(printerMap.values());

      // Calculate the total price for printers
      this.printerTotal = this.printers.reduce((total, printer) => total + (printer.cosData.qty * printer.price.price), 0);
    });
  }

  async getOrders(): Promise<void> {
    try {
      this.generalService.notFound = false;
      // console.log("From: ", this.fromSelectedSalePeriod, " To ", this.toSelectedSalePeriod)
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

      //COResult of type client order
      const COResult: any[] = await firstValueFrom(this.clientOrderService.getClientOrders());
      let data: any[] = [];

      // on form reset properties are initialised to null
      // when calling the property in the new Date() thje newly declared const are set to the value of new Date(0) which is "Thu Jan 01 1970 02:00:00 GMT+0200 (South Africa Standard Time)"
      // this will only change when a new input is selected in the dart time picker for the one, the other or both date time pickers
      const fromDate = new Date(this.fromSelectedSalePeriod);
      const toDate = new Date(this.toSelectedSalePeriod);

      // re-initialise the new property to default as COResult
      let filteredCOResult = COResult;
      // console.log("From: ", fromDate, " To ", toDate)

      //must use selectedSalePeriod value here becuase locally declared properties will be "Thu Jan 01 1970 02:00:00 GMT+0200 (South Africa Standard Time)" at this point
      if (this.fromSelectedSalePeriod == null && this.toSelectedSalePeriod == null) {
        //filters to only display report for current month
        filteredCOResult = COResult.filter(x => new Date(x.clientInvoice.clientInvoiceDate) > firstDayOfMonth);
        console.log("not nice")
      }
      //for a period starting from a certain point onwards
      else if (fromDate && this.fromSelectedSalePeriod != null && toDate && this.toSelectedSalePeriod == null) {
        filteredCOResult = COResult.filter(x => new Date(x.clientInvoice.clientInvoiceDate) >= fromDate);
        console.log("nice+")
      }
      //for a period leading up to a certain point
      else if (fromDate && this.fromSelectedSalePeriod == null && toDate && this.toSelectedSalePeriod != null) {
        filteredCOResult = COResult.filter(x => new Date(x.clientInvoice.clientInvoiceDate) <= toDate);
        console.log("nice-")
      }
      //for a period between two dates
      else if (fromDate != new Date(0) && this.fromSelectedSalePeriod != null && toDate != this.today && this.toSelectedSalePeriod != null) {
        // Filter the data based on the clientInvoiceDate within the selected sale period
        filteredCOResult = COResult.filter(x =>
          new Date(x.clientInvoice.clientInvoiceDate) >= fromDate &&
          new Date(x.clientInvoice.clientInvoiceDate) <= toDate);
        console.log("nice")
      }

      // Reset the properties to their initial state
      this.grandTotal = 0;
      this.vatTotal = 0;
      this.profit = 0;
      this.data = [];

      //filter
      if (this.selectedPaymentTypes.length > 0 && this.selectedPaymentTypes != null) {
        filteredCOResult = filteredCOResult.filter((x: any) => this.selectedPaymentTypes.includes(x.paymentTypeId))
      }

      for (const Order of filteredCOResult) {
        let CO_Data: any = Order;

        // COSResult of type clientStockOrder
        const COSResult: any[] = await firstValueFrom(this.cosService.getClientOrderStocks());

        let totExVat: number = 0;
        let vatAmount: number = 0;
        let profit: number = 0;

        //of type clientStockOrder
        for (const COS_Data of COSResult.filter(x => x.clientOrderId == Order.clientOrderId)) {
          const stockPrices: any[] = await firstValueFrom(this.priceService.getPrices());

          // Retrieve the prices with the same stock ID as the current stock
          const filteredPrices = stockPrices.filter(price => price.stockId === COS_Data.stockId);
          const mostRecentPrice: Price = filteredPrices[filteredPrices.length - 1];

          //stock markup and vat
          totExVat += (mostRecentPrice.price * COS_Data.qty) + (mostRecentPrice.price * COS_Data.qty * this.markup.markupPercent);
          vatAmount += totExVat * this.VAT.vatPercent;
          profit += mostRecentPrice.price * COS_Data.qty * this.markup.markupPercent;
        }

        //data for the table
        CO_Data.saleTotal = totExVat + vatAmount;

        //totals for the table
        this.grandTotal += totExVat + vatAmount;
        this.vatTotal += vatAmount;
        this.profit += profit;

        data.push(CO_Data)
      }
      this.data = data;
      this.displayPDF();
    } catch (error) {
      this.generalService.handleOrdersError(error);
    }
  }

  clearFilters() {
    // this.fromSelectedSalePeriod = new Date(0);
    // this.toSelectedSalePeriod = new Date();
    this.selectedPaymentTypes = [];
    this.refreshPDF();
  }

  //checks input for filtering
  updateSelectedPaymentTypes(id: number) {
    const index = this.selectedPaymentTypes.indexOf(id);
    if (index !== -1) {
      this.selectedPaymentTypes.splice(index, 1);
    } else {
      this.selectedPaymentTypes.push(id);
    }
    this.getOrders(); // Call the filter function after updating selected types
  }

  //refresh pdf everytime a note is added
  refreshPDF() {
    // displayPDF method inside getOrders method
    if (this.notes.length > 0 && this.notes != '') {
      this.getOrders();
    }
    else {
      this.notes = '';
      this.getOrders();
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
        title: 'ACS Fintech Altron Sales Report',
        author: 'Espen Koko',
        subject: 'Report on sales',
        keywords: 'Report on sales',
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
          absolutePosition: { x: 525, y: 10 },
        },
        { text: '\n' },
        { text: 'Sales of stock items' },
        { text: '\n' },
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*'],
            body: [
              // Table header row with tableHeader style applied
              [{ text: 'Stock Type ', style: 'tableHeader', noWrap: true },
              { text: 'Descriptions', style: 'tableHeader' },
              { text: 'QTY Sold', style: 'tableHeader' },
              { text: 'Unit Prices', style: 'tableHeader' },
              { text: 'Total', style: 'tableHeader', noWrap: true }],
              [{ text: 'Consumables ', style: 'tableHeader', noWrap: true },
              { text: 'Description', style: 'tableHeader' },
              { text: 'QTY', style: 'tableHeader' },
              { text: 'Unit Price', style: 'tableHeader' },
              { text: 'Total', style: 'tableHeader', noWrap: true }],
              ...this.consumables.map(item => [
                { text: item.cosData.stock.stockName, style: 'tableCell' },
                { text: item.cosData.stock.stockDescription, style: 'tableCell' },
                { text: item.QTY, style: 'tableCell' },
                { text: item.price?.price, style: 'tableCell' },
                { text: this.currencyPipe.transform(item.QTY * item.price?.price, 'R ', 'symbol', '1.2-2'), style: 'tableCell' },
              ]),
              [
                { text: 'Total consumable sales ', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: this.currencyPipe.transform(this.consumableTotal, 'R ', 'symbol', '1.2-2'), style: 'tableFooter' },
              ],
              [{ text: 'Parts ', style: 'tableHeader', noWrap: true },
              { text: 'Description', style: 'tableHeader' },
              { text: 'QTY', style: 'tableHeader' },
              { text: 'Unit Price', style: 'tableHeader' },
              { text: 'Total', style: 'tableHeader', noWrap: true }],
              ...this.parts.map(item => [
                { text: item.cosData.stock.stockName, style: 'tableCell' },
                { text: item.cosData.stock.stockDescription, style: 'tableCell' },
                { text: item.QTY, style: 'tableCell' },
                { text: item.price?.price, style: 'tableCell' },
                { text: this.currencyPipe.transform(item.QTY * item.price?.price, 'R ', 'symbol', '1.2-2'), style: 'tableCell' },
              ]),
              [
                { text: 'Total part sales ', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: this.currencyPipe.transform(this.partTotal, 'R ', 'symbol', '1.2-2'), style: 'tableFooter' },
              ],
              [{ text: 'Printer ', style: 'tableHeader', noWrap: true },
              { text: 'Description', style: 'tableHeader' },
              { text: 'QTY', style: 'tableHeader' },
              { text: 'Unit Price', style: 'tableHeader' },
              { text: 'Total', style: 'tableHeader', noWrap: true }],
              ...this.printers.map(item => [
                { text: item.cosData.stock.stockName, style: 'tableCell' },
                { text: item.cosData.stock.stockDescription, style: 'tableCell' },
                { text: item.QTY, style: 'tableCell' },
                { text: item.price?.price, style: 'tableCell' },
                { text: this.currencyPipe.transform(item.QTY * item.price?.price, 'R ', 'symbol', '1.2-2'), style: 'tableCell' },
              ]),
              [
                { text: 'Total printer sales ', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: this.currencyPipe.transform(this.printerTotal, 'R ', 'symbol', '1.2-2'), style: 'tableFooter' },
              ],
            ]
          },
        },
        { text: '\n' },
        { text: '\n' },
        { text: 'Sales Invoices' },
        { text: '\n' },
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            headerRows: 1,
            widths: ['*', 180, '*', '*', '*'],
            body: [
              // Table header row with tableHeader style applied
              [{ text: 'Invoice number', style: 'tableHeader', noWrap: true },
              { text: 'Name', style: 'tableHeader' },
              { text: 'Payment Type', style: 'tableHeader' },
              { text: 'Date', style: 'tableHeader' },
              { text: 'Total', style: 'tableHeader', noWrap: true }],
              ...this.data.map(item => [
                { text: item.clientInvoice?.clientInvoiceNumber, style: 'tableCell' },
                { text: item.clientUser.client.clientName + "- " + item.clientUser?.user.userFirstName + " " + item.clientUser?.user.userLastName, style: 'tableCell' },
                { text: item.paymentType?.paymentTypeName, style: 'tableCell' },
                { text: this.datePipe.transform(item.clientInvoice?.clientInvoiceDate, 'dd/MM/yyyy'), style: 'tableCell' },
                { text: this.currencyPipe.transform(item.saleTotal, 'R ', 'symbol', '1.2-2'), style: 'tableCell' },
              ]),
              [
                { text: 'Vat ' + this.VAT?.vatPercent * 100 + '%:', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: this.currencyPipe.transform(this.vatTotal, 'R ', 'symbol', '1.2-2'), style: 'tableFooter' },
              ],
              [
                { text: 'Gross Profit:', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: this.currencyPipe.transform(this.profit, 'R ', 'symbol', '1.2-2'), style: 'tableFooter' },
              ],
              [
                { text: 'Total Sales:', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: this.currencyPipe.transform(this.grandTotal, 'R ', 'symbol', '1.2-2'), style: 'tableFooter' },
              ],
            ]
          },
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
        title: 'ACS Fintech Altron Sales Report',
        author: 'Espen Koko',
        subject: 'Report on sales',
        keywords: 'Report on sales',
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
          absolutePosition: { x: 525, y: 10 },
        },
        { text: '\n' },
        {
          // layout: 'lightHorizontalLines', // optional
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*'],
            body: [
              // Table header row with tableHeader style applied
              [{ text: 'Stock Type ', style: 'tableHeader', noWrap: true },
              { text: 'Descriptions', style: 'tableHeader' },
              { text: 'QTY Sold', style: 'tableHeader' },
              { text: 'Unit Prices', style: 'tableHeader' },
              { text: 'Total', style: 'tableHeader', noWrap: true }],
              [{ text: 'Consumables ', style: 'tableHeader', noWrap: true },
              { text: 'Description', style: 'tableHeader' },
              { text: 'QTY', style: 'tableHeader' },
              { text: 'Unit Price', style: 'tableHeader' },
              { text: 'Total', style: 'tableHeader', noWrap: true }],
              ...this.consumables.map(item => [
                { text: item.cosData.stock.stockName, style: 'tableCell' },
                { text: item.cosData.stock.stockDescription, style: 'tableCell' },
                { text: item.QTY, style: 'tableCell' },
                { text: item.price?.price, style: 'tableCell' },
                { text: this.currencyPipe.transform(item.QTY * item.price?.price, 'R ', 'symbol', '1.2-2'), style: 'tableCell' },
              ]),
              [
                { text: 'Total consumable sales ', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: this.currencyPipe.transform(this.consumableTotal, 'R ', 'symbol', '1.2-2'), style: 'tableFooter' },
              ],
              [{ text: 'Parts ', style: 'tableHeader', noWrap: true },
              { text: 'Description', style: 'tableHeader' },
              { text: 'QTY', style: 'tableHeader' },
              { text: 'Unit Price', style: 'tableHeader' },
              { text: 'Total', style: 'tableHeader', noWrap: true }],
              ...this.parts.map(item => [
                { text: item.cosData.stock.stockName, style: 'tableCell' },
                { text: item.cosData.stock.stockDescription, style: 'tableCell' },
                { text: item.QTY, style: 'tableCell' },
                { text: item.price?.price, style: 'tableCell' },
                { text: this.currencyPipe.transform(item.QTY * item.price?.price, 'R ', 'symbol', '1.2-2'), style: 'tableCell' },
              ]),
              [
                { text: 'Total part sales ', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: this.currencyPipe.transform(this.partTotal, 'R ', 'symbol', '1.2-2'), style: 'tableFooter' },
              ],
              [{ text: 'Printer ', style: 'tableHeader', noWrap: true },
              { text: 'Description', style: 'tableHeader' },
              { text: 'QTY', style: 'tableHeader' },
              { text: 'Unit Price', style: 'tableHeader' },
              { text: 'Total', style: 'tableHeader', noWrap: true }],
              ...this.printers.map(item => [
                { text: item.cosData.stock.stockName, style: 'tableCell' },
                { text: item.cosData.stock.stockDescription, style: 'tableCell' },
                { text: item.QTY, style: 'tableCell' },
                { text: item.price?.price, style: 'tableCell' },
                { text: this.currencyPipe.transform(item.QTY * item.price?.price, 'R ', 'symbol', '1.2-2'), style: 'tableCell' },
              ]),
              [
                { text: 'Total printer sales ', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: this.currencyPipe.transform(this.printerTotal, 'R ', 'symbol', '1.2-2'), style: 'tableFooter' },
              ],
            ]
          },
        },
        { text: '\n' },
        { text: '\n' },
        { text: 'Sales Invoices' },
        { text: '\n' },
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            headerRows: 1,
            widths: ['*', 180, '*', '*', '*'],
            body: [
              // Table header row with tableHeader style applied
              [{ text: 'Invoice number', style: 'tableHeader', noWrap: true },
              { text: 'Name', style: 'tableHeader' },
              { text: 'Payment Type', style: 'tableHeader' },
              { text: 'Date', style: 'tableHeader' },
              { text: 'Total', style: 'tableHeader', noWrap: true }],
              ...this.data.map(item => [
                { text: item.clientInvoice.clientInvoiceNumber, style: 'tableCell' },
                { text: item.clientUser.client.clientName + "- " + item.clientUser.user.userFirstName + " " + item.clientUser.user.userLastName, style: 'tableCell' },
                { text: item.paymentType.paymentTypeName, style: 'tableCell' },
                { text: this.datePipe.transform(item.clientInvoice.clientInvoiceDate, 'dd/MM/yyyy'), style: 'tableCell' },
                { text: this.currencyPipe.transform(item.saleTotal, 'R ', 'symbol', '1.2-2'), style: 'tableCell' },
              ]),
              [
                { text: 'Vat ' + this.VAT?.vatPercent * 100 + '%:', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: this.currencyPipe.transform(this.vatTotal, 'R ', 'symbol', '1.2-2'), style: 'tableFooter' },
              ],
              [
                { text: 'Gross Profit:', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: this.currencyPipe.transform(this.profit, 'R ', 'symbol', '1.2-2'), style: 'tableFooter' },
              ],
              [
                { text: 'Total Sales:', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: '', style: 'tableFooter' },
                { text: this.currencyPipe.transform(this.grandTotal, 'R ', 'symbol', '1.2-2'), style: 'tableFooter' },
              ],
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
    pdfDocGenerator.download('ACS_Sales_Report_' + this.currentDate + '.pdf');
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