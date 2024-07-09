import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MaterialModule } from './resources/Material-manager';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AuthInterceptor } from './auth-services/auth-interceptor.service';
import { RoleGuard } from './auth-services/role.guard';
import { DatePipe } from '@angular/common';

//other components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInComponent } from './LandingPage/sign-in/sign-in.component';
import { ForgotPasswordComponent } from './LandingPage/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './LandingPage/reset-password/reset-password.component';
import { MoreInfoComponent } from './LandingPage/more-info/more-info.component';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { UserAccountComponent } from './user-account/user-account.component';
import { ContactUsComponent } from './LandingPage/more-info/contact-us/contact-us.component';
import { AboutUsComponent } from './LandingPage/more-info/about-us/about-us.component';
import { ChangePasswordComponent } from './user-account/user-account.component';
import { ChatSupportComponent } from './chatbot-assistant/chat-support.component';
import { ChatAssistantRecordsComponent } from './chat-assistant-records/chat-assistant-records.component';
import { ActivityStreamComponent } from './AdminInterfaces/admin-home/manage-system/activity-stream/activity-stream.component';
import { ConfirmEmailComponent } from './LandingPage/confirm-email/confirm-email.component';

//help
import { ViewHelpComponent } from './view-help/view-help.component';
import { CreateHelpComponent } from './view-help/create-help/create-help.component';
import { UpdateHelpComponent } from './view-help/update-help/update-help.component';
import { FAQComponent } from './view-help/faq/faq.component';

