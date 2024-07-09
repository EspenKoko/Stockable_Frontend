import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from './auth-services/role.guard';

import { AdminHomeComponent } from './AdminInterfaces/admin-home/admin-home.component';
import { AddressDetailsComponent } from './AdminInterfaces/admin-home/manage-system/address-details-navigation/address-details.component';
import { ManageSystemComponent } from './AdminInterfaces/admin-home/manage-system/manage-system.component';
import { AccountManagementComponent } from './AdminInterfaces/admin-home/user-account-management/account-management.component';
import { SignInComponent } from './LandingPage/sign-in/sign-in.component';

import { ViewVatComponent } from './AdminInterfaces/admin-home/manage-system/vat-and-lrate/view-vat/view-vat.component';
import { CreateBranchComponent } from './AdminInterfaces/admin-home/manage-system/address-details-navigation/view-branch/create-branch/create-branch.component';
import { UpdateBranchComponent } from './AdminInterfaces/admin-home/manage-system/address-details-navigation/view-branch/update-branch/update-branch.component';
import { ViewBranchComponent } from './AdminInterfaces/admin-home/manage-system/address-details-navigation/view-branch/view-branch.component';
import { CreateCityComponent } from './AdminInterfaces/admin-home/manage-system/address-details-navigation/view-city/create-city/create-city.component';
import { UpdateCityComponent } from './AdminInterfaces/admin-home/manage-system/address-details-navigation/view-city/update-city/update-city.component';
import { ViewCityComponent } from './AdminInterfaces/admin-home/manage-system/address-details-navigation/view-city/view-city.component';
import { CreateProvinceComponent } from './AdminInterfaces/admin-home/manage-system/address-details-navigation/view-province/create-province/create-province.component';
import { UpdateProvinceComponent } from './AdminInterfaces/admin-home/manage-system/address-details-navigation/view-province/update-province/update-province.component';
import { ViewProvinceComponent } from './AdminInterfaces/admin-home/manage-system/address-details-navigation/view-province/view-province.component';
import { CreateEmployeeTypeComponent } from './AdminInterfaces/admin-home/manage-system/view-employee-type/create-employee-type/create-employee-type.component';
import { UpdateEmployeeTypeComponent } from './AdminInterfaces/admin-home/manage-system/view-employee-type/update-employee-type/update-employee-type.component';
import { ViewEmployeeTypeComponent } from './AdminInterfaces/admin-home/manage-system/view-employee-type/view-employee-type.component';
import { ContactUsComponent } from './LandingPage/more-info/contact-us/contact-us.component';
import { AboutUsComponent } from './LandingPage/more-info/about-us/about-us.component';
import { VatAndLrateComponent } from './AdminInterfaces/admin-home/manage-system/vat-and-lrate/vat-and-lrate.component';
import { ViewLabourRateComponent } from './AdminInterfaces/admin-home/manage-system/vat-and-lrate/view-labour-rate/view-labour-rate.component';
import { AssignPrinterComponent } from './AdminInterfaces/admin-home/manage-system/view-printer/assign-printer/assign-printer.component';
import { UpdateAssignedPrinterComponent } from './AdminInterfaces/admin-home/manage-system/view-printer/update-assigned-printer/update-assigned-printer.component';
import { ViewPrinterComponent } from './AdminInterfaces/admin-home/manage-system/view-printer/view-printer.component';
import { StockManagementComponent } from './AdminInterfaces/admin-home/stock-management/stock-management.component';
import { CreateManualStockOrderComponent } from './AdminInterfaces/admin-home/stock-management/stock-order/create-manual-stock-order/create-manual-stock-order.component';
import { PlaceStockOrderComponent } from './AdminInterfaces/admin-home/stock-management/stock-order/place-stock-order/place-stock-order.component';
import { StockOrderComponent } from './AdminInterfaces/admin-home/stock-management/stock-order/stock-order.component';
import { CreateStockCategoryComponent } from './AdminInterfaces/admin-home/stock-management/view-stock-category/create-stock-category/create-stock-category.component';
import { UpdateStockCategoryComponent } from './AdminInterfaces/admin-home/stock-management/view-stock-category/update-stock-category/update-stock-category.component';
import { ViewStockCategoryComponent } from './AdminInterfaces/admin-home/stock-management/view-stock-category/view-stock-category.component';
import { CreateStockTypeComponent } from './AdminInterfaces/admin-home/stock-management/view-stock-type/create-stock-type/create-stock-type.component';
import { UpdateStockTypeComponent } from './AdminInterfaces/admin-home/stock-management/view-stock-type/update-stock-type/update-stock-type.component';
import { ViewStockTypeComponent } from './AdminInterfaces/admin-home/stock-management/view-stock-type/view-stock-type.component';
import { CreateStockComponent } from './AdminInterfaces/admin-home/stock-management/view-stock/create-stock/create-stock.component';
import { CreatePriceComponent } from './AdminInterfaces/admin-home/stock-management/view-stock/pricing/create-price/create-price.component';
import { PricingComponent } from './AdminInterfaces/admin-home/stock-management/view-stock/pricing/pricing.component';
import { UpdatePriceComponent } from './AdminInterfaces/admin-home/stock-management/view-stock/pricing/update-price/update-price.component';
import { UpdateStockComponent } from './AdminInterfaces/admin-home/stock-management/view-stock/update-stock/update-stock.component';
import { ViewStockComponent } from './AdminInterfaces/admin-home/stock-management/view-stock/view-stock.component';
import { CreateSupplierComponent } from './AdminInterfaces/admin-home/stock-management/view-supplier/create-supplier/create-supplier.component';
import { UpdateSupplierComponent } from './AdminInterfaces/admin-home/stock-management/view-supplier/update-supplier/update-supplier.component';
import { ViewSupplierComponent } from './AdminInterfaces/admin-home/stock-management/view-supplier/view-supplier.component';
import { ClientUserRequestComponent } from './AdminInterfaces/admin-home/user-account-management/view-client-user/client-user-request/client-user-request.component';
import { CreateClientUserComponent } from './AdminInterfaces/admin-home/user-account-management/view-client-user/create-client-user/create-client-user.component';
import { UpdateClientUserComponent } from './AdminInterfaces/admin-home/user-account-management/view-client-user/update-client-user/update-client-user.component';
import { ViewClientUserComponent } from './AdminInterfaces/admin-home/user-account-management/view-client-user/view-client-user.component';
import { CreateClientComponent } from './AdminInterfaces/admin-home/user-account-management/view-client/create-client/create-client.component';
import { UpdateClientComponent } from './AdminInterfaces/admin-home/user-account-management/view-client/update-client/update-client.component';
import { ViewClientComponent } from './AdminInterfaces/admin-home/user-account-management/view-client/view-client.component';
import { CreateEmployeeComponent } from './AdminInterfaces/admin-home/user-account-management/view-employee/create-employee/create-employee.component';
import { UpdateEmployeeComponent } from './AdminInterfaces/admin-home/user-account-management/view-employee/update-employee/update-employee.component';
import { ViewEmployeeComponent } from './AdminInterfaces/admin-home/user-account-management/view-employee/view-employee.component';
import { CreateHubUserComponent } from './AdminInterfaces/admin-home/user-account-management/view-hub-user/create-hub-user/create-hub-user.component';
import { UpdateHubUserComponent } from './AdminInterfaces/admin-home/user-account-management/view-hub-user/update-hub-user/update-hub-user.component';
import { ViewHubUserComponent } from './AdminInterfaces/admin-home/user-account-management/view-hub-user/view-hub-user.component';
import { CreateHubComponent } from './AdminInterfaces/admin-home/user-account-management/view-hub/create-hub/create-hub.component';
import { UpdateHubComponent } from './AdminInterfaces/admin-home/user-account-management/view-hub/update-hub/update-hub.component';
import { ViewHubComponent } from './AdminInterfaces/admin-home/user-account-management/view-hub/view-hub.component';
import { AdminErrorLogsComponent } from './AdminInterfaces/admin-home/view-error-logs/view-error-logs.component';
import { RemoteChecklistComponent } from './AdminInterfaces/admin-home/view-error-logs/view-printer-error/remote-checklist/remote-checklist.component';
import { ViewPrinterErrorComponent } from './AdminInterfaces/admin-home/view-error-logs/view-printer-error/view-printer-error.component';
import { ReportsComponent } from './AdminInterfaces/reports/reports.component';
import { StockReportComponent } from './AdminInterfaces/reports/stock-report/stock-report.component';
import { RepairReportComponent } from './AdminInterfaces/reports/repair-report/repair-report.component';
import { EmployeeReportComponent } from './AdminInterfaces/reports/employee-report/employee-report.component';
import { ClientReportComponent } from './AdminInterfaces/reports/client-report/client-report.component';
import { SalesReportComponent } from './AdminInterfaces/reports/sales-report/sales-report.component';
import { PurchasesReportComponent } from './AdminInterfaces/reports/purchase-report/purchase-report.component';
import { AssignedPrinterReportComponent } from './AdminInterfaces/reports/assigned-printer-report/assigned-printer-report.component';
import { MakePaymentsComponent } from './ClientInterfaces/client-financials/financial-accounts/make-payments/make-payments.component';
import { PaymentHistoryComponent } from './ClientInterfaces/client-financials/financial-accounts/payment-history/payment-history.component';
import { ForbiddenComponent, PageNotFoundComponent } from './LandingPage/error-pages/error-pages.component';
import { ForgotPasswordComponent } from './LandingPage/forgot-password/forgot-password.component';
import { MoreInfoComponent } from './LandingPage/more-info/more-info.component';
import { TechnicianDashboardComponent } from './TechnicianInterfaces/technician-dashboard/technician-dashboard.component';
import { ClientFinancialsComponent } from './ClientInterfaces/client-financials/client-financials.component';
import { FinancialAccountsComponent } from './ClientInterfaces/client-financials/financial-accounts/financial-accounts.component';
import { ClientHomeComponent } from './ClientInterfaces/client-home/client-home.component';
import { LogErrorComponent } from './ClientInterfaces/client-home/log-error/log-error.component';
import { ConsumableShopComponent, FilterComponent, SortComponent } from './ClientInterfaces/client-home/point-of-sales/acs-store/consumable-shop.component';
import { CartComponent } from './ClientInterfaces/client-home/point-of-sales/cart/cart.component';
import { UserRegistrationComponent } from './ClientInterfaces/client-home/user-registration/user-registration.component';
import { ClientPrintersComponent } from './ClientInterfaces/client-printers/client-printers.component';
import { UserAccountComponent, ChangePasswordComponent } from './user-account/user-account.component';
import { ViewHelpComponent } from './view-help/view-help.component';
import { InventoryClerkDashboardComponent } from './InventoryClerkInterfaces/inventory-clerk-dashboard/inventory-clerk-dashboard.component';
import { BookedInPrintersComponent } from './TechnicianInterfaces/booked-in-printers/booked-in-printers.component';
import { PurchaseOrdersComponent } from './TechnicianInterfaces/purchase-orders/purchase-orders.component';
import { DiagnosticsChecklistComponent } from './TechnicianInterfaces/booked-in-printers/view-error-logs/diagnostics-checklist/diagnostics-checklist.component';
import { PartsRequestComponent } from './TechnicianInterfaces/booked-in-printers/view-error-logs/diagnostics-checklist/parts-request/parts-request.component';
import { TechnicianErrorLogsComponent } from './TechnicianInterfaces/booked-in-printers/view-error-logs/view-error-logs.component';
import { CreateErrorCodesComponent } from './AdminInterfaces/admin-home/manage-system/view-error-codes/create-error-codes/create-error-codes.component';
import { UpdateErrorCodesComponent } from './AdminInterfaces/admin-home/manage-system/view-error-codes/update-error-codes/update-error-codes.component';
import { ViewErrorCodesComponent } from './AdminInterfaces/admin-home/manage-system/view-error-codes/view-error-codes.component';
import { FAQComponent } from './view-help/faq/faq.component';
import { AssignTechnicianComponent } from './AdminInterfaces/admin-home/view-error-logs/view-printer-error/remote-checklist/assign-technician/assign-technician.component';
import { BookInPrinterComponent } from './InventoryClerkInterfaces/book-in-printer/book-in-printer.component';
import { BookOutPrinterComponent } from './InventoryClerkInterfaces/book-out-printer/book-out-printer.component';
import { BookInStockComponent } from './InventoryClerkInterfaces/book-in-stock/book-in-stock.component';
import { BookOutStockComponent } from './InventoryClerkInterfaces/book-out-stock/book-out-stock.component';
import { ViewPartsRequestsComponent } from './InventoryClerkInterfaces/view-parts-requests/view-parts-requests.component';
import { ViewPartsRequestComponent } from './InventoryClerkInterfaces/view-parts-requests/view-parts-request/view-parts-request.component';
import { ClientPurchaseOrderComponent } from './ClientInterfaces/client-financials/client-purchase-order/client-purchase-order.component';
import { ViewClientPurchaseOrderComponent } from './ClientInterfaces/client-financials/client-purchase-order/view-client-purchase-order/view-client-purchase-order.component';
import { InFieldChecklistComponent } from './TechnicianInterfaces/in-field-checklist/in-field-checklist.component';
import { InFieldErrorLogsComponent } from './TechnicianInterfaces/in-field-error-logs/in-field-error-logs.component';
import { SuccessComponent } from './ClientInterfaces/client-home/point-of-sales/success/success.component';
import { CancelComponent } from './ClientInterfaces/client-home/point-of-sales/cancel/cancel.component';
import { CheckoutComponent } from './ClientInterfaces/client-home/point-of-sales/cart/checkout/checkout.component';
import { CreateHelpComponent } from './view-help/create-help/create-help.component';
import { UpdateHelpComponent } from './view-help/update-help/update-help.component';
import { TechnicalServiceReportComponent } from './TechnicianInterfaces/technical-service-report/technical-service-report.component';
import { ViewPaymentTypeComponent } from './AdminInterfaces/admin-home/manage-system/view-payment-type/view-payment-type.component';
import { CreatePaymentTypeComponent } from './AdminInterfaces/admin-home/manage-system/view-payment-type/create-payment-type/create-payment-type.component';
import { UpdatePaymentTypeComponent } from './AdminInterfaces/admin-home/manage-system/view-payment-type/update-payment-type/update-payment-type.component';
import { ViewMarkupComponent } from './AdminInterfaces/admin-home/manage-system/vat-and-lrate/view-markup/view-markup.component';
import { ViewInvoiceComponent } from './ClientInterfaces/client-financials/financial-accounts/make-payments/view-invoice/view-invoice.component';
import { ExchangePrinterComponent } from './TechnicianInterfaces/in-field-checklist/exchange-printer/exchange-printer.component';
import { ViewPaymentHistoryComponent } from './ClientInterfaces/client-financials/financial-accounts/payment-history/view-payment-history/view-payment-history.component';
import { SupplierOrdersComponent } from './AdminInterfaces/admin-home/stock-management/supplier-orders/supplier-orders.component';
import { ClientOrdersComponent } from './AdminInterfaces/admin-home/stock-management/client-orders/client-orders.component';
import { StockTakeComponent } from './AdminInterfaces/admin-home/stock-management/view-stock/stock-take/stock-take.component';
import { ViewSupplierOrderComponent } from './InventoryClerkInterfaces/view-supplier-order/view-supplier-order.component';
import { ViewClientOrderComponent } from './InventoryClerkInterfaces/view-client-order/view-client-order.component';
import { AssignPrinterStockComponent } from './InventoryClerkInterfaces/view-client-order/assign-printer-stock/assign-printer-stock.component';
import { ChatAssistantRecordsComponent } from './chat-assistant-records/chat-assistant-records.component';
import { TechnicalServiceReportingComponent } from './AdminInterfaces/reports/technical-service-report/technical-service-report.component';
import { ViewTechnicalServiceReportComponent } from './AdminInterfaces/reports/technical-service-report/view-technical-service-report/view-technical-service-report.component';
import { ViewVatHistoryComponent } from './AdminInterfaces/admin-home/manage-system/vat-and-lrate/view-vat/vat-history/view-vat-history.component';
import { UploadHelpFileComponent } from './view-help/upload-help-file/upload-help-file.component';
import { ResetPasswordComponent } from './LandingPage/reset-password/reset-password.component';
import { ActivityStreamComponent } from './AdminInterfaces/admin-home/manage-system/activity-stream/activity-stream.component';
import { ViewErrorlogStatusesComponent } from './clientInterfaces/client-printers/view-errorlog-statuses/view-errorlog-statuses.component';
import { AssignBranchPrinterComponent } from './clientInterfaces/client-printers/assign-branch-printer/assign-branch-printer.component';
import { TechnicianBookoutPrinterComponent } from './TechnicianInterfaces/technician-bookout-printer/technician-bookout-printer.component';
import { TechnicianPrinterSelectionComponent } from './TechnicianInterfaces/technician-printer-selection/technician-printer-selection.component';
import { ConfirmEmailComponent } from './LandingPage/confirm-email/confirm-email.component';

