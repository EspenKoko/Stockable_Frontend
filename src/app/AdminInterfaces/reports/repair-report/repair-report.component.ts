  import { Component, OnInit } from '@angular/core';
  import { RepairService } from 'src/app/services/repair.service';
  import { Chart } from 'chart.js';
  import { Router } from '@angular/router';
  import jsPDF from 'jspdf';
  import html2canvas from 'html2canvas';
import { ReportingService } from 'src/app/services/reporting.service';

  
  @Component({
    selector: 'app-repair-report',
    templateUrl: './repair-report.component.html',
    styleUrls: ['./repair-report.component.scss']
  })
  export class RepairReportComponent implements OnInit {

    data: any[] = [];
    chart: any;
    date: any;
    statusTableData: { label: string, value: number }[] = []; // Added for table data

    constructor(private repairService: RepairService,
    private chartDataService: ReportingService,
    private router: Router) { }

    ngOnInit(): void {
      this.repairService.getRepairs().subscribe((result: any[]) => {
        // Filter out repair statuses with IDs 4 and 8
        this.data = result.filter(item => item.repairStatus.repairStatusId !== 4 && item.repairStatus.repairStatusId !== 8);

        const currentDate = new Date();

        const formattedDate = currentDate.toLocaleDateString('en-US');

        this.date = formattedDate

        this.createPieChart();
      });
    }

    createPieChart(): void {
      // Create an array of all possible status labels
      const allStatusLabels = ['Awaiting Diagnostics', 'Assessed', 'Awaiting Purchase Order Approval', 'Awaiting Parts', 'Being Repaired', 'Awaiting payment'];
    
      // Initialize data values for all labels to zero
      const dataValues = allStatusLabels.map(() => 0);
    
      // Update data values based on actual repair data
      this.data.forEach((repair) => {
        const statusName = repair.repairStatus.repairStatusName;
        const index = allStatusLabels.indexOf(statusName);
        if (index !== -1) {
          dataValues[index]++;
        }
      });

    this.chartDataService.setRepairData(this.data);
    
      // Create chart data using allStatusLabels and dataValues
      const chartData = {
        labels: allStatusLabels,
        datasets: [
          {
            label: 'Repair Progress',
            data: dataValues,
            backgroundColor: [
              '#FF5733',
              '#36A2EB',
              '#FFCE56',
              '#6FCF97',
              '#F2994A',
              '#A569BD',
            ],
            hoverBackgroundColor: [
              '#FF5733',
              '#36A2EB',
              '#FFCE56',
              '#6FCF97',
              '#F2994A',
              '#A569BD',
            ],
            borderColor: 'black',
            borderWidth: 1,
          },
        ],
      };
      
    
      // Clear existing chart (if any)
      if (this.chart) {
        this.chart.destroy();
      }

      // Calculate the maximum data value
      const maxDataValue = Math.max(...dataValues);

      // Calculate the highest y-axis value two steps higher
      const maxYValue = Math.ceil(maxDataValue / 2) * 2 + 1;
    
      // Create new chart
      const ctx = document.getElementById('repairStatusChart') as HTMLCanvasElement;
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
          scales: {
            x: {
              type: 'category',
              // beginAtZero: true,
            },
            y: {
              beginAtZero: true,
              max: maxYValue,
              ticks: {
                stepSize: 1, // Set the step size to 1 to display whole numbers only
              },
            },
          },
        },
      });
    }
    

    populateStatusTable(labels: string[], dataValues: number[]): void {
      this.statusTableData = labels.map((label, index) => {
        return { label, value: dataValues[index] };
      });
    }

    populateStatusList(labels: string[], dataValues: unknown[]): void {
      const statusList = document.querySelector('.status-list');
      if (statusList) {
        statusList.innerHTML = ''; // Clear previous list items

        for (let i = 0; i < labels.length; i++) {
          const listItem = document.createElement('li');
          const value = dataValues[i] as number; // Explicitly cast to number
          listItem.innerHTML = `<span>${labels[i]}:</span> <span>${value}</span>`;
          statusList.appendChild(listItem);
        }
      }
    }

    downloadAsPDF(): void {
      const pdf = new jsPDF();
    
      // Load the image from the provided URL
      const imageUrl = 'assets/download.jpeg';
      const imgWidth = 50; // Adjust the width as needed
      const imgHeight = 30; // Adjust the height as needed
    
      // Calculate center position for the image at the top
      const imgX = (pdf.internal.pageSize.width - imgWidth) / 2;
      const imgY = 5; // Adjust the vertical position as needed
      pdf.addImage(imageUrl, 'JPEG', imgX, imgY, imgWidth, imgHeight);
    
      // Capture the HTML content as an image using html2canvas
      const pdfToPrint = document.getElementById('pdfToPrint') as HTMLElement;
      html2canvas(pdfToPrint).then((canvas) => {
        // Add the captured HTML content as an image
        const imgData = canvas.toDataURL('image/png');
        const imgPdfWidth = pdf.internal.pageSize.width - 20; // Adjust as needed
        const imgPdfHeight = (canvas.height * imgPdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 10, 40, imgPdfWidth, imgPdfHeight);
    
        // Generate PDF filename with current date
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('en-US');
        const pdfFilename = `ACS_repair_report_${formattedDate.replace(/\//g, '-')}.pdf`;
    
        // Save PDF with the generated filename
        pdf.save(pdfFilename);
      });
    }
    
    
    

    back() {
      return this.router.navigate(['/view-reports'])
    }

  }