//admin components
import { AdminHomeComponent } from './AdminInterfaces/admin-home/admin-home.component';
import { AccountManagementComponent } from './AdminInterfaces/admin-home/user-account-management/account-management.component';
import { ClientUserRequestComponent } from './AdminInterfaces/admin-home/user-account-management/view-client-user/client-user-request/client-user-request.component';
import { CreateClientComponent } from './AdminInterfaces/admin-home/user-account-management/view-client/create-client/create-client.component';
import { UpdateClientComponent } from './AdminInterfaces/admin-home/user-account-management/view-client/update-client/update-client.component';
import { ViewClientComponent } from './AdminInterfaces/admin-home/user-account-management/view-client/view-client.component';
import { CreateEmployeeComponent } from './AdminInterfaces/admin-home/user-account-management/view-employee/create-employee/create-employee.component';
import { UpdateEmployeeComponent } from './AdminInterfaces/admin-home/user-account-management/view-employee/update-employee/update-employee.component';
import { ViewEmployeeComponent } from './AdminInterfaces/admin-home/user-account-management/view-employee/view-employee.component';
import { CreateHubComponent } from './AdminInterfaces/admin-home/user-account-management/view-hub/create-hub/create-hub.component';
import { UpdateHubComponent } from './AdminInterfaces/admin-home/user-account-management/view-hub/update-hub/update-hub.component';
import { ViewHubComponent } from './AdminInterfaces/admin-home/user-account-management/view-hub/view-hub.component';
import { CreateClientUserComponent } from './AdminInterfaces/admin-home/user-account-management/view-client-user/create-client-user/create-client-user.component';
import { UpdateClientUserComponent } from './AdminInterfaces/admin-home/user-account-management/view-client-user/update-client-user/update-client-user.component';
import { ViewClientUserComponent } from './AdminInterfaces/admin-home/user-account-management/view-client-user/view-client-user.component';
import { ManageSystemComponent } from './AdminInterfaces/admin-home/manage-system/manage-system.component';
import { AddressDetailsComponent } from './AdminInterfaces/admin-home/manage-system/address-details-navigation/address-details.component';
import { ViewLabourRateComponent } from './AdminInterfaces/admin-home/manage-system/vat-and-lrate/view-labour-rate/view-labour-rate.component';
import { ViewVatComponent } from './AdminInterfaces/admin-home/manage-system/vat-and-lrate/view-vat/view-vat.component';
import { ViewProvinceComponent } from './AdminInterfaces/admin-home/manage-system/address-details-navigation/view-province/view-province.component';
import { ViewBranchComponent } from './AdminInterfaces/admin-home/manage-system/address-details-navigation/view-branch/view-branch.component';
import { ViewCityComponent } from './AdminInterfaces/admin-home/manage-system/address-details-navigation/view-city/view-city.component';
import { UpdateProvinceComponent } from './AdminInterfaces/admin-home/manage-system/address-details-navigation/view-province/update-province/update-province.component';
import { UpdateBranchComponent } from './AdminInterfaces/admin-home/manage-system/address-details-navigation/view-branch/update-branch/update-branch.component';
import { UpdateCityComponent } from './AdminInterfaces/admin-home/manage-system/address-details-navigation/view-city/update-city/update-city.component';
import { CreateCityComponent } from './AdminInterfaces/admin-home/manage-system/address-details-navigation/view-city/create-city/create-city.component';
import { CreateProvinceComponent } from './AdminInterfaces/admin-home/manage-system/address-details-navigation/view-province/create-province/create-province.component';
import { CreateBranchComponent } from './AdminInterfaces/admin-home/manage-system/address-details-navigation/view-branch/create-branch/create-branch.component';
import { CreateEmployeeTypeComponent } from './AdminInterfaces/admin-home/manage-system/view-employee-type/create-employee-type/create-employee-type.component';
import { UpdateEmployeeTypeComponent } from './AdminInterfaces/admin-home/manage-system/view-employee-type/update-employee-type/update-employee-type.component';
import { StockManagementComponent } from './AdminInterfaces/admin-home//stock-management/stock-management.component';
import { ViewStockComponent } from './AdminInterfaces/admin-home/stock-management/view-stock/view-stock.component';
import { ViewStockTypeComponent } from './AdminInterfaces/admin-home/stock-management/view-stock-type/view-stock-type.component';
import { ViewStockCategoryComponent } from './AdminInterfaces/admin-home/stock-management/view-stock-category/view-stock-category.component';
import { UpdateStockTypeComponent } from './AdminInterfaces/admin-home/stock-management/view-stock-type/update-stock-type/update-stock-type.component';
import { CreateStockTypeComponent } from './AdminInterfaces/admin-home/stock-management/view-stock-type/create-stock-type/create-stock-type.component';
import { ViewEmployeeTypeComponent } from './AdminInterfaces/admin-home/manage-system/view-employee-type/view-employee-type.component';
import { UpdateStockComponent } from './AdminInterfaces/admin-home/stock-management/view-stock/update-stock/update-stock.component';
import { CreateStockComponent } from './AdminInterfaces/admin-home/stock-management/view-stock/create-stock/create-stock.component';
import { PricingComponent } from './AdminInterfaces/admin-home/stock-management/view-stock/pricing/pricing.component';
import { UpdatePriceComponent } from './AdminInterfaces/admin-home/stock-management/view-stock/pricing/update-price/update-price.component';
import { CreatePriceComponent } from './AdminInterfaces/admin-home/stock-management/view-stock/pricing/create-price/create-price.component';
import { CreateStockCategoryComponent } from './AdminInterfaces/admin-home/stock-management/view-stock-category/create-stock-category/create-stock-category.component';
import { UpdateStockCategoryComponent } from './AdminInterfaces/admin-home/stock-management/view-stock-category/update-stock-category/update-stock-category.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminErrorLogsComponent } from './AdminInterfaces/admin-home/view-error-logs/view-error-logs.component';
import { ViewPrinterErrorComponent } from './AdminInterfaces/admin-home/view-error-logs/view-printer-error/view-printer-error.component';
import { RemoteChecklistComponent } from './AdminInterfaces/admin-home/view-error-logs/view-printer-error/remote-checklist/remote-checklist.component';
import { ReportsComponent } from './AdminInterfaces/reports/reports.component';
import { StockReportComponent } from './AdminInterfaces/reports/stock-report/stock-report.component';
import { EmployeeReportComponent } from './AdminInterfaces/reports/employee-report/employee-report.component';
import { RepairReportComponent } from './AdminInterfaces/reports/repair-report/repair-report.component';
import { ClientReportComponent } from './AdminInterfaces/reports/client-report/client-report.component';
import { TechnicalServiceReportingComponent } from './AdminInterfaces/reports/technical-service-report/technical-service-report.component';
import { ViewTechnicalServiceReportComponent } from './AdminInterfaces/reports/technical-service-report/view-technical-service-report/view-technical-service-report.component';
import { PurchasesReportComponent } from './AdminInterfaces/reports/purchase-report/purchase-report.component';
import { AssignedPrinterReportComponent } from './AdminInterfaces/reports/assigned-printer-report/assigned-printer-report.component';
import { SalesReportComponent } from './AdminInterfaces/reports/sales-report/sales-report.component';
import { ViewSupplierComponent } from './AdminInterfaces/admin-home/stock-management/view-supplier/view-supplier.component';
import { UpdateSupplierComponent } from './AdminInterfaces/admin-home/stock-management/view-supplier/update-supplier/update-supplier.component';
import { CreateSupplierComponent } from './AdminInterfaces/admin-home/stock-management/view-supplier/create-supplier/create-supplier.component';
import { StockOrderComponent } from './AdminInterfaces/admin-home/stock-management/stock-order/stock-order.component';
import { CreateManualStockOrderComponent } from './AdminInterfaces/admin-home/stock-management/stock-order/create-manual-stock-order/create-manual-stock-order.component';
import { PlaceStockOrderComponent } from './AdminInterfaces/admin-home/stock-management/stock-order/place-stock-order/place-stock-order.component';
import { CreateHubUserComponent } from './AdminInterfaces/admin-home/user-account-management/view-hub-user/create-hub-user/create-hub-user.component';
import { UpdateHubUserComponent } from './AdminInterfaces/admin-home/user-account-management/view-hub-user/update-hub-user/update-hub-user.component';
import { ViewHubUserComponent } from './AdminInterfaces/admin-home/user-account-management/view-hub-user/view-hub-user.component';
import { ViewPrinterComponent } from './AdminInterfaces/admin-home/manage-system/view-printer/view-printer.component';
import { AssignPrinterComponent } from './AdminInterfaces/admin-home/manage-system/view-printer/assign-printer/assign-printer.component';
import { UpdateAssignedPrinterComponent } from './AdminInterfaces/admin-home/manage-system/view-printer/update-assigned-printer/update-assigned-printer.component';
import { ViewMarkupComponent } from './AdminInterfaces/admin-home/manage-system/vat-and-lrate/view-markup/view-markup.component';
import { ViewVatHistoryComponent } from './AdminInterfaces/admin-home/manage-system/vat-and-lrate/view-vat/vat-history/view-vat-history.component';
import { VatAndLrateComponent } from './AdminInterfaces/admin-home/manage-system/vat-and-lrate/vat-and-lrate.component';
import { ViewErrorCodesComponent } from './AdminInterfaces/admin-home/manage-system/view-error-codes/view-error-codes.component';
import { CreateErrorCodesComponent } from './AdminInterfaces/admin-home/manage-system/view-error-codes/create-error-codes/create-error-codes.component';
import { UpdateErrorCodesComponent } from './AdminInterfaces/admin-home/manage-system/view-error-codes/update-error-codes/update-error-codes.component';
import { AssignTechnicianComponent } from './AdminInterfaces/admin-home/view-error-logs/view-printer-error/remote-checklist/assign-technician/assign-technician.component';
import { ClientOrdersComponent } from './AdminInterfaces/admin-home/stock-management/client-orders/client-orders.component';
import { SupplierOrdersComponent } from './AdminInterfaces/admin-home/stock-management/supplier-orders/supplier-orders.component';
import { StockTakeComponent } from './AdminInterfaces/admin-home/stock-management/view-stock/stock-take/stock-take.component';
import { UploadHelpFileComponent } from './view-help/upload-help-file/upload-help-file.component';


