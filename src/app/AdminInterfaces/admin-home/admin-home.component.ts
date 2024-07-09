import { Component, OnInit } from '@angular/core';
import { StockReportComponent } from '../reports/stock-report/stock-report.component';
import { ReportingService } from 'src/app/services/reporting.service';
import { StockService } from 'src/app/services/stock.service';
import { ErrorLogService } from 'src/app/services/error-log.service';
import { ErrorLog } from 'src/app/models/errorLogs';
import { EmployeeService } from 'src/app/services/employee.service';
import { Employee } from 'src/app/models/employees';
import { AuditTrail } from 'src/app/models/auditTrail';
import { AuditTrailService } from 'src/app/services/audit-trail.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit {

  stockData: any[] = [];
  repairData: any[] = [];
  reorderList: any;
  actions: any;
  errorLogData: ErrorLog[] = [];
  staffData: any[] = [];
  auditTrail: AuditTrail[] = [];

  constructor(private stockReport: StockReportComponent, // must be here even if not being called or graph will not show. don't know why
    private chartDataService: ReportingService,
    private errorLogService: ErrorLogService,
    private employeeService: EmployeeService,
    private ATService: AuditTrailService,
    public stockService: StockService) {
    this.initializeData();
  }

  async ngOnInit() {
    this.initializeData();
    await this.orderStock()
    this.GetErrorLogs();
    this.getEmployees();
    this.GetActivities();
  }

  initializeData() {
    // set chart data from stock and repair report
    this.stockData = this.chartDataService.getStockData();
    this.repairData = this.chartDataService.getStockData();
  }

  //automatic reorder
  async orderStock() {
    this.reorderList = await this.stockService.checkStockReorder();
  }

  //logged errors
  GetErrorLogs() {
    this.errorLogService.getErrorLogs().subscribe((result: ErrorLog[]) => {
      //only show printers with an error status of "logged"
      this.errorLogData = result.filter(x => x.errorLogStatusId == 1)
    })
  }

  getEmployees() {
    this.employeeService.getEmployees().subscribe((result: Employee[]) => {
      this.staffData = result;
    })
  }

  GetActivities() {
    this.ATService.getAuditTrails().subscribe((result: AuditTrail[]) => {
      // stores audit trail data in an array for displaying
      this.auditTrail = result;
    })
  }

  reloadPage() {
    window.location.reload();
  }
}