const routes: Routes = [
  { path: "", redirectTo: '/sign-in', pathMatch: 'full' },

  //landing page
  { path: "sign-in", component: SignInComponent },
  {
    path: "forgot-password", component: SignInComponent,
    children: [{ path: "", component: ForgotPasswordComponent },]
  },
  {
    path: "more-info", component: SignInComponent,
    children: [{ path: "", component: MoreInfoComponent },]
  },
  { path: "account", component: UserAccountComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN', 'TECHNICIAN', 'INVENTORY_CLERK', 'CLIENT_USER', 'CLIENT_ADMIN'] } },
  { path: "change-password", component: ChangePasswordComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN', 'TECHNICIAN', 'INVENTORY_CLERK', 'CLIENT_USER', 'CLIENT_ADMIN'] } },
  { path: "unauthorized", component: ForbiddenComponent },

  //!######################################
  //! can only be naviageted to via emailed link

  // using rout params
  // { path: "reset-password/:id/:token", component: ResetPasswordComponent },

  // using query params
  { path: "reset-password", component: ResetPasswordComponent },

    // using rout params
  // { path: "confirm-email/:id/:token", component: ResetPasswordComponent },

  // using query params
  { path: "confirm-email", component: ConfirmEmailComponent },

  //! can only be naviageted to via emailed link
  //!######################################

  //help
  { path: "view-help", component: ViewHelpComponent },
  { path: "create-help", component: CreateHelpComponent },
  { path: "update-help/:id", component: UpdateHelpComponent },

  { path: "FAQs", component: FAQComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN', 'TECHNICIAN', 'INVENTORY_CLERK', 'CLIENT_USER', 'CLIENT_ADMIN'] } },
  { path: "upload-help", component: UploadHelpFileComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },

  //#################
  //admin interfaces

  { path: "admin-dashboard", component: AdminHomeComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "user-account-management", component: AccountManagementComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "manage-systems", component: ManageSystemComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "address-details", component: AddressDetailsComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "stock-management", component: StockManagementComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "chat-support-records", component: ChatAssistantRecordsComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "audit-trail", component: ActivityStreamComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },

  //employee
  { path: "view-employee", component: ViewEmployeeComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "create-employee", component: CreateEmployeeComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "update-employee/:id", component: UpdateEmployeeComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "update-employee", component: UpdateEmployeeComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },

  //client
  { path: "view-client", component: ViewClientComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "create-client", component: CreateClientComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "update-client/:id", component: UpdateClientComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "update-client", component: UpdateClientComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },

  //hub
  { path: "view-hub", component: ViewHubComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "create-hub", component: CreateHubComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "update-hub/:id", component: UpdateHubComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "update-hub", component: UpdateHubComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },

  //client user
  { path: "view-client-user", component: ViewClientUserComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "create-client-user", component: CreateClientUserComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "update-client-user", component: UpdateClientUserComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "update-client-user/:id", component: UpdateClientUserComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "client-user-requests", component: ClientUserRequestComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },

  // //hub user
  // { path: "view-hub-user", component: ViewHubUserComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  // { path: "create-hub-user", component: CreateHubUserComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  // { path: "update-hub-user", component: UpdateHubUserComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  // { path: "update-hub-user/:id", component: UpdateHubUserComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },

  //rates
  { path: "view-vat-lrate", component: VatAndLrateComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  {
    path: "view-vat", component: VatAndLrateComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] },
    children: [
      { path: "", component: ViewVatComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
      { path: "vat-history", component: ViewVatHistoryComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
    ]
  },
  {
    path: "view-labour-rate", component: VatAndLrateComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] },
    children: [
      { path: "", component: ViewLabourRateComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
      // { path: "vat-labour-rate", component: ViewLabourRateHistoryComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
    ]
  },
  {
    path: "view-markup", component: VatAndLrateComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] },
    children: [
      { path: "", component: ViewMarkupComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
      // { path: "vat-markup", component: ViewMarkupHistoryComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
    ]
  },

  //province
  { path: "view-province", component: ViewProvinceComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "create-province", component: CreateProvinceComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "update-province/:id", component: UpdateProvinceComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "update-province", component: UpdateProvinceComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },

  //branch
  { path: "view-branch", component: ViewBranchComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "update-branch/:id", component: UpdateBranchComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "update-branch", component: UpdateBranchComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "create-branch", component: CreateBranchComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },

  //city
  { path: "view-city", component: ViewCityComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "update-city/:id", component: UpdateCityComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "create-city", component: CreateCityComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "update-city", component: UpdateCityComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },

  //employee type
  { path: "view-employee-type", component: ViewEmployeeTypeComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "create-employee-type", component: CreateEmployeeTypeComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "update-employee-type/:id", component: UpdateEmployeeTypeComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "update-employee-type", component: UpdateEmployeeTypeComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },

  //supplier
  { path: "view-supplier", component: ViewSupplierComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "create-supplier", component: CreateSupplierComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "update-supplier/:id", component: UpdateSupplierComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "update-supplier", component: UpdateSupplierComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },

  { path: "supplier-orders", component: SupplierOrdersComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "client-orders", component: ClientOrdersComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },

  //stock take
  { path: "stock-take", component: StockTakeComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },

  //stock
  { path: "view-stock", component: ViewStockComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "create-stock", component: CreateStockComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "update-stock", component: UpdateStockComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "update-stock/:id", component: UpdateStockComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },

  //stock type
  { path: "view-stock-type", component: ViewStockTypeComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "create-stock-type", component: CreateStockTypeComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "update-stock-type/:id", component: UpdateStockTypeComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "update-stock-type", component: UpdateStockTypeComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },

  //stock category
  { path: "view-stock-category", component: ViewStockCategoryComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "create-stock-category", component: CreateStockCategoryComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "update-stock-category", component: UpdateStockCategoryComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "update-stock-category/:id", component: UpdateStockCategoryComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },

  //stock order
  { path: "stock-order", component: StockOrderComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "create-mso", component: CreateManualStockOrderComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "create-mso/:id", component: CreateManualStockOrderComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "place-stock-order", component: PlaceStockOrderComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },

  //pricing
  { path: "pricing", component: PricingComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "create-price", component: CreatePriceComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "update-price", component: UpdatePriceComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "update-price/:id", component: UpdatePriceComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },

  //payment type
  { path: "view-payment-type", component: ViewPaymentTypeComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "create-payment-type", component: CreatePaymentTypeComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "update-payment-type", component: UpdatePaymentTypeComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "update-payment-type/:id", component: UpdatePaymentTypeComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },

  //printers
  { path: "view-printer", component: ViewPrinterComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "assign-printer", component: AssignPrinterComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "update-assigned-printer", component: UpdateAssignedPrinterComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "update-assigned-printer/:id", component: UpdateAssignedPrinterComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },

  //printer error log
  { path: "admin-error-log", component: AdminErrorLogsComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "view-printer-error/:id", component: ViewPrinterErrorComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "remote-checklist/:id", component: RemoteChecklistComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "assign-technician/:id", component: AssignTechnicianComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },

  //error codes
  { path: 'view-error-code', component: ViewErrorCodesComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: 'create-error-code', component: CreateErrorCodesComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: 'update-error-code', component: UpdateErrorCodesComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: 'update-error-code/:id', component: UpdateErrorCodesComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },

  //reporting
  { path: "view-reports", component: ReportsComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "stock-report", component: StockReportComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "repair-report", component: RepairReportComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "employee-report", component: EmployeeReportComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "client-report", component: ClientReportComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "sales-report", component: SalesReportComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "purchase-report", component: PurchasesReportComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "assigned-printer-report", component: AssignedPrinterReportComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "tsr-report", component: TechnicalServiceReportingComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },
  { path: "view-tsr/:id", component: ViewTechnicalServiceReportComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN'] } },


  //#################
  //client interfaces
  //navigation
  { path: "client-dashboard", component: ClientHomeComponent, canActivate: [RoleGuard], data: { roles: ['CLIENT_USER', 'CLIENT_ADMIN', 'SUPER_ADMIN'] } },

  { path: "client-financials", component: ClientFinancialsComponent, canActivate: [RoleGuard], data: { roles: ['CLIENT_USER', 'CLIENT_ADMIN', 'SUPER_ADMIN'] } },
  { path: "client-purchase-orders", component: ClientPurchaseOrderComponent, canActivate: [RoleGuard], data: { roles: ['CLIENT_USER', 'CLIENT_ADMIN', 'SUPER_ADMIN'] } },
  { path: "view-invoice/:id", component: ViewInvoiceComponent, canActivate: [RoleGuard], data: { roles: ['CLIENT_USER', 'CLIENT_ADMIN', 'SUPER_ADMIN'] } },
  { path: "view-cpo/:id", component: ViewClientPurchaseOrderComponent, canActivate: [RoleGuard], data: { roles: ['CLIENT_USER', 'CLIENT_ADMIN', 'SUPER_ADMIN'] } },
  { path: "financial-account", component: FinancialAccountsComponent, canActivate: [RoleGuard], data: { roles: ['CLIENT_USER', 'CLIENT_ADMIN', 'SUPER_ADMIN'] } },
  { path: "make-payment", component: MakePaymentsComponent, canActivate: [RoleGuard], data: { roles: ['CLIENT_USER', 'CLIENT_ADMIN', 'SUPER_ADMIN'] } },
  { path: "payment-history", component: PaymentHistoryComponent, canActivate: [RoleGuard], data: { roles: ['CLIENT_USER', 'CLIENT_ADMIN', 'SUPER_ADMIN'] } },
  { path: "view-payment-history/:id", component: ViewPaymentHistoryComponent, canActivate: [RoleGuard], data: { roles: ['CLIENT_USER', 'CLIENT_ADMIN', 'SUPER_ADMIN'] } },
  { path: "view-errorlog-statuses", component: ViewErrorlogStatusesComponent, canActivate: [RoleGuard], data: { roles: ['CLIENT_USER', 'CLIENT_ADMIN', 'SUPER_ADMIN'] } },
  { path: "user-registration", component: UserRegistrationComponent, canActivate: [RoleGuard], data: { roles: ['CLIENT_ADMIN', 'SUPER_ADMIN'] } },
  { path: "log-error", component: LogErrorComponent, canActivate: [RoleGuard], data: { roles: ['CLIENT_USER', 'CLIENT_ADMIN', 'SUPER_ADMIN'] } },
  { path: "client-printers", component: ClientPrintersComponent, canActivate: [RoleGuard], data: { roles: ['CLIENT_USER', 'CLIENT_ADMIN', 'SUPER_ADMIN'] } },
  { path: "assign-branch-printer", component: AssignBranchPrinterComponent, canActivate: [RoleGuard], data: { roles: ['CLIENT_ADMIN', 'SUPER_ADMIN'] } },

  //store
  { path: "acs-store", component: ConsumableShopComponent, canActivate: [RoleGuard], data: { roles: ['CLIENT_USER', 'CLIENT_ADMIN', 'SUPER_ADMIN'] } },
  {
    path: "filter", component: ConsumableShopComponent, canActivate: [RoleGuard], data: { roles: ['CLIENT_USER', 'CLIENT_ADMIN', 'SUPER_ADMIN'] },
    children: [{ path: "", component: FilterComponent, canActivate: [RoleGuard], data: { roles: ['CLIENT_USER', 'CLIENT_ADMIN', 'SUPER_ADMIN'] } },]
  },
  {
    path: "sort", component: ConsumableShopComponent, canActivate: [RoleGuard], data: { roles: ['CLIENT_USER', 'CLIENT_ADMIN', 'SUPER_ADMIN'] },
    children: [{ path: "", component: SortComponent, canActivate: [RoleGuard], data: { roles: ['CLIENT_USER', 'CLIENT_ADMIN', 'SUPER_ADMIN'] } },]
  },

  { path: "cart", component: CartComponent, canActivate: [RoleGuard], data: { roles: ['CLIENT_USER', 'CLIENT_ADMIN', 'SUPER_ADMIN'] } },
  { path: "checkout", component: CheckoutComponent, canActivate: [RoleGuard], data: { roles: ['CLIENT_USER', 'CLIENT_ADMIN', 'SUPER_ADMIN'] } },
  { path: "success", component: SuccessComponent, canActivate: [RoleGuard], data: { roles: ['CLIENT_USER', 'CLIENT_ADMIN', 'SUPER_ADMIN'] } },
  { path: "cancel", component: CancelComponent, canActivate: [RoleGuard], data: { roles: ['CLIENT_USER', 'CLIENT_ADMIN', 'SUPER_ADMIN'] } },


  //#################
  //technician interfaces

  { path: "technician-dashboard", component: TechnicianDashboardComponent, canActivate: [RoleGuard], data: { roles: ['TECHNICIAN', 'SUPER_ADMIN'] } },
  { path: "booked-in-printers", component: BookedInPrintersComponent, canActivate: [RoleGuard], data: { roles: ['TECHNICIAN', 'SUPER_ADMIN'] } },
  { path: "purchase-orders", component: PurchaseOrdersComponent, canActivate: [RoleGuard], data: { roles: ['TECHNICIAN', 'SUPER_ADMIN'] } },
  { path: "technician-bookout-printer", component: TechnicianBookoutPrinterComponent, canActivate: [RoleGuard], data: { roles: ['TECHNICIAN', 'SUPER_ADMIN'] } },
  { path: "technician-printer-selection/:id", component: TechnicianPrinterSelectionComponent, canActivate: [RoleGuard], data: { roles: ['TECHNICIAN', 'SUPER_ADMIN'] } },
  { path: "technician-error-logs/:id", component: TechnicianErrorLogsComponent, canActivate: [RoleGuard], data: { roles: ['TECHNICIAN', 'SUPER_ADMIN'] } },
  { path: "diagnostic-checklist/:id", component: DiagnosticsChecklistComponent, canActivate: [RoleGuard], data: { roles: ['TECHNICIAN', 'SUPER_ADMIN'] } },
  { path: "parts-requests/:id", component: PartsRequestComponent, canActivate: [RoleGuard], data: { roles: ['TECHNICIAN', 'SUPER_ADMIN'] } },
  { path: 'ifel', component: InFieldErrorLogsComponent, canActivate: [RoleGuard], data: { roles: ['TECHNICIAN', 'SUPER_ADMIN'] } },
  { path: 'in-field-checklist/:id', component: InFieldChecklistComponent, canActivate: [RoleGuard], data: { roles: ['TECHNICIAN', 'SUPER_ADMIN'] } },
  { path: 'exchange-printer/:id', component: ExchangePrinterComponent, canActivate: [RoleGuard], data: { roles: ['TECHNICIAN', 'SUPER_ADMIN'] } },
  { path: 'technical-service-report/:id', component: TechnicalServiceReportComponent, canActivate: [RoleGuard], data: { roles: ['TECHNICIAN', 'SUPER_ADMIN'] } },


  //#################
  //inventory interfaces

  { path: "inventory-clerk-dashboard", component: InventoryClerkDashboardComponent, canActivate: [RoleGuard], data: { roles: ['INVENTORY_CLERK', 'SUPER_ADMIN'] } },
  { path: 'book-in-printer', component: BookInPrinterComponent, canActivate: [RoleGuard], data: { roles: ['INVENTORY_CLERK', 'SUPER_ADMIN'] } },
  { path: 'book-out-printer', component: BookOutPrinterComponent, canActivate: [RoleGuard], data: { roles: ['INVENTORY_CLERK', 'SUPER_ADMIN'] } },
  { path: 'book-in-stock', component: BookInStockComponent, canActivate: [RoleGuard], data: { roles: ['INVENTORY_CLERK', 'SUPER_ADMIN'] } },
  { path: 'book-out-stock', component: BookOutStockComponent, canActivate: [RoleGuard], data: { roles: ['INVENTORY_CLERK', 'SUPER_ADMIN'] } },
  { path: 'view-parts-requests', component: ViewPartsRequestsComponent, canActivate: [RoleGuard], data: { roles: ['INVENTORY_CLERK', 'SUPER_ADMIN'] } },
  { path: 'view-parts-request/:id', component: ViewPartsRequestComponent, canActivate: [RoleGuard], data: { roles: ['INVENTORY_CLERK', 'SUPER_ADMIN'] } },
  { path: 'view-supplier-order', component: ViewSupplierOrderComponent, canActivate: [RoleGuard], data: { roles: ['INVENTORY_CLERK', 'SUPER_ADMIN'] } },
  { path: 'view-client-order', component: ViewClientOrderComponent, canActivate: [RoleGuard], data: { roles: ['INVENTORY_CLERK', 'SUPER_ADMIN'] } },
  { path: 'assign-printer-stock/:id', component: AssignPrinterStockComponent, canActivate: [RoleGuard], data: { roles: ['INVENTORY_CLERK', 'SUPER_ADMIN'] } },

  //#################
  //hub interfaces

  //navigation
  // { path: "hub-home", component: HubHomeComponent, canActivate: [RoleGuard], data: { roles: ['HUB_USER'] } },

  // must be last line of code or will not work
  { path: "**", component: PageNotFoundComponent },
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