//client components
import { ClientHomeComponent } from './ClientInterfaces/client-home/client-home.component';
import { FinancialAccountsComponent } from './ClientInterfaces/client-financials/financial-accounts/financial-accounts.component';
import { ConsumableShopComponent, FilterComponent, SortComponent } from './ClientInterfaces/client-home/point-of-sales/acs-store/consumable-shop.component';
import { ClientFinancialsComponent } from './ClientInterfaces/client-financials/client-financials.component';
import { UserRegistrationComponent } from './ClientInterfaces/client-home/user-registration/user-registration.component';
import { ClientPrintersComponent } from './ClientInterfaces/client-printers/client-printers.component';
import { LogErrorComponent } from './ClientInterfaces/client-home/log-error/log-error.component';
import { CartComponent } from './ClientInterfaces/client-home/point-of-sales/cart/cart.component';
import { CancelComponent } from './ClientInterfaces/client-home/point-of-sales/cancel/cancel.component';
import { CartLoadingScreenComponent } from './ClientInterfaces/client-home/point-of-sales/cart-loading-screen/cart-loading-screen.component';
import { PayfastcheckoutComponent } from './ClientInterfaces/client-home/point-of-sales/payfastcheckout/payfastcheckout.component';
import { SquarecheckoutComponent } from './ClientInterfaces/client-home/point-of-sales/squarecheckout/squarecheckout.component';
import { SuccessComponent } from './ClientInterfaces/client-home/point-of-sales/success/success.component';
import { PrinterInfoDialogComponent } from './ClientInterfaces/client-home/printer-info-dialog/printer-info-dialog.component';
import { ClientPurchaseOrderComponent } from './ClientInterfaces/client-financials/client-purchase-order/client-purchase-order.component';
import { ViewClientPurchaseOrderComponent } from './ClientInterfaces/client-financials/client-purchase-order/view-client-purchase-order/view-client-purchase-order.component';
import { MakePaymentsComponent } from './ClientInterfaces/client-financials/financial-accounts/make-payments/make-payments.component';
import { PaymentHistoryComponent } from './ClientInterfaces/client-financials/financial-accounts/payment-history/payment-history.component';
import { CheckoutComponent } from './ClientInterfaces/client-home/point-of-sales/cart/checkout/checkout.component';
import { ViewPaymentHistoryComponent } from './ClientInterfaces/client-financials/financial-accounts/payment-history/view-payment-history/view-payment-history.component';
// import { AssignedPrinterReportComponent } from './AdminInterfaces/reports/assigned-printer-report/assigned-printer-report.component';
import { ViewErrorlogStatusesComponent } from './clientInterfaces/client-printers/view-errorlog-statuses/view-errorlog-statuses.component';
import { AssignBranchPrinterComponent } from './clientInterfaces/client-printers/assign-branch-printer/assign-branch-printer.component';

//technician components
import { BookedInPrintersComponent } from './TechnicianInterfaces/booked-in-printers/booked-in-printers.component';
import { DiagnosticsChecklistComponent } from './TechnicianInterfaces/booked-in-printers/view-error-logs/diagnostics-checklist/diagnostics-checklist.component';
import { PartsRequestComponent } from './TechnicianInterfaces/booked-in-printers/view-error-logs/diagnostics-checklist/parts-request/parts-request.component';
import { PurchaseOrdersComponent } from './TechnicianInterfaces/purchase-orders/purchase-orders.component';
import { TechnicalServiceReportComponent } from './TechnicianInterfaces/technical-service-report/technical-service-report.component';
import { TechnicianDashboardComponent } from './TechnicianInterfaces/technician-dashboard/technician-dashboard.component';
import { TechnicianErrorLogsComponent } from './TechnicianInterfaces/booked-in-printers/view-error-logs/view-error-logs.component';
import { InFieldErrorLogsComponent } from './TechnicianInterfaces/in-field-error-logs/in-field-error-logs.component';
import { ExchangePrinterComponent } from './TechnicianInterfaces/in-field-checklist/exchange-printer/exchange-printer.component';

//Inventory Clerk components
import { InventoryClerkDashboardComponent } from './InventoryClerkInterfaces/inventory-clerk-dashboard/inventory-clerk-dashboard.component';
import { BookInPrinterComponent } from './InventoryClerkInterfaces/book-in-printer/book-in-printer.component';
import { BookOutPrinterComponent } from './InventoryClerkInterfaces/book-out-printer/book-out-printer.component';
import { BookInStockComponent } from './InventoryClerkInterfaces/book-in-stock/book-in-stock.component';
import { BookOutStockComponent } from './InventoryClerkInterfaces/book-out-stock/book-out-stock.component';
import { ViewPartsRequestsComponent } from './InventoryClerkInterfaces/view-parts-requests/view-parts-requests.component';
import { ViewPartsRequestComponent } from './InventoryClerkInterfaces/view-parts-requests/view-parts-request/view-parts-request.component';
import { InFieldChecklistComponent } from './TechnicianInterfaces/in-field-checklist/in-field-checklist.component';
import { ViewPaymentTypeComponent } from './AdminInterfaces/admin-home/manage-system/view-payment-type/view-payment-type.component';
import { CreatePaymentTypeComponent } from './AdminInterfaces/admin-home/manage-system/view-payment-type/create-payment-type/create-payment-type.component';
import { UpdatePaymentTypeComponent } from './AdminInterfaces/admin-home/manage-system/view-payment-type/update-payment-type/update-payment-type.component';
import { ViewInvoiceComponent } from './ClientInterfaces/client-financials/financial-accounts/make-payments/view-invoice/view-invoice.component';
import { ViewSupplierOrderComponent } from './InventoryClerkInterfaces/view-supplier-order/view-supplier-order.component';
import { ViewClientOrderComponent } from './InventoryClerkInterfaces/view-client-order/view-client-order.component';
import { AssignPrinterStockComponent } from './InventoryClerkInterfaces/view-client-order/assign-printer-stock/assign-printer-stock.component';
import { TechnicianBookoutPrinterComponent } from './TechnicianInterfaces/technician-bookout-printer/technician-bookout-printer.component';
import { TechnicianPrinterSelectionComponent } from './TechnicianInterfaces/technician-printer-selection/technician-printer-selection.component';


@NgModule({
  declarations: [
    AppComponent,

    ActivityStreamComponent,

    // page tools
    LoadingScreenComponent,
    NavigationBarComponent,
    ResetPasswordComponent,
    ChangePasswordComponent,
    ChatSupportComponent,
    ChatAssistantRecordsComponent,
    ConfirmEmailComponent,

    //help
    ViewHelpComponent,
    CreateHelpComponent,
    UpdateHelpComponent,

    FAQComponent,
    UploadHelpFileComponent,

    //navigation pages
    SignInComponent,
    ForgotPasswordComponent,
    MoreInfoComponent,
    AdminHomeComponent,
    ClientHomeComponent,
    AccountManagementComponent,
    ManageSystemComponent,
    AddressDetailsComponent,
    StockManagementComponent,
    UserAccountComponent,
    ContactUsComponent,
    AboutUsComponent,

    //employee
    ViewEmployeeComponent,
    CreateEmployeeComponent,
    UpdateEmployeeComponent,

    //client
    ViewClientComponent,
    CreateClientComponent,
    UpdateClientComponent,
    ClientUserRequestComponent,

    //Hub
    ViewHubComponent,
    CreateHubComponent,
    UpdateHubComponent,

    //Hub User
    ViewHubUserComponent,
    CreateHubUserComponent,
    UpdateHubUserComponent,

    //rates
    VatAndLrateComponent,
    ViewVatComponent,
    ViewVatHistoryComponent,
    ViewLabourRateComponent,
    ViewMarkupComponent,

    //province
    ViewProvinceComponent,
    UpdateProvinceComponent,
    CreateProvinceComponent,

    //City
    ViewCityComponent,
    UpdateCityComponent,
    CreateCityComponent,

    //branch
    ViewBranchComponent,
    UpdateBranchComponent,
    CreateBranchComponent,

    //employeeType
    ViewEmployeeTypeComponent,
    CreateEmployeeTypeComponent,
    UpdateEmployeeTypeComponent,

    //supplier
    ViewSupplierComponent,
    UpdateSupplierComponent,
    CreateSupplierComponent,

    //stock take
    StockTakeComponent,

    //stock
    ViewStockComponent,
    UpdateStockComponent,
    CreateStockComponent,

    //stock type
    ViewStockTypeComponent,
    UpdateStockTypeComponent,
    CreateStockTypeComponent,

    //stock category
    ViewStockCategoryComponent,
    CreateStockCategoryComponent,
    UpdateStockCategoryComponent,

    //stock order
    StockOrderComponent,
    CreateManualStockOrderComponent,
    PlaceStockOrderComponent,

    //client user
    ViewClientUserComponent,
    UpdateClientUserComponent,
    CreateClientUserComponent,

    //admin error logs
    AdminErrorLogsComponent,
    ViewPrinterErrorComponent,
    RemoteChecklistComponent,
    AssignTechnicianComponent,

    //error codes
    ViewErrorCodesComponent,
    CreateErrorCodesComponent,
    UpdateErrorCodesComponent,

    //reporting
    ReportsComponent,
    StockReportComponent,
    EmployeeReportComponent,
    RepairReportComponent,
    ClientReportComponent,
    SalesReportComponent,
    PurchasesReportComponent,
    AssignedPrinterReportComponent,
    TechnicalServiceReportingComponent,
    ViewTechnicalServiceReportComponent,

    //printer
    ViewPrinterComponent,
    AssignPrinterComponent,
    UpdateAssignedPrinterComponent,

    //pricing
    PricingComponent,
    UpdatePriceComponent,
    CreatePriceComponent,

    //payment type
    ViewPaymentTypeComponent,
    CreatePaymentTypeComponent,
    UpdatePaymentTypeComponent,

    ClientOrdersComponent,
    SupplierOrdersComponent,

    //##################
    //client interfaces

    FinancialAccountsComponent,
    ClientPrintersComponent,
    UserRegistrationComponent,

    //store
    ConsumableShopComponent,
    CartLoadingScreenComponent,
    CartComponent,
    SuccessComponent,
    CancelComponent,
    PayfastcheckoutComponent,
    SquarecheckoutComponent,
    FilterComponent,
    SortComponent,
    CheckoutComponent,

    LogErrorComponent,
    PrinterInfoDialogComponent,

    ClientFinancialsComponent,
    ClientPurchaseOrderComponent,
    ViewClientPurchaseOrderComponent,
    MakePaymentsComponent,
    PaymentHistoryComponent,
    ViewPaymentHistoryComponent,

    //##################
    //technician interfaces
    TechnicianDashboardComponent,
    BookedInPrintersComponent,
    TechnicianErrorLogsComponent,
    DiagnosticsChecklistComponent,
    PartsRequestComponent,
    PurchaseOrdersComponent,
    ClientPurchaseOrderComponent,
    InFieldChecklistComponent,
    InFieldErrorLogsComponent,
    ExchangePrinterComponent,
    TechnicalServiceReportComponent,
    
    //###################
    //Inventory clerk interfaces
    InventoryClerkDashboardComponent,
    BookInPrinterComponent,
    BookOutPrinterComponent,
    BookInStockComponent,
    BookOutStockComponent,
    ViewPartsRequestsComponent,
    ViewPartsRequestComponent,
    ViewInvoiceComponent,
    ViewSupplierOrderComponent,
    ViewClientOrderComponent,
    AssignPrinterStockComponent,
    ViewErrorlogStatusesComponent,
    AssignBranchPrinterComponent,
    TechnicianBookoutPrinterComponent,
    TechnicianPrinterSelectionComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule // from -> ./resources/material-manager.ts
  ],
  providers: [
    DatePipe,
    RoleGuard,
    SignInComponent,
    PayfastcheckoutComponent,
    CheckoutComponent,
    StockOrderComponent,
    StockReportComponent,
    NavigationBarComponent,
    MakePaymentsComponent,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
